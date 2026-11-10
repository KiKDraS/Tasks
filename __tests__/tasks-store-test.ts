import { waitFor } from "@testing-library/react-native";

import { Task, TaskShare } from "@/context/tasks/types/Task";
import { cancelTaskReminder } from "@/context/tasks/utils/notifications";
import { deleteTaskEvent } from "@/services/calendar";
import { deletePhoto } from "@/services/media";
import { readOrSeedTasks, writeTasks } from "@/services/tasks-storage";
import { useTasksStore } from "@/stores/tasks/tasks-store";
import { generateId } from "@/utils/id";

jest.mock("@/services/tasks-storage", () => ({
  readOrSeedTasks: jest.fn(),
  writeTasks: jest.fn(),
}));
jest.mock("@/services/media", () => ({
  deletePhoto: jest.fn(),
}));
jest.mock("@/services/calendar", () => ({
  deleteTaskEvent: jest.fn(),
}));
jest.mock("@/context/tasks/utils/notifications", () => ({
  cancelTaskReminder: jest.fn(),
}));
jest.mock("@/utils/id", () => ({
  generateId: jest.fn(),
}));

const readOrSeedTasksMock = jest.mocked(readOrSeedTasks);
const writeTasksMock = jest.mocked(writeTasks);
const deletePhotoMock = jest.mocked(deletePhoto);
const deleteTaskEventMock = jest.mocked(deleteTaskEvent);
const cancelTaskReminderMock = jest.mocked(cancelTaskReminder);
const generateIdMock = jest.mocked(generateId);

const NOTIFICATION = {
  id: "notification-1",
  scheduledAt: "2026-01-01T10:00:00.000Z",
};

const PAST_NOTIFICATION = {
  id: "notification-past",
  scheduledAt: "2020-01-01T10:00:00.000Z",
};

const FUTURE_NOTIFICATION = {
  id: "notification-future",
  scheduledAt: "2999-01-01T10:00:00.000Z",
};

const NOW = new Date("2026-01-01T12:00:00.000Z");

const buildTask = (overrides: Partial<Task> = {}): Task => ({
  id: "task-1",
  title: "Comprar pan",
  description: "Ir al almacén",
  isComplete: false,
  notification: null,
  ...overrides,
});

beforeEach(() => {
  jest.clearAllMocks();
  readOrSeedTasksMock.mockResolvedValue([]);
  writeTasksMock.mockResolvedValue();
  deleteTaskEventMock.mockResolvedValue();
  cancelTaskReminderMock.mockResolvedValue();
  generateIdMock.mockReturnValue("generated-id");
  useTasksStore.setState({ tasks: [], isLoading: true });
});

describe("hydrate", () => {
  test("sets seeded tasks and clears the loading flag", async () => {
    const seed = [buildTask()];
    readOrSeedTasksMock.mockResolvedValueOnce(seed);

    await useTasksStore.getState().hydrate();

    expect(useTasksStore.getState().tasks).toEqual(seed);
    expect(useTasksStore.getState().isLoading).toBe(false);
  });

  test("clears expired notifications and writes once", async () => {
    const expired = buildTask({
      id: "task-1",
      notification: PAST_NOTIFICATION,
    });
    const pending = buildTask({
      id: "task-2",
      notification: FUTURE_NOTIFICATION,
    });
    readOrSeedTasksMock.mockResolvedValueOnce([expired, pending]);

    await useTasksStore.getState().hydrate();

    const expected = [{ ...expired, notification: null }, pending];
    expect(writeTasksMock).toHaveBeenCalledTimes(1);
    expect(writeTasksMock).toHaveBeenCalledWith(expected);
    expect(useTasksStore.getState().tasks).toEqual(expected);
  });

  test("does not write when nothing expired", async () => {
    const seed = [
      buildTask({ id: "task-1", notification: FUTURE_NOTIFICATION }),
      buildTask({ id: "task-2" }),
    ];
    readOrSeedTasksMock.mockResolvedValueOnce(seed);

    await useTasksStore.getState().hydrate();

    expect(writeTasksMock).not.toHaveBeenCalled();
    expect(useTasksStore.getState().tasks).toEqual(seed);
  });

  test("keeps the cleared tasks in memory when the write fails", async () => {
    const expired = buildTask({
      id: "task-1",
      notification: PAST_NOTIFICATION,
    });
    const pending = buildTask({
      id: "task-2",
      notification: FUTURE_NOTIFICATION,
    });
    readOrSeedTasksMock.mockResolvedValueOnce([expired, pending]);
    writeTasksMock.mockRejectedValueOnce(new Error("write failed"));

    await expect(useTasksStore.getState().hydrate()).resolves.toBeUndefined();

    const expected = [{ ...expired, notification: null }, pending];
    expect(writeTasksMock).toHaveBeenCalledWith(expected);
    expect(useTasksStore.getState().tasks).toEqual(expected);
    expect(useTasksStore.getState().isLoading).toBe(false);
  });
});

