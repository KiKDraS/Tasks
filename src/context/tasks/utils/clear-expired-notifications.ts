import { Task, TaskNotification } from "@/context/tasks/types/Task";

export interface ClearExpiredTaskNotificationsResult {
  tasks: Task[];
  changed: boolean;
}

function isNotificationExpired(
  notification: TaskNotification,
  now: Date,
): boolean {
  const scheduledAt = new Date(notification.scheduledAt).getTime();

  return scheduledAt <= now.getTime();
}

export function clearExpiredTaskNotifications(
  tasks: Task[],
  now = new Date(),
): ClearExpiredTaskNotificationsResult {
  let changed = false;

  const nextTasks = tasks.map((task) => {
    if (!task.notification || !isNotificationExpired(task.notification, now)) {
      return task;
    }

    changed = true;
    return { ...task, notification: null };
  });

  return { tasks: changed ? nextTasks : tasks, changed };
}
