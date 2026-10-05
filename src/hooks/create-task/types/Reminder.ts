export const REMINDER_TYPES = {
  TIME: "time",
  DATE: "date",
} as const;

export type ReminderType =
  (typeof REMINDER_TYPES)[keyof typeof REMINDER_TYPES];

export type TimeReminder = {
  type: typeof REMINDER_TYPES.TIME;
  seconds: number;
};

export type DateReminder = {
  type: typeof REMINDER_TYPES.DATE;
  date: Date;
};

export type ReminderSelection = TimeReminder | DateReminder;
