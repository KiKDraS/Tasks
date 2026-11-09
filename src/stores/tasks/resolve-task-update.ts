import { Task } from "@/context/tasks/types/Task";
import { getNotificationToCancel } from "@/context/tasks/utils/get-notification-to-cancel";
import { cancelTaskReminder } from "@/context/tasks/utils/notifications";

export async function resolveTaskUpdate(
  updatedTask: Task,
  currentTask?: Task,
): Promise<Task> {
  const notificationToCancel = getNotificationToCancel(
    updatedTask,
    currentTask,
  );

  if (!notificationToCancel) {
    return updatedTask;
  }

  await cancelTaskReminder(notificationToCancel.id);
  return { ...updatedTask, notification: null };
}
