import { ReminderSelection } from "./Reminder";

export type CreateTaskFormState = {
  title: string;
  description: string;
  reminderEnabled: boolean;
  reminder: ReminderSelection;
  titleError: string | null;
  reminderError: string | null;
  isSubmitting: boolean;
};

export type CreateTaskFormAction =
  | { type: "SET_TITLE"; payload: string }
  | { type: "SET_DESCRIPTION"; payload: string }
  | { type: "TOGGLE_REMINDER" }
  | { type: "SET_REMINDER"; payload: ReminderSelection }
  | { type: "SET_TITLE_ERROR"; payload: string | null }
  | { type: "SET_SUBMITTING"; payload: boolean };
