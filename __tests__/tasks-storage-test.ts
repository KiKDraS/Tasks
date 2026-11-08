jest.mock("@react-native-async-storage/async-storage", () =>
  require("@react-native-async-storage/async-storage/jest/async-storage-mock"),
);
jest.mock("@/utils/delay", () => ({
  delay: jest.fn(() => Promise.resolve()),
}));

import AsyncStorage from "@react-native-async-storage/async-storage";

import { STORAGE_KEYS } from "@/constants/storage-keys";
import {
  parseTasks,
  readOrSeedTasks,
  writeTasks,
} from "@/services/tasks-storage";
import { delay } from "@/utils/delay";
import { Task } from "@/context/tasks/types/Task";

const delayMock = delay as unknown as jest.Mock;
const getItemMock = AsyncStorage.getItem as jest.Mock;
const setItemMock = AsyncStorage.setItem as jest.Mock;

const seedTasks: Task[] = [
  {
    id: "task-1",
    title: "Comprar pan",
    description: "Ir al almacén",
    isComplete: false,
    notification: null,
  },
];

describe("parseTasks", () => {
  test("returns [] for null", () => {
    expect(parseTasks(null)).toEqual([]);
  });

  test("returns [] for empty string", () => {
    expect(parseTasks("")).toEqual([]);
  });

  test("returns [] for invalid JSON", () => {
    expect(parseTasks("{not json")).toEqual([]);
  });

  test("returns [] when valid JSON is not an array", () => {
    expect(parseTasks("null")).toEqual([]);
    expect(parseTasks("{}")).toEqual([]);
  });

  test("parses a valid JSON array", () => {
    expect(parseTasks(JSON.stringify(seedTasks))).toEqual(seedTasks);
  });
});

describe("readOrSeedTasks", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("writes seed and returns it when key is missing", async () => {
    getItemMock.mockResolvedValueOnce(null);

    await expect(readOrSeedTasks(seedTasks)).resolves.toEqual(seedTasks);
    expect(setItemMock).toHaveBeenCalledWith(
      STORAGE_KEYS.tasks,
      JSON.stringify(seedTasks),
    );
  });

  test("writes seed and returns it when key is empty", async () => {
    getItemMock.mockResolvedValueOnce("");

    await expect(readOrSeedTasks(seedTasks)).resolves.toEqual(seedTasks);
    expect(setItemMock).toHaveBeenCalledWith(
      STORAGE_KEYS.tasks,
      JSON.stringify(seedTasks),
    );
  });

  test("returns stored tasks without overwriting", async () => {
    getItemMock.mockResolvedValueOnce(JSON.stringify(seedTasks));

    await expect(readOrSeedTasks([])).resolves.toEqual(seedTasks);
    expect(setItemMock).not.toHaveBeenCalled();
  });
});

describe("writeTasks", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("waits 800 ms then writes the JSON array", async () => {
    await writeTasks(seedTasks);

    expect(delayMock).toHaveBeenCalledWith(800);
    expect(setItemMock).toHaveBeenCalledWith(
      STORAGE_KEYS.tasks,
      JSON.stringify(seedTasks),
    );
  });
});
