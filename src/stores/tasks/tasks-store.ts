import { create } from "zustand";

import { TASKS_DB } from "@/context/tasks/data/tasks-seed";
import { Task, TaskShare } from "@/context/tasks/types/Task";
import { clearExpiredTaskNotifications } from "@/context/tasks/utils/clear-expired-notifications";
import { findTaskById } from "@/context/tasks/utils/find-task-by-id";
import { cancelTaskReminder } from "@/context/tasks/utils/notifications";
import { readOrSeedTasks, writeTasks } from "@/services/tasks-storage";
import { deleteTaskAttachments } from "@/stores/tasks/delete-task-attachments";
import { recordTaskShare } from "@/stores/tasks/record-task-share";
import { resolveTaskUpdate } from "@/stores/tasks/resolve-task-update";
import {
  enqueueTaskMutation,
  writeTasksBestEffort,
} from "@/stores/tasks/task-mutation-queue";
import { generateId } from "@/utils/id";

export interface TasksState {
  tasks: Task[];
  isLoading: boolean;
  hydrate: () => Promise<void>;
  addTask: (task: Task) => Promise<void>;
  updateTask: (task: Task) => Promise<void>;
  removeTask: (id: string) => Promise<void>;
  toggleComplete: (id: string) => Promise<void>;
  recordTaskShare: (id: string, share: TaskShare) => Promise<void>;
  clearSentNotification: (notificationId: string) => Promise<void>;
  clearExpiredNotifications: (now?: Date) => Promise<void>;
}

export const useTasksStore = create<TasksState>()((set, get) => {
  async function applyUpdateTask(updatedTask: Task): Promise<void> {
    const { tasks } = get();
    const currentTask = findTaskById(tasks, updatedTask.id);
    const nextTask = await resolveTaskUpdate(updatedTask, currentTask);
    const taskWithShares = currentTask
      ? { ...nextTask, shares: currentTask.shares ?? nextTask.shares }
      : nextTask;
    const nextTasks = tasks.map((task) =>
      task.id === updatedTask.id ? taskWithShares : task,
    );

    await writeTasks(nextTasks);
    set({ tasks: nextTasks });
  }

  return {
    tasks: [],
    isLoading: true,
    hydrate: async () => {
      set({ isLoading: true });

      const storedTasks = await readOrSeedTasks(TASKS_DB);
      const { tasks, changed } = clearExpiredTaskNotifications(storedTasks);

      set({ tasks, isLoading: false });

      if (!changed) {
        return;
      }

      await writeTasksBestEffort(tasks);

      const latestTasks = get().tasks;

      if (latestTasks !== tasks) {
        await writeTasksBestEffort(latestTasks);
      }
    },
    addTask: (task) =>
      enqueueTaskMutation(async () => {
        const nextTask = { ...task, id: task.id ?? generateId() };
        const nextTasks = [...get().tasks, nextTask];

        await writeTasks(nextTasks);
        set({ tasks: nextTasks });
      }),
    updateTask: (updatedTask) =>
      enqueueTaskMutation(() => applyUpdateTask(updatedTask)),
    removeTask: (id) =>
      enqueueTaskMutation(async () => {
        const task = findTaskById(get().tasks, id);

        if (!task) {
          return;
        }

        if (task.notification) {
          await cancelTaskReminder(task.notification.id);
        }

        const nextTasks = get().tasks.filter((item) => item.id !== id);

        await writeTasks(nextTasks);
        set({ tasks: nextTasks });

        await deleteTaskAttachments(task);
      }),
    toggleComplete: (id) =>
      enqueueTaskMutation(async () => {
        const task = findTaskById(get().tasks, id);

        if (!task) {
          return;
        }

        await applyUpdateTask({ ...task, isComplete: !task.isComplete });
      }),
    recordTaskShare: (id, share) =>
      enqueueTaskMutation(async () => {
        const nextTasks = await recordTaskShare(get().tasks, id, share);

        if (nextTasks) {
          set({ tasks: nextTasks });
        }
      }),
    clearSentNotification: (notificationId) =>
      enqueueTaskMutation(async () => {
        const { tasks } = get();
        const hasMatch = tasks.some(
          (task) => task.notification?.id === notificationId,
        );

        if (!hasMatch) {
          return;
        }

        const nextTasks = tasks.map((task) =>
          task.notification?.id === notificationId
            ? { ...task, notification: null }
            : task,
        );

        await writeTasks(nextTasks);
        set({ tasks: nextTasks });
      }),
    clearExpiredNotifications: (now = new Date()) =>
      enqueueTaskMutation(async () => {
        const { tasks } = get();
        const { tasks: nextTasks, changed } = clearExpiredTaskNotifications(
          tasks,
          now,
        );

        if (!changed) {
          return;
        }

        await writeTasksBestEffort(nextTasks);
        set({ tasks: nextTasks });
      }),
  };
});
