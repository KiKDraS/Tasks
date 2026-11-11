import { Task } from "@/context/tasks/types/Task";
import { writeTasks } from "@/services/tasks-storage";
import {
  enqueueTaskMutation,
  writeTasksBestEffort,
} from "@/stores/tasks/task-mutation-queue";

jest.mock("@/services/tasks-storage", () => ({
  writeTasks: jest.fn(),
}));

const writeTasksMock = jest.mocked(writeTasks);

const TASK: Task = {
  id: "task-1",
  title: "Comprar pan",
  description: "Ir al almacén",
  isComplete: false,
  notification: null,
};

function createDeferred() {
  let resolve!: () => void;
  const promise = new Promise<void>((res) => {
    resolve = res;
  });

  return { promise, resolve };
}

beforeEach(() => {
  jest.clearAllMocks();
  writeTasksMock.mockResolvedValue();
});

describe("enqueueTaskMutation", () => {
  test("runs two queued operations in order", async () => {
    const order: string[] = [];
    const firstGate = createDeferred();

    const first = enqueueTaskMutation(async () => {
      order.push("first:start");
      await firstGate.promise;
      order.push("first:end");
    });
    const second = enqueueTaskMutation(async () => {
      order.push("second");
    });

    await Promise.resolve();

    expect(order).toEqual(["first:start"]);

    firstGate.resolve();
    await Promise.all([first, second]);

    expect(order).toEqual(["first:start", "first:end", "second"]);
  });
});

describe("writeTasksBestEffort", () => {
  test("swallows a rejected write", async () => {
    writeTasksMock.mockRejectedValueOnce(new Error("write failed"));

    await expect(writeTasksBestEffort([TASK])).resolves.toBeUndefined();

    expect(writeTasksMock).toHaveBeenCalledWith([TASK]);
  });
});
