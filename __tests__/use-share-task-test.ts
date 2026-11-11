import { act, renderHook } from "@testing-library/react-native";
import { Alert, Share, type AlertButton } from "react-native";

import { PERMISSION_NOTICE_COPY } from "@/components/ui/permissions/constants";
import type { Task } from "@/context/tasks/types/Task";
import { useShareTask } from "@/hooks/tasks/use-share-task";
import { DEVICE_MESSAGES } from "@/services/constants/device-messages";
import { pickContact } from "@/services/contacts";
import { openAppSettings } from "@/services/permissions";
import { writeTasks } from "@/services/tasks-storage";
import { useTasksStore } from "@/stores/tasks/tasks-store";

jest.mock("@/services/contacts", () => ({
  pickContact: jest.fn(),
}));

jest.mock("@/services/permissions", () => ({
  openAppSettings: jest.fn(),
}));

jest.mock("@/services/tasks-storage", () => ({
  readOrSeedTasks: jest.fn(),
  writeTasks: jest.fn(),
}));

const TASK: Task = {
  id: "task-1",
  title: "Comprar pan",
  description: "Ir al almacén",
  notification: null,
};

const MESSAGE =
  "Tarea: Comprar pan\nDescripción: Ir al almacén\nEstado: Pendiente";

const pickContactMock = jest.mocked(pickContact);
const openAppSettingsMock = jest.mocked(openAppSettings);
const writeTasksMock = jest.mocked(writeTasks);
const alertSpy = jest.spyOn(Alert, "alert").mockImplementation(() => {});
const shareSpy = jest.spyOn(Share, "share");

function getMenuButtons(): AlertButton[] {
  return (alertSpy.mock.calls[0][2] ?? []) as AlertButton[];
}

beforeEach(() => {
  jest.clearAllMocks();
  shareSpy.mockResolvedValue({ action: Share.sharedAction });
  writeTasksMock.mockResolvedValue();
  useTasksStore.setState({ tasks: [TASK], isLoading: false });
});

describe("useShareTask", () => {
  test("shares the task through the native share sheet", async () => {
    const { result } = await renderHook(() => useShareTask(TASK));

    await act(async () => {
      await result.current.share();
    });

    expect(shareSpy).toHaveBeenCalledWith({
      message: MESSAGE,
      title: "Comprar pan",
    });
    expect(alertSpy).not.toHaveBeenCalled();
  });

  test("does nothing when there is no task", async () => {
    const { result } = await renderHook(() => useShareTask());

    await act(async () => {
      await result.current.share();
      await result.current.shareWithContact();
    });

    expect(shareSpy).not.toHaveBeenCalled();
    expect(pickContactMock).not.toHaveBeenCalled();
  });

  test("shares with the picked contact as the recipient", async () => {
    pickContactMock.mockResolvedValue({
      status: "granted",
      value: { id: "contact-1", name: "Ana Pérez" },
    });

    const { result } = await renderHook(() => useShareTask(TASK));

    await act(async () => {
      await result.current.shareWithContact();
    });

    expect(pickContactMock).toHaveBeenCalledTimes(1);
    expect(shareSpy).toHaveBeenCalledWith({
      message: `Para Ana Pérez:\n\n${MESSAGE}`,
      title: "Ana Pérez",
    });
  });

  test("alerts a denied contact permission with retry copy", async () => {
    pickContactMock.mockResolvedValue({ status: "denied", canAskAgain: true });

    const { result } = await renderHook(() => useShareTask(TASK));

    await act(async () => {
      await result.current.shareWithContact();
    });

    expect(alertSpy).toHaveBeenCalledWith(
      "Compartir con contacto",
      PERMISSION_NOTICE_COPY.denied,
      [{ text: "Entendido" }],
    );
    expect(shareSpy).not.toHaveBeenCalled();
  });

  test("alerts a blocked contact permission and opens settings", async () => {
    pickContactMock.mockResolvedValue({ status: "denied", canAskAgain: false });

    const { result } = await renderHook(() => useShareTask(TASK));

    await act(async () => {
      await result.current.shareWithContact();
    });

    expect(alertSpy).toHaveBeenCalledWith(
      "Compartir con contacto",
      PERMISSION_NOTICE_COPY.blocked,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: PERMISSION_NOTICE_COPY.openSettings,
          onPress: expect.any(Function),
        },
      ],
    );

    const settingsButton = getMenuButtons()[1];
    await act(async () => {
      settingsButton.onPress?.();
    });

    expect(openAppSettingsMock).toHaveBeenCalledTimes(1);
    expect(shareSpy).not.toHaveBeenCalled();
  });

  test("stays silent when the contact picker is cancelled", async () => {
    pickContactMock.mockResolvedValue({ status: "cancelled" });

    const { result } = await renderHook(() => useShareTask(TASK));

    await act(async () => {
      await result.current.shareWithContact();
    });

    expect(alertSpy).not.toHaveBeenCalled();
    expect(shareSpy).not.toHaveBeenCalled();
  });

  test("alerts the device message when the contact picker errors", async () => {
    pickContactMock.mockResolvedValue({
      status: "error",
      message: DEVICE_MESSAGES.contactsError,
    });

    const { result } = await renderHook(() => useShareTask(TASK));

    await act(async () => {
      await result.current.shareWithContact();
    });

    expect(alertSpy).toHaveBeenCalledWith(
      "No se pudo compartir",
      DEVICE_MESSAGES.contactsError,
      [{ text: "Entendido" }],
    );
    expect(shareSpy).not.toHaveBeenCalled();
  });

  test("alerts when the native share sheet fails", async () => {
    shareSpy.mockRejectedValueOnce(new Error("share failed"));

    const { result } = await renderHook(() => useShareTask(TASK));

    await act(async () => {
      await result.current.share();
    });

    expect(alertSpy).toHaveBeenCalledWith("No se pudo compartir", "Intentá de nuevo.", [
      { text: "Entendido" },
    ]);
  });

  test("opens the share menu with share and contact options", async () => {
    const { result } = await renderHook(() => useShareTask(TASK));

    await act(async () => {
      result.current.openShareMenu();
    });

    expect(alertSpy).toHaveBeenCalledWith("Compartir tarea", undefined, [
      { text: "Compartir", onPress: expect.any(Function) },
      { text: "Compartir con contacto", onPress: expect.any(Function) },
      { text: "Cancelar", style: "cancel" },
    ]);
  });

  test("shares from the menu share button", async () => {
    const { result } = await renderHook(() => useShareTask(TASK));
    await act(async () => {
      result.current.openShareMenu();
    });

    const shareButton = getMenuButtons().find(
      (button) => button.text === "Compartir",
    );

    await act(async () => {
      shareButton?.onPress?.();
    });

    expect(shareSpy).toHaveBeenCalledTimes(1);
  });

  test("opens the contact picker from the menu contact button", async () => {
    pickContactMock.mockResolvedValue({ status: "cancelled" });

    const { result } = await renderHook(() => useShareTask(TASK));
    await act(async () => {
      result.current.openShareMenu();
    });

    const contactButton = getMenuButtons().find(
      (button) => button.text === "Compartir con contacto",
    );

    await act(async () => {
      contactButton?.onPress?.();
    });

    expect(pickContactMock).toHaveBeenCalledTimes(1);
  });
});

