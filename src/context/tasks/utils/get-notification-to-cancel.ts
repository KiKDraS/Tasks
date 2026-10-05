import { Task, TaskNotification } from "../types/Task";

export function getNotificationToCancel(
  updatedTask: Task,
  currentTask?: Task,
): TaskNotification | null {
  if (!updatedTask.isComplete) {
    return null;
  }

  return updatedTask.notification ?? currentTask?.notification ?? null;
}
