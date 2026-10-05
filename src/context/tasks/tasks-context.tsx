import { STORAGE_KEYS } from "@/constants/storage-keys";
import { useDB } from "@/hooks/use-db";
import { generateId } from "@/utils/id";
import * as Notifications from "expo-notifications";
import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
} from "react";
import { TASKS_DB } from "./data/tasks-seed";
import { Task } from "./types/Task";
import { cancelTaskReminder } from "./utils/notifications";

const TasksContext = createContext<{
  tasks: Task[];
  isLoading: boolean;
  addTask: (task: Task) => Promise<void>;
  removeTask: (id: string) => Promise<void>;
  updateTask: (updatedTask: Task) => Promise<void>;
} | null>(null);

const findTaskById = (tasks: Task[], id?: string) =>
  tasks.find((item) => item.id === id);

function getNotificationToCancel(updatedTask: Task, currentTask?: Task) {
  if (!updatedTask.isComplete) {
    return null;
  }

  return updatedTask.notification ?? currentTask?.notification ?? null;
}

function useClearSentNotification(
  clearByNotificationId: (notificationId: string) => void,
) {
  useEffect(() => {
    const subscription = Notifications.addNotificationReceivedListener(
      (notification) => {
        clearByNotificationId(notification.request.identifier);
      },
    );

    return () => subscription.remove();
  }, [clearByNotificationId]);
}

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
