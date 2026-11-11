import { create } from "zustand";

import type { Task, TaskShare } from "@/context/tasks/types/Task";
import { createTasksActions } from "@/stores/tasks/tasks-store-actions";

export interface TasksActions {
  hydrate: () => Promise<void>;
  addTask: (task: Task) => Promise<void>;
  updateTask: (task: Task) => Promise<void>;
  removeTask: (id: string) => Promise<void>;
  toggleComplete: (id: string) => Promise<void>;
  recordTaskShare: (id: string, share: TaskShare) => Promise<void>;
  clearSentNotification: (notificationId: string) => Promise<void>;
  clearExpiredNotifications: (now?: Date) => Promise<void>;
}

export interface TasksState extends TasksActions {
  tasks: Task[];
  isLoading: boolean;
}

export const useTasksStore = create<TasksState>()((set, get) => ({
  tasks: [],
  isLoading: true,
  ...createTasksActions({ set, get }),
}));
