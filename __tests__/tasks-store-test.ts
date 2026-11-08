import { Task } from "@/context/tasks/types/Task";
import { cancelTaskReminder } from "@/context/tasks/utils/notifications";
import { readOrSeedTasks, writeTasks } from "@/services/tasks-storage";
import { useTasksStore } from "@/stores/tasks/tasks-store";
import { generateId } from "@/utils/id";

jest.mock("@/services/tasks-storage", () => ({
  readOrSeedTasks: jest.fn(),
  writeTasks: jest.fn(),
}));
jest.mock("@/context/tasks/utils/notifications", () => ({
  cancelTaskReminder: jest.fn(),
}));
jest.mock("@/utils/id", () => ({
  generateId: jest.fn(),
}));

const readOrSeedTasksMock = jest.mocked(readOrSeedTasks);
const writeTasksMock = jest.mocked(writeTasks);
const cancelTaskReminderMock = jest.mocked(cancelTaskReminder);
const generateIdMock = jest.mocked(generateId);

const NOTIFICATION = {
  id: "notification-1",
  scheduledAt: "2026-01-01T10:00:00.000Z",
};

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
