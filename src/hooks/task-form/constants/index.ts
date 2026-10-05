import { SECONDS_PER_HOUR, SECONDS_PER_MINUTE } from "@/constants/time";
import type { TaskFormAction } from "@/hooks/task-form/types/TaskForm";

export const TASK_FORM_ACTION_TYPES = {
  SET_TITLE: "SET_TITLE",
  SET_DESCRIPTION: "SET_DESCRIPTION",
  TOGGLE_REMINDER: "TOGGLE_REMINDER",
  SET_REMINDER: "SET_REMINDER",
  SET_TITLE_ERROR: "SET_TITLE_ERROR",
  SET_SUBMITTING: "SET_SUBMITTING",
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
} as const;
