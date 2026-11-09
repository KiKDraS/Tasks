import type { TaskFormState } from "@/hooks/task-form/types/TaskForm";

type ScheduleState = Pick<
  TaskFormState,
  "reminderEnabled" | "calendarEnabled" | "calendarEventId"
>;

export function shouldCreateCalendarEvent(state: ScheduleState): boolean {
  return state.calendarEnabled && !state.calendarEventId;
}

export function shouldShowScheduleOptions(state: ScheduleState): boolean {
  return state.reminderEnabled || shouldCreateCalendarEvent(state);
}
