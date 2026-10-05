import { DAY_MS, MONTHS, formatTime, startOfDay } from "@/utils/date";
import { ReminderSelection } from "../types/Reminder";

const SECONDS_PER_MINUTE = 60;
const SECONDS_PER_HOUR = 3600;

const formatDuration = (totalSeconds: number) => {
  const hours = Math.floor(totalSeconds / SECONDS_PER_HOUR);
  const minutes = Math.floor((totalSeconds % SECONDS_PER_HOUR) / SECONDS_PER_MINUTE);
  const seconds = totalSeconds % SECONDS_PER_MINUTE;

  const parts: string[] = [];
  if (hours > 0) {
    parts.push(`${hours} hora${hours > 1 ? "s" : ""}`);
  }
  if (minutes > 0) {
    parts.push(`${minutes} minuto${minutes > 1 ? "s" : ""}`);
  }
  if (seconds > 0) {
    parts.push(`${seconds} segundo${seconds > 1 ? "s" : ""}`);
  }

  return parts.join(" ") || "0 segundos";
};

export const formatReminderLabel = (reminder: ReminderSelection) => {
  if (reminder.type === "time") {
    return `En ${formatDuration(reminder.seconds)}`;
  }

  const diffDays = Math.round(
    (startOfDay(reminder.date).getTime() - startOfDay(new Date()).getTime()) /
      DAY_MS,
  );
  const time = formatTime(reminder.date);
  if (diffDays === 0) {
    return `Hoy, ${time}`;
  }
  if (diffDays === 1) {
    return `Mañana, ${time}`;
  }
  return `El ${reminder.date.getDate()} ${MONTHS[reminder.date.getMonth()]}, ${time}`;
};