describe("addTask", () => {
  test("assigns a generated ID, writes the full array, and updates state", async () => {
    const existing = buildTask({ id: "task-1" });
    const nextTask = buildTask({ id: undefined, title: "Nueva tarea" });
    useTasksStore.setState({ tasks: [existing], isLoading: false });

    await useTasksStore.getState().addTask(nextTask);

    const expected = [existing, { ...nextTask, id: "generated-id" }];
    expect(generateIdMock).toHaveBeenCalledTimes(1);
    expect(writeTasksMock).toHaveBeenCalledWith(expected);
    expect(useTasksStore.getState().tasks).toEqual(expected);
  });
});

describe("updateTask", () => {
  test("updates the matching task and writes", async () => {
    const task = buildTask({ id: "task-1" });
    const other = buildTask({ id: "task-2", title: "Otra tarea" });
    useTasksStore.setState({ tasks: [task, other], isLoading: false });
    const updated = { ...task, title: "Comprar pan integral" };

    await useTasksStore.getState().updateTask(updated);

    expect(writeTasksMock).toHaveBeenCalledWith([updated, other]);
    expect(useTasksStore.getState().tasks).toEqual([updated, other]);
  });

  test("cancels the notification when completing a task", async () => {
    const task = buildTask({ notification: NOTIFICATION });
    useTasksStore.setState({ tasks: [task], isLoading: false });

    await useTasksStore.getState().updateTask({ ...task, isComplete: true });

    expect(cancelTaskReminderMock).toHaveBeenCalledWith(NOTIFICATION.id);
    expect(writeTasksMock).toHaveBeenCalledWith([
      { ...task, isComplete: true, notification: null },
    ]);
    expect(useTasksStore.getState().tasks).toEqual([
      { ...task, isComplete: true, notification: null },
    ]);
  });

  test("keeps a share recorded after a stale form snapshot", async () => {
    const share: TaskShare = {
      method: "share",
      activityType: "com.apple.UIKit.activity.Mail",
      sharedAt: "2026-11-08T10:00:00.000Z",
    };
    const staleSnapshot = buildTask({ id: "task-1" });
    useTasksStore.setState({ tasks: [staleSnapshot], isLoading: false });

    await useTasksStore.getState().recordTaskShare("task-1", share);
    await useTasksStore
      .getState()
      .updateTask({ ...staleSnapshot, title: "updated" });

    expect(useTasksStore.getState().tasks).toEqual([
      { ...staleSnapshot, title: "updated", shares: [share] },
    ]);
  });
});

