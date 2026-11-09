import { act, renderHook } from "@testing-library/react-native";

import type { Task } from "@/context/tasks/types/Task";
import { TASK_FORM_ACTION_TYPES } from "@/hooks/task-form/constants";
import { useTaskForm } from "@/hooks/task-form/use-task-form";
import { resolveTaskNotification } from "@/hooks/task-form/utils/resolve-task-notification";
import { saveTask } from "@/hooks/task-form/utils/save-task";
import { createTaskEvent, deleteTaskEvent } from "@/services/calendar";
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
  router: { back: jest.fn() },
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

beforeEach(() => {
  jest.clearAllMocks();
  useTasksStoreMock.mockImplementation(
    (selector: (state: { addTask: typeof addTask; updateTask: typeof updateTask }) => unknown) =>
      selector({ addTask, updateTask }),
  );
  resolveTaskNotificationMock.mockResolvedValue(null);
  saveTaskMock.mockResolvedValue(undefined);
  deleteTaskEventMock.mockResolvedValue(undefined);
});

async function submitWithSchedule(options: {
  reminderEnabled: boolean;
  calendarEnabled: boolean;
}) {
  const { result } = await renderHook(() => useTaskForm());

  await act(async () => {
    result.current.dispatch({
      type: TASK_FORM_ACTION_TYPES.SET_TITLE,
      payload: "Comprar pan",
    });
    if (!options.reminderEnabled) {
      result.current.dispatch({ type: TASK_FORM_ACTION_TYPES.TOGGLE_REMINDER });
    }
    if (options.calendarEnabled) {
      result.current.dispatch({
        type: TASK_FORM_ACTION_TYPES.SET_CALENDAR_ENABLED,
        payload: true,
      });
    }
  });

  await act(async () => {
    await result.current.handleSubmit();
  });
}

describe("useTaskForm calendar attachment", () => {
  test("creates the event, saves its id, and navigates back", async () => {
    createTaskEventMock.mockResolvedValue({
      status: "granted",
      value: { eventId: "event-1" },
    });
    const { result } = await renderHook(() => useTaskForm());

    await act(async () => {
      result.current.dispatch({
        type: TASK_FORM_ACTION_TYPES.SET_TITLE,
        payload: "Comprar pan",
      });
      result.current.dispatch({
        type: TASK_FORM_ACTION_TYPES.SET_DESCRIPTION,
        payload: "Ir al almacén",
      });
      result.current.dispatch({
        type: TASK_FORM_ACTION_TYPES.SET_CALENDAR_ENABLED,
        payload: true,
      });
    });

    await act(async () => {
      await result.current.handleSubmit();
    });

    expect(createTaskEventMock).toHaveBeenCalledWith(
      expect.objectContaining({
        title: "Comprar pan",
        description: "Ir al almacén",
      }),
    );
    expect(result.current.state.calendarEventId).toBe("event-1");
    expect(saveTaskMock).toHaveBeenCalledWith(
      expect.objectContaining({
        fields: expect.objectContaining({ calendarEventId: "event-1" }),
        addTask,
        updateTask,
      }),
    );
    expect(routerMock.back).toHaveBeenCalledTimes(1);
  });

  test("does not save or navigate when the calendar permission is blocked", async () => {
    createTaskEventMock.mockResolvedValue({
      status: "denied",
      canAskAgain: false,
    });
    const { result } = await renderHook(() => useTaskForm());

    await act(async () => {
      result.current.dispatch({
        type: TASK_FORM_ACTION_TYPES.SET_TITLE,
        payload: "Comprar pan",
      });
      result.current.dispatch({
        type: TASK_FORM_ACTION_TYPES.SET_CALENDAR_ENABLED,
        payload: true,
      });
    });

    await act(async () => {
      await result.current.handleSubmit();
    });

    expect(result.current.state.calendarState).toEqual({ status: "blocked" });
    expect(result.current.state.isSubmitting).toBe(false);
    expect(saveTaskMock).not.toHaveBeenCalled();
    expect(resolveTaskNotificationMock).not.toHaveBeenCalled();
    expect(routerMock.back).not.toHaveBeenCalled();
  });

  test("removes the event when editing and the calendar is toggled off", async () => {
    const task: Task = {
      id: "task-1",
      title: "Comprar pan",
      description: "Ir al almacén",
      notification: null,
      calendarEventId: "event-1",
    };
    const { result } = await renderHook(() => useTaskForm(task));

    await act(async () => {
      result.current.dispatch({
        type: TASK_FORM_ACTION_TYPES.SET_CALENDAR_ENABLED,
        payload: false,
      });
    });

    await act(async () => {
      await result.current.handleSubmit();
    });

    expect(createTaskEventMock).not.toHaveBeenCalled();
    expect(saveTaskMock).toHaveBeenCalledWith(
      expect.objectContaining({
        task,
        fields: expect.objectContaining({ calendarEventId: null }),
      }),
    );
    expect(deleteTaskEventMock).toHaveBeenCalledWith("event-1");
    expect(deletePhotoMock).not.toHaveBeenCalled();
    expect(routerMock.back).toHaveBeenCalledTimes(1);
  });

  test("skips the event and saves no event id when both switches are off", async () => {
    await submitWithSchedule({ reminderEnabled: false, calendarEnabled: false });

    expect(createTaskEventMock).not.toHaveBeenCalled();
    expect(resolveTaskNotificationMock).toHaveBeenCalledWith(
      expect.objectContaining({ reminderEnabled: false }),
    );
    expect(saveTaskMock).toHaveBeenCalledWith(
      expect.objectContaining({
        fields: expect.objectContaining({ calendarEventId: null }),
      }),
    );
  });

  test("skips the event when only the app reminder is on", async () => {
    await submitWithSchedule({ reminderEnabled: true, calendarEnabled: false });

    expect(createTaskEventMock).not.toHaveBeenCalled();
    expect(resolveTaskNotificationMock).toHaveBeenCalledWith(
      expect.objectContaining({ reminderEnabled: true }),
    );
  });

  test("creates the event when only the calendar is on", async () => {
    createTaskEventMock.mockResolvedValue({
      status: "granted",
      value: { eventId: "event-1" },
    });

    await submitWithSchedule({ reminderEnabled: false, calendarEnabled: true });

    expect(createTaskEventMock).toHaveBeenCalledTimes(1);
    expect(resolveTaskNotificationMock).toHaveBeenCalledWith(
      expect.objectContaining({ reminderEnabled: false }),
    );
    expect(saveTaskMock).toHaveBeenCalledWith(
      expect.objectContaining({
        fields: expect.objectContaining({ calendarEventId: "event-1" }),
      }),
    );
  });

  test("creates the event and schedules the notification when both are on", async () => {
    createTaskEventMock.mockResolvedValue({
      status: "granted",
      value: { eventId: "event-2" },
    });

    await submitWithSchedule({ reminderEnabled: true, calendarEnabled: true });

    expect(createTaskEventMock).toHaveBeenCalledTimes(1);
    expect(resolveTaskNotificationMock).toHaveBeenCalledWith(
      expect.objectContaining({ reminderEnabled: true }),
    );
    expect(saveTaskMock).toHaveBeenCalledWith(
      expect.objectContaining({
        fields: expect.objectContaining({ calendarEventId: "event-2" }),
      }),
    );
  });
});