describe("useShareTask share history", () => {
  test("records a plain share with its activity type", async () => {
    shareSpy.mockResolvedValueOnce({
      action: Share.sharedAction,
      activityType: "com.apple.UIKit.activity.Mail",
    });

    const { result } = await renderHook(() => useShareTask(TASK));

    await act(async () => {
      await result.current.share();
    });

    expect(useTasksStore.getState().tasks[0].shares).toEqual([
      {
        method: "share",
        activityType: "com.apple.UIKit.activity.Mail",
        sharedAt: expect.any(String),
      },
    ]);
    expect(writeTasksMock).toHaveBeenCalledTimes(1);
  });

  test("records a contact share with the recipient", async () => {
    pickContactMock.mockResolvedValue({
      status: "granted",
      value: { id: "contact-1", name: "Ana Pérez" },
    });
    shareSpy.mockResolvedValueOnce({
      action: Share.sharedAction,
      activityType: "net.whatsapp.WhatsApp",
    });

    const { result } = await renderHook(() => useShareTask(TASK));

    await act(async () => {
      await result.current.shareWithContact();
    });

    expect(useTasksStore.getState().tasks[0].shares).toEqual([
      {
        method: "contact",
        recipientName: "Ana Pérez",
        activityType: "net.whatsapp.WhatsApp",
        sharedAt: expect.any(String),
      },
    ]);
  });

  test("records nothing when the share is dismissed", async () => {
    shareSpy.mockResolvedValueOnce({ action: Share.dismissedAction });

    const { result } = await renderHook(() => useShareTask(TASK));

    await act(async () => {
      await result.current.share();
    });

    expect(useTasksStore.getState().tasks).toEqual([TASK]);
    expect(writeTasksMock).not.toHaveBeenCalled();
  });

  test("records nothing and alerts when the share fails", async () => {
    shareSpy.mockRejectedValueOnce(new Error("share failed"));

    const { result } = await renderHook(() => useShareTask(TASK));

    await act(async () => {
      await result.current.share();
    });

    expect(alertSpy).toHaveBeenCalledWith(
      "No se pudo compartir",
      "Intentá de nuevo.",
      [{ text: "Entendido" }],
    );
    expect(useTasksStore.getState().tasks).toEqual([TASK]);
    expect(writeTasksMock).not.toHaveBeenCalled();
  });

  test("keeps the share when recording the history fails", async () => {
    const originalRecordTaskShare = useTasksStore.getState().recordTaskShare;
    const recordTaskShareMock = jest
      .fn()
      .mockRejectedValue(new Error("write failed"));
    useTasksStore.setState({ recordTaskShare: recordTaskShareMock });

    try {
      const { result } = await renderHook(() => useShareTask(TASK));

      await act(async () => {
        await result.current.share();
      });

      expect(shareSpy).toHaveBeenCalledTimes(1);
      expect(recordTaskShareMock).toHaveBeenCalledTimes(1);
      expect(alertSpy).not.toHaveBeenCalledWith(
        "No se pudo compartir",
        expect.anything(),
        expect.anything(),
      );
      expect(useTasksStore.getState().tasks).toEqual([TASK]);
    } finally {
      await act(async () => {
        useTasksStore.setState({ recordTaskShare: originalRecordTaskShare });
      });
    }
  });

  test("records nothing when the task has no id", async () => {
    shareSpy.mockResolvedValueOnce({
      action: Share.sharedAction,
      activityType: "com.apple.UIKit.activity.Mail",
    });

    const { result } = await renderHook(() =>
      useShareTask({ ...TASK, id: undefined }),
    );

    await act(async () => {
      await result.current.share();
    });

    expect(useTasksStore.getState().tasks).toEqual([TASK]);
    expect(writeTasksMock).not.toHaveBeenCalled();
  });
});
