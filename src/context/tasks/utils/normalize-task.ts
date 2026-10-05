import { Task } from "../types/Task";

type StoredTask = Omit<Task, "notification"> & { notification: unknown };

export function normalizeTask(task: StoredTask): Task {
  if (typeof task.notification === "string") {
    return { ...task, notification: null };
  }

  return task as Task;
}
