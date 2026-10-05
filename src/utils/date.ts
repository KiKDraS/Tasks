import { DAY_MS } from "@/constants/time";

export const DATE_LABELS = {
  today: "Hoy",
  tomorrow: "Mañana",
} as const;

export const MONTHS = [
  "ene",
  "feb",
  "mar",
  "abr",
  "may",
  "jun",
  "jul",
  "ago",
  "sep",
  "oct",
  "nov",
  "dic",
];

export const startOfDay = (date: Date) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate());

export const getDayDiff = (date: Date, base: Date = new Date()) =>
  Math.round(
    (startOfDay(date).getTime() - startOfDay(base).getTime()) / DAY_MS,
  );

export const isToday = (date: Date, base: Date = new Date()) =>
  getDayDiff(date, base) === 0;

export const isTomorrow = (date: Date, base: Date = new Date()) =>
  getDayDiff(date, base) === 1;

export const formatTime = (date: Date) => {
  const hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, "0");
  return `${hours}:${minutes}`;
};

export const formatDate = (date: Date) => {
  if (isToday(date)) {
    return DATE_LABELS.today;
  }
  if (isTomorrow(date)) {
    return DATE_LABELS.tomorrow;
  }
  return `${date.getDate()} ${MONTHS[date.getMonth()]}`;
};
