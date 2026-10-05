import { WEEK_MS } from "@/constants/time";
import { Task } from "../types/Task";

export const TASKS_DB: Task[] = [
  {
    id: "task-1",
    title: "Task 1",
    description: "Descripción para Task 1",
    isComplete: false,
    notification: null,
  },
  {
    id: "task-2",
    title: "Task 2",
    description: "Descripción para Task 2",
    isComplete: true,
    notification: null,
  },
  {
    id: "task-3",
    title: "Task 3",
    description: "Descripción para Task 3",
    isComplete: false,
    notification: {
      id: "seed-next-week-notification",
      scheduledAt: new Date(Date.now() + WEEK_MS).toISOString(),
    },
  },
];
