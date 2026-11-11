import {
  REMINDER_TYPES,
  ReminderSelection,
} from "@/context/tasks/types/Reminder";
import { Task } from "@/context/tasks/types/Task";
import { getTaskPhotoUris } from "@/utils/task-photos";
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
  reminderToggledOff: false,
  reminder: createDefaultTimeReminder(),
  titleError: null,
  reminderError: null,
  isSubmitting: false,
  photoUris: [],
  location: null,
  calendarEventId: null,
  photoState: { status: "idle" },
  locationState: { status: "idle" },
  calendarState: { status: "idle" },
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
  const photoUris = getTaskPhotoUris(task);
  const location = task.location ?? null;
  const calendarEventId = task.calendarEventId ?? null;

  return {
    title: task.title,
    description: task.description,
    reminderEnabled: pendingReminder !== null,
    reminderToggledOff: false,
    reminder: pendingReminder ?? createDefaultTimeReminder(),
    titleError: null,
    reminderError: null,
    isSubmitting: false,
    photoUris,
    location,
    calendarEventId,
    photoState:
      photoUris.length > 0 ? { status: "granted" } : { status: "idle" },
    locationState: location ? { status: "granted" } : { status: "idle" },
    calendarState: calendarEventId ? { status: "granted" } : { status: "idle" },
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
    case TASK_FORM_ACTION_TYPES.TOGGLE_REMINDER: {
      const nextEnabled = !state.reminderEnabled;

      return {
        ...state,
        reminderEnabled: nextEnabled,
        reminderToggledOff: !nextEnabled,
      };
    }
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
    case TASK_FORM_ACTION_TYPES.ADD_PHOTOS:
      return {
        ...state,
        photoUris: [...state.photoUris, ...action.payload],
        photoState: { status: "granted" },
      };
    case TASK_FORM_ACTION_TYPES.REMOVE_PHOTO: {
      const photoUris = state.photoUris.filter((uri) => uri !== action.payload);
      const isPhotoListEmpty = photoUris.length === 0;

      return {
        ...state,
        photoUris,
        photoState: isPhotoListEmpty
          ? { status: "idle" }
          : { status: "granted" },
      };
    }
    case TASK_FORM_ACTION_TYPES.SET_LOCATION:
      return { ...state, location: action.payload };
    case TASK_FORM_ACTION_TYPES.SET_CALENDAR_EVENT:
      return { ...state, calendarEventId: action.payload };
    case TASK_FORM_ACTION_TYPES.SET_CALENDAR_STATE:
      return { ...state, calendarState: action.payload };
    case TASK_FORM_ACTION_TYPES.SET_PHOTO_STATE:
      return { ...state, photoState: action.payload };
    case TASK_FORM_ACTION_TYPES.SET_LOCATION_STATE:
      return { ...state, locationState: action.payload };
    default:
      return state;
  }
}
