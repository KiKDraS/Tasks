import { TASK_FORM_MESSAGES } from "@/hooks/task-form/constants";
import { TaskFormState } from "@/hooks/task-form/types/TaskForm";

export function validateTaskForm(state: TaskFormState) {
  const titleError = state.title.trim()
    ? null
    : TASK_FORM_MESSAGES.titleRequired;
  const hasInvalidReminder = state.reminderEnabled && !!state.reminderError;

  return { titleError, isValid: !titleError && !hasInvalidReminder };
}
