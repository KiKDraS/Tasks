import { act, renderHook } from "@testing-library/react-native";
import { Alert } from "react-native";

import type { Task } from "@/context/tasks/types/Task";
import { TASK_FORM_ACTION_TYPES } from "@/hooks/task-form/constants";
import { useTaskForm } from "@/hooks/task-form/use-task-form";
import { resolveTaskNotification } from "@/hooks/task-form/utils/resolve-task-notification";
import { saveTask } from "@/hooks/task-form/utils/save-task";
import { createTaskEvent, deleteTaskEvent } from "@/services/calendar";
import { DEVICE_MESSAGES } from "@/services/constants/device-messages";
import { deletePhoto } from "@/services/media";
import { useTasksStore } from "@/stores/tasks/tasks-store";
import { router } from "expo-router";

jest.mock("@/stores/tasks/tasks-store", () => ({
  useTasksStore: jest.fn(),
}));

jest.mock("@/hooks/task-form/utils/save-task", () => ({
  saveTask: jest.fn(),
}));

jest.mock("@/hooks/task-form/utils/resolve-task-notification", () => ({
  resolveTaskNotification: jest.fn(),
}));

jest.mock("@/services/calendar", () => ({
  createTaskEvent: jest.fn(),
  deleteTaskEvent: jest.fn(),
}));

jest.mock("@/services/media", () => ({
  deletePhoto: jest.fn(),
}));

jest.mock("expo-router", () => ({
  router: { back: jest.fn(), setParams: jest.fn() },
}));

const addTask = jest.fn();
const updateTask = jest.fn();

const useTasksStoreMock = useTasksStore as unknown as jest.Mock;
const saveTaskMock = jest.mocked(saveTask);
const resolveTaskNotificationMock = jest.mocked(resolveTaskNotification);
const createTaskEventMock = jest.mocked(createTaskEvent);
const deleteTaskEventMock = jest.mocked(deleteTaskEvent);
const deletePhotoMock = jest.mocked(deletePhoto);
const routerMock = jest.mocked(router);
const alertSpy = jest.spyOn(Alert, "alert").mockImplementation(() => {});

beforeEach(() => {
  jest.clearAllMocks();
  useTasksStoreMock.mockImplementation(
    (
      selector: (state: {
        addTask: typeof addTask;
        updateTask: typeof updateTask;
      }) => unknown,
    ) => selector({ addTask, updateTask }),
  );
  resolveTaskNotificationMock.mockResolvedValue(null);
  saveTaskMock.mockResolvedValue(undefined);
  deleteTaskEventMock.mockResolvedValue(undefined);
});

async function submitWithReminder(options: {
  task?: Task;
  reminderEnabled?: boolean;
}) {
  const { result } = await renderHook(() => useTaskForm(options.task));

  await act(async () => {
    result.current.dispatch({
      type: TASK_FORM_ACTION_TYPES.SET_TITLE,
      payload: "Comprar pan",
    });
    result.current.dispatch({
      type: TASK_FORM_ACTION_TYPES.SET_DESCRIPTION,
      payload: "Ir al almacén",
    });
    const shouldDisableReminder =
      options.reminderEnabled === false && result.current.state.reminderEnabled;
    if (shouldDisableReminder) {
      result.current.dispatch({ type: TASK_FORM_ACTION_TYPES.TOGGLE_REMINDER });
    }
  });

  await act(async () => {
    await result.current.handleSubmit();
  });

  return result;
}

