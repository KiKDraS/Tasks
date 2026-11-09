import { create } from "zustand";

import { TASKS_DB } from "@/context/tasks/data/tasks-seed";
import { Task } from "@/context/tasks/types/Task";
import { findTaskById } from "@/context/tasks/utils/find-task-by-id";
import { getNotificationToCancel } from "@/context/tasks/utils/get-notification-to-cancel";
import { cancelTaskReminder } from "@/context/tasks/utils/notifications";
import { deleteTaskEvent } from "@/services/calendar";
import { deletePhoto } from "@/services/media";
import { readOrSeedTasks, writeTasks } from "@/services/tasks-storage";
import { generateId } from "@/utils/id";
import { getTaskPhotoUris } from "@/utils/task-photos";

export interface TasksState {
  tasks: Task[];
  isLoading: boolean;
  hydrate: () => Promise<void>;
  addTask: (task: Task) => Promise<void>;
  updateTask: (task: Task) => Promise<void>;
  removeTask: (id: string) => Promise<void>;
  toggleComplete: (id: string) => Promise<void>;
  clearSentNotification: (notificationId: string) => Promise<void>;
}

async function resolveTaskUpdate(
  updatedTask: Task,
  currentTask?: Task,
): Promise<Task> {
  const notificationToCancel = getNotificationToCancel(
    updatedTask,
    currentTask,
  );

  if (!notificationToCancel) {
    return updatedTask;
  }

  await cancelTaskReminder(notificationToCancel.id);
  return { ...updatedTask, notification: null };
}

export const useTasksStore = create<TasksState>()((set, get) => ({
  tasks: [],
  isLoading: true,
  hydrate: async () => {
    set({ isLoading: true });

    const tasks = await readOrSeedTasks(TASKS_DB);

    set({ tasks, isLoading: false });
  },
  addTask: async (task) => {
    const nextTask = { ...task, id: task.id ?? generateId() };
    const nextTasks = [...get().tasks, nextTask];

    await writeTasks(nextTasks);
    set({ tasks: nextTasks });
  },
  updateTask: async (updatedTask) => {
    const { tasks } = get();
    const currentTask = findTaskById(tasks, updatedTask.id);
    const nextTask = await resolveTaskUpdate(updatedTask, currentTask);

    const nextTasks = tasks.map((task) =>
      task.id === updatedTask.id ? nextTask : task,
    );

    await writeTasks(nextTasks);
    set({ tasks: nextTasks });
  },
  removeTask: async (id) => {
    const task = findTaskById(get().tasks, id);

    if (!task) {
      return;
    }

    if (task.notification) {
      await cancelTaskReminder(task.notification.id);
    }

    const nextTasks = get().tasks.filter((task) => task.id !== id);

    await writeTasks(nextTasks);
    set({ tasks: nextTasks });

    const photosToDelete = getTaskPhotoUris(task);
    photosToDelete.forEach((uri) => deletePhoto(uri));

    if (task.calendarEventId) {
      await deleteTaskEvent(task.calendarEventId);
    }
  },
  toggleComplete: async (id) => {
    const task = findTaskById(get().tasks, id);

    if (!task) {
      return;
    }

    await get().updateTask({ ...task, isComplete: !task.isComplete });
  },
  clearSentNotification: async (notificationId) => {
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
  },
}));
