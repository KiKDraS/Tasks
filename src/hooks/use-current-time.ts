import { CLOCK_TICK_MS } from "@/constants/time";
import { useEffect, useState } from "react";

export function useCurrentTime(intervalMs = CLOCK_TICK_MS) {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), intervalMs);
    return () => clearInterval(interval);
  }, [intervalMs]);

  return now;
}
