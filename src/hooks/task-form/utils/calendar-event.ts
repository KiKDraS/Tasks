import { HOUR_MS } from "@/constants/time";
import type { TaskFormState } from "@/hooks/task-form/types/TaskForm";
import type { TaskFields } from "@/hooks/task-form/utils/task-fields";
import type { TaskCalendarEvent } from "@/services/calendar";
import { getReminderDate } from "@/utils/reminder-date";

export function buildCalendarEventInput(
  fields: TaskFields,
  state: TaskFormState,
): TaskCalendarEvent {
  const now = new Date();
  const startDate = getReminderDate(state.reminder, now);

  return {
    title: fields.title,
    description: fields.description,
    location: fields.location?.address,
    startDate,
    endDate: new Date(startDate.getTime() + HOUR_MS),
  };
}
