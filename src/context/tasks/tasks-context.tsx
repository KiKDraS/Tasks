import { STORAGE_KEYS } from "@/constants/storage-keys";
import { useDB } from "@/hooks/use-db";
import { useClearSentNotification } from "@/hooks/tasks/use-clear-sent-notification";
import { generateId } from "@/utils/id";
import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useMemo,
} from "react";
import { TASKS_DB } from "./data/tasks-seed";
import { Task } from "./types/Task";
import { findTaskById } from "./utils/find-task-by-id";
import { getNotificationToCancel } from "./utils/get-notification-to-cancel";
import { cancelTaskReminder } from "./utils/notifications";

const TasksContext = createContext<{
  tasks: Task[];
  isLoading: boolean;
  addTask: (task: Task) => Promise<void>;
  removeTask: (id: string) => Promise<void>;
  updateTask: (updatedTask: Task) => Promise<void>;
} | null>(null);

export function TasksProvider({ children }: Readonly<PropsWithChildren>) {
  const {
    items: storedTasks,
    isLoading,
    createItem: createTaskDB,
    updateItem: updateTaskDB,
    deleteItem: deleteTaskDB,
  } = useDB<Task>(STORAGE_KEYS.tasks, TASKS_DB);

  const tasks = storedTasks;

  const clearSentNotification = useCallback(
    (notificationId: string) => {
      void updateTaskDB(
        (task) => task.notification?.id === notificationId,
        { notification: null },
      );
    },
    [updateTaskDB],
  );

  useClearSentNotification(clearSentNotification);

  const addTask = useCallback(
    async (task: Task) => {
      await createTaskDB({ ...task, id: task.id ?? generateId() });
    },
    [createTaskDB],
  );

  const removeTask = useCallback(
    async (id: string) => {
      const pendingNotification = findTaskById(tasks, id)?.notification;
      if (pendingNotification) {
        await cancelTaskReminder(pendingNotification.id);
      }

      await deleteTaskDB((item) => item.id === id);
    },
    [deleteTaskDB, tasks],
  );

  const updateTask = useCallback(
    async (updatedTask: Task) => {
      const currentTask = findTaskById(tasks, updatedTask.id);
      const notificationToCancel = getNotificationToCancel(
        updatedTask,
        currentTask,
      );
      let nextTask = updatedTask;

      if (notificationToCancel) {
        await cancelTaskReminder(notificationToCancel.id);
        nextTask = { ...updatedTask, notification: null };
      }

      await updateTaskDB((task) => task.id === updatedTask.id, nextTask);
    },
    [tasks, updateTaskDB],
  );

  const data = useMemo(
    () => ({
      tasks,
      isLoading,
      addTask,
      removeTask,
      updateTask,
    }),
    [addTask, isLoading, removeTask, tasks, updateTask],
  );

  return <TasksContext.Provider value={data}>{children}</TasksContext.Provider>;
}

export function useTasks() {
  const context = useContext(TasksContext);
  if (!context) {
    throw new Error("useTasks must be used within a TasksProvider");
  }
  return context;
}
