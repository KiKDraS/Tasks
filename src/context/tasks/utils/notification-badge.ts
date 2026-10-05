import { MINUTE_MS } from "@/constants/time";
import { formatDate, formatTime, isToday } from "@/utils/date";
import { TaskNotification } from "../types/Task";

const ACTIVE_REMINDER_LABEL = "Recordatorio activo";

export function getNotificationBadgeLabel(
  notification: TaskNotification | null,
  now: Date = new Date(),
): string | null {
  if (!notification) {
    return null;
  }

  const scheduledAt = new Date(notification.scheduledAt);
  const diffMs = scheduledAt.getTime() - now.getTime();
  const hasBeenSent = diffMs <= 0;
  if (hasBeenSent) {
    return null;
  }

  const isImminent = diffMs < MINUTE_MS;
  if (isImminent) {
    return ACTIVE_REMINDER_LABEL;
  }

  const time = formatTime(scheduledAt);
  if (isToday(scheduledAt, now)) {
    return time;
  }

  return `${formatDate(scheduledAt)}, ${time}`;
}
