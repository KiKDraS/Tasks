import { TYPES } from "./constants";
import {
  CreateTaskFormAction,
  CreateTaskFormState,
} from "./types/CreateTaskForm";

export const initialCreateTaskFormState: CreateTaskFormState = {
  title: "",
  description: "",
  reminderEnabled: true,
  reminder: { type: "time", seconds: 900 },
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
      const reminderError =
        action.payload.type === "time" && action.payload.seconds <= 0
          ? "Ingresá un tiempo válido"
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
