import type { TaskLocation } from "@/context/tasks/types/Task";

export function formatLocationLabel(location: TaskLocation): string {
  if (location.address) {
    return location.address;
  }

  return `${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}`;
}
