import { SECONDS_PER_HOUR, SECONDS_PER_MINUTE } from "@/constants/time";

export const MAX_HOURS = 99;
export const MAX_MINUTES = 59;
export const MAX_SECONDS = 59;

export type TimeParts = {
  hours: string;
  minutes: string;
  seconds: string;
};

export const splitSeconds = (totalSeconds: number): TimeParts => ({
  hours: Math.floor(totalSeconds / SECONDS_PER_HOUR).toString(),
  minutes: Math.floor(
    (totalSeconds % SECONDS_PER_HOUR) / SECONDS_PER_MINUTE,
  ).toString(),
  seconds: (totalSeconds % SECONDS_PER_MINUTE).toString(),
});

export const toSeconds = ({ hours, minutes, seconds }: TimeParts) =>
  (Number(hours) || 0) * SECONDS_PER_HOUR +
  (Number(minutes) || 0) * SECONDS_PER_MINUTE +
  (Number(seconds) || 0);

export const sanitizeTimePart = (value: string, max: number) => {
  const digits = value.replace(/\D/g, "");
  if (!digits) {
    return "";
  }
  return String(Math.min(Number(digits), max));
};