describe("useTaskForm calendar attachment", () => {
  test("creates the event, saves its id, and navigates back when the reminder is on", async () => {
    createTaskEventMock.mockResolvedValue({
      status: "granted",
      value: { eventId: "event-1" },
    });

    const result = await submitWithReminder({ reminderEnabled: true });

    expect(createTaskEventMock).toHaveBeenCalledWith(
      expect.objectContaining({
        title: "Comprar pan",
        description: "Ir al almacén",
      }),
    );
    expect(result.current.state.calendarEventId).toBe("event-1");
    expect(resolveTaskNotificationMock).toHaveBeenCalledWith(
      expect.objectContaining({ reminderEnabled: true }),
    );
    expect(saveTaskMock).toHaveBeenCalledWith(
      expect.objectContaining({
        fields: expect.objectContaining({ calendarEventId: "event-1" }),
      }),
    );
    expect(alertSpy).not.toHaveBeenCalled();
    expect(routerMock.back).toHaveBeenCalledTimes(1);
  });

  test("saves, navigates back, then shows the skipped alert when the calendar permission is denied", async () => {
    createTaskEventMock.mockResolvedValue({
      status: "denied",
      canAskAgain: true,
    });

    const result = await submitWithReminder({ reminderEnabled: true });

    expect(result.current.state.calendarState).toEqual({
      status: "denied",
      canAskAgain: true,
    });
    expect(result.current.state.isSubmitting).toBe(false);
    expect(resolveTaskNotificationMock).toHaveBeenCalledWith(
      expect.objectContaining({ reminderEnabled: true }),
    );
    expect(saveTaskMock).toHaveBeenCalledWith(
      expect.objectContaining({
        fields: expect.objectContaining({ calendarEventId: null }),
      }),
    );
    expect(routerMock.back).toHaveBeenCalledTimes(1);
    expect(alertSpy).toHaveBeenCalledWith(
      "No se agregó al calendario",
      DEVICE_MESSAGES.calendarSkipped,
      [{ text: "Entendido" }],
    );
    expect(saveTaskMock.mock.invocationCallOrder[0]).toBeLessThan(
      routerMock.back.mock.invocationCallOrder[0],
    );
    expect(routerMock.back.mock.invocationCallOrder[0]).toBeLessThan(
      alertSpy.mock.invocationCallOrder[0],
    );

    const buttons = alertSpy.mock.calls[0][2];
    const understood = buttons?.find((button) => button.text === "Entendido");
    expect(understood).toBeDefined();
    expect(understood?.onPress).toBeUndefined();

    await act(async () => {
      understood?.onPress?.();
    });

    expect(routerMock.back).toHaveBeenCalledTimes(1);
  });

  test("uses the notification message when the calendar is skipped with a scheduled reminder", async () => {
    createTaskEventMock.mockResolvedValue({
      status: "denied",
      canAskAgain: true,
    });
    resolveTaskNotificationMock.mockResolvedValue({
      id: "notification-1",
      scheduledAt: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
    });

    await submitWithReminder({ reminderEnabled: true });

    expect(alertSpy).toHaveBeenCalledWith(
      "No se agregó al calendario",
      DEVICE_MESSAGES.calendarSkippedWithNotification,
      [{ text: "Entendido" }],
    );
    expect(routerMock.back).toHaveBeenCalledTimes(1);
    expect(routerMock.back.mock.invocationCallOrder[0]).toBeLessThan(
      alertSpy.mock.invocationCallOrder[0],
    );
  });

  test("still saves and shows the device message when the event creation errors", async () => {
    const message = "No pudimos acceder a tu calendario. Intentá de nuevo.";
    createTaskEventMock.mockResolvedValue({ status: "error", message });

    const result = await submitWithReminder({ reminderEnabled: true });

    expect(result.current.state.calendarState).toEqual({
      status: "error",
      message,
    });
    expect(resolveTaskNotificationMock).toHaveBeenCalledWith(
      expect.objectContaining({ reminderEnabled: true }),
    );
    expect(saveTaskMock).toHaveBeenCalledWith(
      expect.objectContaining({
        fields: expect.objectContaining({ calendarEventId: null }),
      }),
    );
    expect(alertSpy).toHaveBeenCalledWith(
      "No se agregó al calendario",
      message,
      [{ text: "Entendido" }],
    );
    expect(routerMock.back).toHaveBeenCalledTimes(1);
    expect(saveTaskMock.mock.invocationCallOrder[0]).toBeLessThan(
      routerMock.back.mock.invocationCallOrder[0],
    );
    expect(routerMock.back.mock.invocationCallOrder[0]).toBeLessThan(
      alertSpy.mock.invocationCallOrder[0],
    );
  });

  test("skips the event and saves no event id when the reminder is off", async () => {
    const result = await submitWithReminder({ reminderEnabled: false });

    expect(createTaskEventMock).not.toHaveBeenCalled();
    expect(result.current.state.reminderEnabled).toBe(false);
    expect(resolveTaskNotificationMock).toHaveBeenCalledWith(
      expect.objectContaining({ reminderEnabled: false }),
    );
    expect(saveTaskMock).toHaveBeenCalledWith(
      expect.objectContaining({
        fields: expect.objectContaining({ calendarEventId: null }),
      }),
    );
    expect(alertSpy).not.toHaveBeenCalled();
    expect(routerMock.back).toHaveBeenCalledTimes(1);
  });

  test("deletes the existing event when the reminder is turned off while editing", async () => {
    const scheduledAt = new Date(Date.now() + 60 * 60 * 1000).toISOString();
    const task: Task = {
      id: "task-1",
      title: "Comprar pan",
      description: "Ir al almacén",
      notification: { id: "notification-1", scheduledAt },
      calendarEventId: "event-1",
    };

    const result = await submitWithReminder({
      task,
      reminderEnabled: false,
    });

    expect(result.current.state.reminderEnabled).toBe(false);
    expect(createTaskEventMock).not.toHaveBeenCalled();
    expect(saveTaskMock).toHaveBeenCalledWith(
      expect.objectContaining({
        task,
        fields: expect.objectContaining({ calendarEventId: null }),
      }),
    );
    expect(resolveTaskNotificationMock).toHaveBeenCalledWith(
      expect.objectContaining({
        reminderEnabled: false,
        previousNotification: task.notification,
      }),
    );
    expect(deleteTaskEventMock).toHaveBeenCalledWith("event-1");
    expect(deletePhotoMock).not.toHaveBeenCalled();
    expect(alertSpy).not.toHaveBeenCalled();
    expect(routerMock.back).toHaveBeenCalledTimes(1);
  });

  test("keeps the existing event id and skips the notification for a completed task", async () => {
    const task: Task = {
      id: "task-1",
      title: "Comprar pan",
      description: "Ir al almacén",
      isComplete: true,
      notification: null,
      calendarEventId: "event-1",
    };

    const result = await submitWithReminder({ task });

    expect(result.current.state.reminderEnabled).toBe(false);
    expect(createTaskEventMock).not.toHaveBeenCalled();
    expect(resolveTaskNotificationMock).toHaveBeenCalledWith(
      expect.objectContaining({ reminderEnabled: false }),
    );
    expect(saveTaskMock).toHaveBeenCalledWith(
      expect.objectContaining({
        task,
        fields: expect.objectContaining({ calendarEventId: "event-1" }),
        notification: null,
      }),
    );
    expect(deleteTaskEventMock).not.toHaveBeenCalled();
    expect(deletePhotoMock).not.toHaveBeenCalled();
    expect(alertSpy).not.toHaveBeenCalled();
    expect(routerMock.back).toHaveBeenCalledTimes(1);
  });
});
