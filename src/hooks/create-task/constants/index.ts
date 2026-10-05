import { SECONDS_PER_HOUR, SECONDS_PER_MINUTE } from "@/constants/time";
import type { CreateTaskFormAction } from "@/hooks/create-task/types/CreateTaskForm";

export const TYPES = {
  SET_TITLE: "SET_TITLE",
  SET_DESCRIPTION: "SET_DESCRIPTION",
  TOGGLE_REMINDER: "TOGGLE_REMINDER",
  SET_REMINDER: "SET_REMINDER",
  SET_TITLE_ERROR: "SET_TITLE_ERROR",
  SET_SUBMITTING: "SET_SUBMITTING",
} as const satisfies Record<
  CreateTaskFormAction["type"],
  CreateTaskFormAction["type"]
>;

export const REMINDER_TIME_PRESETS = [
  { seconds: 15 * SECONDS_PER_MINUTE, label: "15m" },
  { seconds: 30 * SECONDS_PER_MINUTE, label: "30m" },
  { seconds: SECONDS_PER_HOUR, label: "1h" },
  { seconds: 2 * SECONDS_PER_HOUR, label: "2h" },
] as const;

export const CREATE_TASK_MESSAGES = {
  titleRequired: "El título es obligatorio",
  invalidReminderTime: "Ingresá un tiempo válido",
} as const;

export const NOTIFICATION_COPY = {
  channelName: "Recordatorios",
  defaultBody: "Recordatorio de tu tarea",
  permissionAlertTitle: "Permiso denegado",
  permissionAlertMessage:
    "No se pudo programar la notificación. Activá los permisos de notificaciones en los ajustes.",
} as const;

export const NOTIFICATION_DATA_KEYS = {
  taskTitle: "taskTitle",
} as const;
