import { TASK_FORM_MESSAGES } from "@/hooks/task-form/constants";
import { TaskFormState } from "@/hooks/task-form/types/TaskForm";
import { shouldShowScheduleOptions } from "@/hooks/task-form/utils/schedule-state";

export function validateTaskForm(state: TaskFormState) {
  const titleError = state.title.trim()
    ? null
    : TASK_FORM_MESSAGES.titleRequired;
  const hasInvalidReminder =
    shouldShowScheduleOptions(state) && !!state.reminderError;

  return { titleError, isValid: !titleError && !hasInvalidReminder };
}
