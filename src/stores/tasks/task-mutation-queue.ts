import { Task } from "@/context/tasks/types/Task";
import { writeTasks } from "@/services/tasks-storage";

let mutationQueue: Promise<void> = Promise.resolve();

export function enqueueTaskMutation<T>(
  operation: () => Promise<T>,
): Promise<T> {
  const result = mutationQueue.then(operation);

  // A rejected mutation must not block the next one.
  mutationQueue = result.then(
    () => undefined,
    () => undefined,
  );

  return result;
}

export async function writeTasksBestEffort(tasks: Task[]): Promise<void> {
  try {
    await writeTasks(tasks);
  } catch {
    // Keep the in-memory state; the next write retries storage.
  }
}
