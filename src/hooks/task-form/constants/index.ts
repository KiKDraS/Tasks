import { SECONDS_PER_HOUR, SECONDS_PER_MINUTE } from "@/constants/time";
import type { TaskFormAction } from "@/hooks/task-form/types/TaskForm";

export const TASK_FORM_ACTION_TYPES = {
  SET_TITLE: "SET_TITLE",
  SET_DESCRIPTION: "SET_DESCRIPTION",
  TOGGLE_REMINDER: "TOGGLE_REMINDER",
  SET_REMINDER: "SET_REMINDER",
  SET_TITLE_ERROR: "SET_TITLE_ERROR",
  SET_SUBMITTING: "SET_SUBMITTING",
  ADD_PHOTOS: "ADD_PHOTOS",
  REMOVE_PHOTO: "REMOVE_PHOTO",
  SET_LOCATION: "SET_LOCATION",
  SET_CALENDAR_EVENT: "SET_CALENDAR_EVENT",
  SET_CALENDAR_STATE: "SET_CALENDAR_STATE",
  SET_PHOTO_STATE: "SET_PHOTO_STATE",
  SET_LOCATION_STATE: "SET_LOCATION_STATE",
} as const satisfies Record<TaskFormAction["type"], TaskFormAction["type"]>;

export const REMINDER_TIME_PRESETS = [
  { seconds: 15 * SECONDS_PER_MINUTE, label: "15m" },
  { seconds: 30 * SECONDS_PER_MINUTE, label: "30m" },
  { seconds: SECONDS_PER_HOUR, label: "1h" },
  { seconds: 2 * SECONDS_PER_HOUR, label: "2h" },
] as const;

export const TASK_FORM_MESSAGES = {
  titleRequired: "El título es obligatorio",
  invalidReminderTime: "Ingresá un tiempo válido",
  saveFailureTitle: "No se pudo guardar la tarea",
  saveFailureMessage: "Intentá de nuevo.",
} as const;
