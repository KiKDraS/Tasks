import { HOUR_MS, WEEK_MS } from "@/constants/time";
import { Task } from "../types/Task";

export const TASKS_DB: Task[] = [
  {
    id: "task-1",
    title: "Task 1",
    description: "Description for Task 1",
    isComplete: false,
    notification: null,
  },
  {
    id: "task-2",
    title: "Task 2",
    description: "Description for Task 2",
    isComplete: true,
    notification: null,
  },
  {
    id: "task-3",
    title: "Task 3",
    description: "Expired reminder - badge should be hidden",
    isComplete: false,
    notification: {
      id: "seed-expired-notification",
      scheduledAt: new Date(Date.now() - HOUR_MS).toISOString(),
    },
  },
  {
    id: "task-4",
    title: "Task 4",
    description: "Reminder due next week - badge shows date and time",
    isComplete: false,
    notification: {
      id: "seed-next-week-notification",
      scheduledAt: new Date(Date.now() + WEEK_MS).toISOString(),
    },
  },
];
