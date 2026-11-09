import type { TaskFormState } from "@/hooks/task-form/types/TaskForm";

type ScheduleState = Pick<
  TaskFormState,
  "reminderEnabled" | "calendarEventId"
>;

export function shouldCreateCalendarEvent(state: ScheduleState): boolean {
  return state.reminderEnabled && !state.calendarEventId;
}

export function shouldShowScheduleOptions(state: ScheduleState): boolean {
  return state.reminderEnabled;
}
