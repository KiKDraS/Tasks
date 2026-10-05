import { SECONDS_PER_HOUR, SECONDS_PER_MINUTE } from "@/constants/time";
import { DATE_LABELS, MONTHS, formatTime, isToday, isTomorrow } from "@/utils/date";
import { REMINDER_TYPES, ReminderSelection } from "../types/Reminder";

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
  if (reminder.type === REMINDER_TYPES.TIME) {
    return `En ${formatDuration(reminder.seconds)}`;
  }

  const time = formatTime(reminder.date);
  if (isToday(reminder.date)) {
    return `${DATE_LABELS.today}, ${time}`;
  }
  if (isTomorrow(reminder.date)) {
    return `${DATE_LABELS.tomorrow}, ${time}`;
  }
  return `El ${reminder.date.getDate()} ${MONTHS[reminder.date.getMonth()]}, ${time}`;
};