describe("removeTask", () => {
  test("cancels the pending notification and removes the task", async () => {
    const task = buildTask({ notification: NOTIFICATION });
    const other = buildTask({ id: "task-2" });
    useTasksStore.setState({ tasks: [task, other], isLoading: false });

    await useTasksStore.getState().removeTask(task.id as string);

    expect(cancelTaskReminderMock).toHaveBeenCalledWith(NOTIFICATION.id);
    expect(writeTasksMock).toHaveBeenCalledWith([other]);
    expect(useTasksStore.getState().tasks).toEqual([other]);
    expect(deletePhotoMock).not.toHaveBeenCalled();
    expect(deleteTaskEventMock).not.toHaveBeenCalled();
  });

  test("cleans up every photo and the calendar event after the write", async () => {
    const task = buildTask({
      id: "task-1",
      photoUris: ["file:///photo-1.jpg", "file:///photo-2.jpg"],
      calendarEventId: "event-1",
    });
    useTasksStore.setState({ tasks: [task], isLoading: false });

    await useTasksStore.getState().removeTask(task.id as string);

    expect(writeTasksMock).toHaveBeenCalledWith([]);
    expect(deletePhotoMock).toHaveBeenCalledTimes(2);
    expect(deletePhotoMock).toHaveBeenNthCalledWith(1, "file:///photo-1.jpg");
    expect(deletePhotoMock).toHaveBeenNthCalledWith(2, "file:///photo-2.jpg");
    expect(deleteTaskEventMock).toHaveBeenCalledWith("event-1");
    expect(writeTasksMock.mock.invocationCallOrder[0]).toBeLessThan(
      deletePhotoMock.mock.invocationCallOrder[0],
    );
    expect(deletePhotoMock.mock.invocationCallOrder[0]).toBeLessThan(
      deleteTaskEventMock.mock.invocationCallOrder[0],
    );
  });

  test("cleans up the legacy photoUri after the write", async () => {
    const task = buildTask({
      id: "task-1",
      photoUri: "file:///legacy.jpg",
    });
    useTasksStore.setState({ tasks: [task], isLoading: false });

    await useTasksStore.getState().removeTask(task.id as string);

    expect(writeTasksMock).toHaveBeenCalledWith([]);
    expect(deletePhotoMock).toHaveBeenCalledWith("file:///legacy.jpg");
    expect(deleteTaskEventMock).not.toHaveBeenCalled();
    expect(writeTasksMock.mock.invocationCallOrder[0]).toBeLessThan(
      deletePhotoMock.mock.invocationCallOrder[0],
    );
  });

  test("does nothing when the task is not found", async () => {
    const task = buildTask({ id: "task-1" });
    useTasksStore.setState({ tasks: [task], isLoading: false });

    await useTasksStore.getState().removeTask("unknown-id");

    expect(writeTasksMock).not.toHaveBeenCalled();
    expect(useTasksStore.getState().tasks).toEqual([task]);
    expect(deletePhotoMock).not.toHaveBeenCalled();
    expect(deleteTaskEventMock).not.toHaveBeenCalled();
  });
});

describe("toggleComplete", () => {
  test("flips isComplete", async () => {
    const task = buildTask({ isComplete: false });
    useTasksStore.setState({ tasks: [task], isLoading: false });

    await useTasksStore.getState().toggleComplete(task.id as string);

    expect(useTasksStore.getState().tasks).toEqual([
      { ...task, isComplete: true },
    ]);
  });
});

describe("clearSentNotification", () => {
  test("clears the matching notification", async () => {
    const task = buildTask({ notification: NOTIFICATION });
    useTasksStore.setState({ tasks: [task], isLoading: false });

    await useTasksStore.getState().clearSentNotification(NOTIFICATION.id);

    expect(writeTasksMock).toHaveBeenCalledWith([
      { ...task, notification: null },
    ]);
    expect(useTasksStore.getState().tasks).toEqual([
      { ...task, notification: null },
    ]);
  });

  test("does nothing when no task matches", async () => {
    const task = buildTask({ notification: NOTIFICATION });
    useTasksStore.setState({ tasks: [task], isLoading: false });

    await useTasksStore.getState().clearSentNotification("unknown-id");

    expect(writeTasksMock).not.toHaveBeenCalled();
    expect(useTasksStore.getState().tasks).toEqual([task]);
  });
});

