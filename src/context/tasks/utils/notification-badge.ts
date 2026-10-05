import { formatDate, formatTime } from "@/utils/date";
import { TaskNotification } from "../types/Task";

const SUB_MINUTE_MS = 60000;

export function getNotificationBadgeLabel(
  notification: TaskNotification | null,
  now: Date = new Date(),
): string | null {
  if (!notification) {
    return null;
  }

  const scheduledAt = new Date(notification.scheduledAt);
  const diffMs = scheduledAt.getTime() - now.getTime();
  if (diffMs <= 0) {
    return null;
  }
  if (diffMs < SUB_MINUTE_MS) {
    return "Recordatorio activo";
  }

  const dateLabel = formatDate(scheduledAt);
  const time = formatTime(scheduledAt);
  if (dateLabel === "Hoy") {
    return time;
  }

  return `${dateLabel}, ${time}`;
}
