import type { DeviceActionState } from "@/utils/permission-state";

interface ScheduleHintInput {
  reminderEnabled: boolean;
  calendarEventId: string | null;
  calendarState: DeviceActionState;
  isComplete: boolean;
}

function shouldAnnounceCalendar(input: Readonly<ScheduleHintInput>): boolean {
  if (input.calendarEventId) {
    return false;
  }

  const { status } = input.calendarState;
  return status === "idle" || status === "pending" || status === "granted";
}

export function getScheduleHint(
  input: Readonly<ScheduleHintInput>,
  reminderLabel: string,
): string | null {
  if (input.isComplete || !input.reminderEnabled) {
    return null;
  }

  const label = reminderLabel.toLowerCase();
  if (!shouldAnnounceCalendar(input)) {
    return `La notificación se enviará ${label}`;
  }

  return `La notificación se enviará y el evento se agregará al calendario ${label}`;
}
