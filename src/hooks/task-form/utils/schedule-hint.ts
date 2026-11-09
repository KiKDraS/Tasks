import { shouldCreateCalendarEvent } from "@/hooks/task-form/utils/schedule-state";

export function getScheduleHint(
  reminderEnabled: boolean,
  calendarEnabled: boolean,
  calendarEventId: string | null,
  reminderLabel: string,
): string | null {
  const label = reminderLabel.toLowerCase();
  const createsEvent = shouldCreateCalendarEvent({
    reminderEnabled,
    calendarEnabled,
    calendarEventId,
  });

  if (reminderEnabled && createsEvent) {
    return `La notificación se enviará y el evento se creará ${label}`;
  }

  if (reminderEnabled) {
    return `La notificación se enviará ${label}`;
  }

  if (createsEvent) {
    return `El evento se creará ${label}`;
  }

  return null;
}
