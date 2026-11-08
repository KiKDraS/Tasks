import AsyncStorage from "@react-native-async-storage/async-storage";

import { STORAGE_KEYS } from "@/constants/storage-keys";
import { Task } from "@/context/tasks/types/Task";
import { delay } from "@/utils/delay";

const NETWORK_DELAY_MS = 800;

export function parseTasks(rawItems: string | null): Task[] {
  if (rawItems === null || rawItems === "") {
    return [];
  }

  try {
    const parsed: unknown = JSON.parse(rawItems);
    return Array.isArray(parsed) ? (parsed as Task[]) : [];
  } catch {
    return [];
  }
}

export async function readOrSeedTasks(seed: Task[]): Promise<Task[]> {
  const rawItems = await AsyncStorage.getItem(STORAGE_KEYS.tasks);

  if (rawItems === null || rawItems === "") {
    await AsyncStorage.setItem(STORAGE_KEYS.tasks, JSON.stringify(seed));
    return seed;
  }

  return parseTasks(rawItems);
}

export async function writeTasks(tasks: Task[]): Promise<void> {
  await delay(NETWORK_DELAY_MS);

  await AsyncStorage.setItem(STORAGE_KEYS.tasks, JSON.stringify(tasks));
}
