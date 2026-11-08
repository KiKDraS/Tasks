import AsyncStorage from "@react-native-async-storage/async-storage";

import { STORAGE_KEYS } from "@/constants/storage-keys";
import { NETWORK_DELAY_MS } from "@/constants/time";
import { Task } from "@/context/tasks/types/Task";
import {
  parseTasks,
  readOrSeedTasks,
  writeTasks,
} from "@/services/tasks-storage";
import { delay } from "@/utils/delay";

jest.mock("@react-native-async-storage/async-storage", () =>
  jest.requireActual(
    "@react-native-async-storage/async-storage/jest/async-storage-mock",
  ),
);
jest.mock("@/utils/delay", () => ({
  delay: jest.fn(() => Promise.resolve()),
}));

const delayMock = jest.mocked(delay);
const getItemMock = jest.mocked(AsyncStorage.getItem);
const setItemMock = jest.mocked(AsyncStorage.setItem);

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

  test("waits for the network delay then writes the JSON array", async () => {
    await writeTasks(seedTasks);

    expect(delayMock).toHaveBeenCalledWith(NETWORK_DELAY_MS);
    expect(setItemMock).toHaveBeenCalledWith(
      STORAGE_KEYS.tasks,
      JSON.stringify(seedTasks),
    );
  });
});
