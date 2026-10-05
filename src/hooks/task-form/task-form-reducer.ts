import {
  REMINDER_TYPES,
  ReminderSelection,
} from "@/context/tasks/types/Reminder";
import { Task } from "@/context/tasks/types/Task";
import {
  REMINDER_TIME_PRESETS,
  TASK_FORM_ACTION_TYPES,
  TASK_FORM_MESSAGES,
} from "./constants";
import { TaskFormAction, TaskFormState } from "./types/TaskForm";

const createDefaultTimeReminder = (): ReminderSelection => ({
  type: REMINDER_TYPES.TIME,
  seconds: REMINDER_TIME_PRESETS[0].seconds,
});

export const initialTaskFormState: TaskFormState = {
  title: "",
  description: "",
  reminderEnabled: true,
  reminder: createDefaultTimeReminder(),
  titleError: null,
  reminderError: null,
  isSubmitting: false,
};

function getPendingReminder(task: Task): ReminderSelection | null {
  if (!task.notification) {
    return null;
  }

  const scheduledAt = new Date(task.notification.scheduledAt);
  const isPending = scheduledAt.getTime() > Date.now();

  return isPending ? { type: REMINDER_TYPES.DATE, date: scheduledAt } : null;
}

export function taskFormStateFromTask(task: Task): TaskFormState {
  const pendingReminder = getPendingReminder(task);

  return {
    title: task.title,
    description: task.description,
    reminderEnabled: pendingReminder !== null,
    reminder: pendingReminder ?? createDefaultTimeReminder(),
    titleError: null,
    reminderError: null,
    isSubmitting: false,
  };
}

export function taskFormReducer(
  state: TaskFormState,
  action: TaskFormAction,
): TaskFormState {
  switch (action.type) {
    case TASK_FORM_ACTION_TYPES.SET_TITLE:
      return { ...state, title: action.payload, titleError: null };
    case TASK_FORM_ACTION_TYPES.SET_DESCRIPTION:
      return { ...state, description: action.payload };
    case TASK_FORM_ACTION_TYPES.TOGGLE_REMINDER:
      return { ...state, reminderEnabled: !state.reminderEnabled };
    case TASK_FORM_ACTION_TYPES.SET_REMINDER: {
      const isInvalidTimeReminder =
        action.payload.type === REMINDER_TYPES.TIME &&
        action.payload.seconds <= 0;
      const reminderError = isInvalidTimeReminder
        ? TASK_FORM_MESSAGES.invalidReminderTime
        : null;
      return { ...state, reminder: action.payload, reminderError };
    }
    case TASK_FORM_ACTION_TYPES.SET_TITLE_ERROR:
      return { ...state, titleError: action.payload };
    case TASK_FORM_ACTION_TYPES.SET_SUBMITTING:
      return { ...state, isSubmitting: action.payload };
    default:
      return state;
  }
}
