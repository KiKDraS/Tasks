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

export const DAY_MS = 86400000;

export const startOfDay = (date: Date) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate());

export const formatTime = (date: Date) => {
  const hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, "0");
  return `${hours}:${minutes}`;
};

export const formatDate = (date: Date) => {
  const diffDays = Math.round(
    (startOfDay(date).getTime() - startOfDay(new Date()).getTime()) / DAY_MS,
  );
  if (diffDays === 0) {
    return "Hoy";
  }
  if (diffDays === 1) {
    return "Mañana";
  }
  return `${date.getDate()} ${MONTHS[date.getMonth()]}`;
};
