import type { ReminderSelection } from "@/context/tasks/types/Reminder";
import type { TaskContact, TaskLocation } from "@/context/tasks/types/Task";
import type { DeviceActionState } from "@/utils/permission-state";

export type TaskFormState = {
  title: string;
  description: string;
  reminderEnabled: boolean;
  reminder: ReminderSelection;
  titleError: string | null;
  reminderError: string | null;
  isSubmitting: boolean;
  photoUri: string | null;
  location: TaskLocation | null;
  contact: TaskContact | null;
  calendarEnabled: boolean;
  calendarEventId: string | null;
  photoState: DeviceActionState;
  locationState: DeviceActionState;
  contactState: DeviceActionState;
  calendarState: DeviceActionState;
};

export type TaskFormAction =
  | { type: "SET_TITLE"; payload: string }
  | { type: "SET_DESCRIPTION"; payload: string }
  | { type: "TOGGLE_REMINDER" }
  | { type: "SET_REMINDER"; payload: ReminderSelection }
  | { type: "SET_TITLE_ERROR"; payload: string | null }
  | { type: "SET_SUBMITTING"; payload: boolean }
  | { type: "SET_PHOTO"; payload: string | null }
  | { type: "SET_LOCATION"; payload: TaskLocation | null }
  | { type: "SET_CONTACT"; payload: TaskContact | null }
  | { type: "SET_CONTACT_STATE"; payload: DeviceActionState }
  | { type: "SET_CALENDAR_ENABLED"; payload: boolean }
  | { type: "SET_CALENDAR_EVENT"; payload: string | null }
  | { type: "SET_CALENDAR_STATE"; payload: DeviceActionState }
  | { type: "SET_PHOTO_STATE"; payload: DeviceActionState }
  | { type: "SET_LOCATION_STATE"; payload: DeviceActionState };