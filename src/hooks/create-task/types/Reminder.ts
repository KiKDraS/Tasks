export type TimeReminder = { type: "time"; seconds: number };
export type DateReminder = { type: "date"; date: Date };
export type ReminderSelection = TimeReminder | DateReminder;