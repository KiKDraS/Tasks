import { CREATE_TASK_MESSAGES, REMINDER_TIME_PRESETS, TYPES } from "./constants";
import {
  CreateTaskFormAction,
  CreateTaskFormState,
} from "./types/CreateTaskForm";
import { REMINDER_TYPES } from "./types/Reminder";

export const initialCreateTaskFormState: CreateTaskFormState = {
  title: "",
  description: "",
  reminderEnabled: true,
  reminder: { type: REMINDER_TYPES.TIME, seconds: REMINDER_TIME_PRESETS[0].seconds },
  titleError: null,
  reminderError: null,
  isSubmitting: false,
};

export function createTaskFormReducer(
  state: CreateTaskFormState,
  action: CreateTaskFormAction,
): CreateTaskFormState {
  switch (action.type) {
    case TYPES.SET_TITLE:
      return { ...state, title: action.payload };
    case TYPES.SET_DESCRIPTION:
      return { ...state, description: action.payload };
    case TYPES.TOGGLE_REMINDER:
      return { ...state, reminderEnabled: !state.reminderEnabled };
    case TYPES.SET_REMINDER: {
      const isInvalidTimeReminder =
        action.payload.type === REMINDER_TYPES.TIME &&
        action.payload.seconds <= 0;
      const reminderError = isInvalidTimeReminder
        ? CREATE_TASK_MESSAGES.invalidReminderTime
        : null;
      return { ...state, reminder: action.payload, reminderError };
    }
    case TYPES.SET_TITLE_ERROR:
      return { ...state, titleError: action.payload };
    case TYPES.SET_SUBMITTING:
      return { ...state, isSubmitting: action.payload };
    default:
      return state;
  }
}