describe("recordTaskShare", () => {
  const FIRST_SHARE: TaskShare = {
    method: "share",
    activityType: "com.apple.UIKit.activity.Mail",
    sharedAt: "2026-11-08T10:00:00.000Z",
  };
  const SECOND_SHARE: TaskShare = {
    method: "contact",
    recipientName: "Ana Pérez",
    activityType: "net.whatsapp.WhatsApp",
    sharedAt: "2026-11-09T14:30:00.000Z",
  };

  test("appends the share to an existing task and persists", async () => {
    const task = buildTask({ shares: [FIRST_SHARE] });
    const other = buildTask({ id: "task-2", title: "Otra tarea" });
    useTasksStore.setState({ tasks: [task, other], isLoading: false });

    await useTasksStore.getState().recordTaskShare("task-1", SECOND_SHARE);

    const expected = [{ ...task, shares: [FIRST_SHARE, SECOND_SHARE] }, other];
    expect(writeTasksMock).toHaveBeenCalledWith(expected);
    expect(useTasksStore.getState().tasks).toEqual(expected);
  });

  test("appends a second share to the history", async () => {
    const task = buildTask();
    useTasksStore.setState({ tasks: [task], isLoading: false });

    await useTasksStore.getState().recordTaskShare("task-1", FIRST_SHARE);
    await useTasksStore.getState().recordTaskShare("task-1", SECOND_SHARE);

    const expected = {
      ...task,
      shares: [FIRST_SHARE, SECOND_SHARE],
    };
    expect(useTasksStore.getState().tasks).toEqual([expected]);
    expect(writeTasksMock).toHaveBeenLastCalledWith([expected]);
  });

  test("does nothing when the task is not found", async () => {
    const task = buildTask();
    useTasksStore.setState({ tasks: [task], isLoading: false });

    await useTasksStore
      .getState()
      .recordTaskShare("unknown-id", SECOND_SHARE);

    expect(writeTasksMock).not.toHaveBeenCalled();
    expect(useTasksStore.getState().tasks).toEqual([task]);
  });

  test("keeps the share in memory when the write fails", async () => {
    const task = buildTask();
    useTasksStore.setState({ tasks: [task], isLoading: false });
    writeTasksMock.mockRejectedValueOnce(new Error("write failed"));

    await expect(
      useTasksStore.getState().recordTaskShare("task-1", SECOND_SHARE),
    ).resolves.toBeUndefined();

    expect(writeTasksMock).toHaveBeenCalledWith([
      { ...task, shares: [SECOND_SHARE] },
    ]);
    expect(useTasksStore.getState().tasks).toEqual([
      { ...task, shares: [SECOND_SHARE] },
    ]);
  });
});

describe("clearExpiredNotifications", () => {
  test("clears expired notifications and persists the change", async () => {
    const expired = buildTask({ notification: PAST_NOTIFICATION });
    const pending = buildTask({
      id: "task-2",
      notification: FUTURE_NOTIFICATION,
    });
    useTasksStore.setState({ tasks: [expired, pending], isLoading: false });

    await useTasksStore.getState().clearExpiredNotifications(NOW);

    const expected = [{ ...expired, notification: null }, pending];
    expect(writeTasksMock).toHaveBeenCalledTimes(1);
    expect(writeTasksMock).toHaveBeenCalledWith(expected);
    expect(useTasksStore.getState().tasks).toEqual(expected);
  });

  test("does not write when no notification expired", async () => {
    const pending = buildTask({ notification: FUTURE_NOTIFICATION });
    const none = buildTask({ id: "task-2" });
    useTasksStore.setState({ tasks: [pending, none], isLoading: false });

    await useTasksStore.getState().clearExpiredNotifications(NOW);

    expect(writeTasksMock).not.toHaveBeenCalled();
    expect(useTasksStore.getState().tasks).toEqual([pending, none]);
  });

  test("keeps the cleared tasks in memory when the write fails", async () => {
    const expired = buildTask({ notification: PAST_NOTIFICATION });
    const pending = buildTask({
      id: "task-2",
      notification: FUTURE_NOTIFICATION,
    });
    useTasksStore.setState({ tasks: [expired, pending], isLoading: false });
    writeTasksMock.mockRejectedValueOnce(new Error("write failed"));

    await expect(
      useTasksStore.getState().clearExpiredNotifications(NOW),
    ).resolves.toBeUndefined();

    expect(useTasksStore.getState().tasks).toEqual([
      { ...expired, notification: null },
      pending,
    ]);
  });

  test("keeps a cleared notification and a task added while the write is pending", async () => {
    const expired = buildTask({ notification: PAST_NOTIFICATION });
    const added = buildTask({ id: "task-2", title: "Nueva tarea" });
    useTasksStore.setState({ tasks: [expired], isLoading: false });

    let resolveWrite!: () => void;
    const pendingWrite = new Promise<void>((resolve) => {
      resolveWrite = resolve;
    });
    writeTasksMock.mockReturnValueOnce(pendingWrite);

    const clearPromise = useTasksStore.getState().clearExpiredNotifications(NOW);
    const addPromise = useTasksStore.getState().addTask(added);

    await waitFor(() => expect(writeTasksMock).toHaveBeenCalledTimes(1));
    expect(useTasksStore.getState().tasks).toEqual([expired]);

    resolveWrite();
    await Promise.all([clearPromise, addPromise]);

    const expected = [{ ...expired, notification: null }, added];
    expect(useTasksStore.getState().tasks).toEqual(expected);
    expect(writeTasksMock).toHaveBeenCalledTimes(2);
    expect(writeTasksMock).toHaveBeenLastCalledWith(expected);
  });
});
