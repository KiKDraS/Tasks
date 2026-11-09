import { SECOND_MS } from "@/constants/time";
import {
  REMINDER_TYPES,
  ReminderSelection,
} from "@/context/tasks/types/Reminder";

export function getReminderDate(
  reminder: ReminderSelection,
  now: Date = new Date(),
): Date {
  if (reminder.type === REMINDER_TYPES.DATE) {
    return reminder.date;
  }

  return new Date(now.getTime() + reminder.seconds * SECOND_MS);
}
