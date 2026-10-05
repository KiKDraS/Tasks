import { STORAGE_KEYS } from "@/constants/storage-keys";
import { cancelTaskReminder } from "@/hooks/create-task/utils/notifications";
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
import { normalizeTask } from "./utils/normalize-task";

const TasksContext = createContext<{
  tasks: Task[];
  addTask: (task: Task) => Promise<void>;
  removeTask: (id: string) => Promise<void>;
  updateTask: (updatedTask: Task) => Promise<void>;
} | null>(null);

export function TasksProvider({ children }: Readonly<PropsWithChildren>) {
  const {
    items: storedTasks,
    createItem: createTaskDB,
    updateItem: updateTaskDB,
    deleteItem: deleteTaskDB,
  } = useDB<Task>(STORAGE_KEYS.tasks, TASKS_DB);

  const tasks = useMemo(
    () => storedTasks.map((task) => normalizeTask(task)),
    [storedTasks],
  );

  useEffect(() => {
    const subscription = Notifications.addNotificationReceivedListener(
      (notification) => {
        const notificationId = notification.request.identifier;
        void updateTaskDB(
          (task) => task.notification?.id === notificationId,
          { notification: null },
        );
      },
    );

    return () => subscription.remove();
  }, [updateTaskDB]);

  const addTask = useCallback(
    async (task: Task) => {
      await createTaskDB({ ...task, id: task.id ?? generateId() });
    },
    [createTaskDB],
  );

  const removeTask = useCallback(
    async (id: string) => {
      const pendingNotification = tasks.find(
        (item) => item.id === id,
      )?.notification;
      if (pendingNotification) {
        await cancelTaskReminder(pendingNotification.id);
      }

      await deleteTaskDB((item) => item.id === id);
    },
    [deleteTaskDB, tasks],
  );

  const updateTask = useCallback(
    async (updatedTask: Task) => {
      const currentTask = tasks.find((task) => task.id === updatedTask.id);
      const pendingNotification = currentTask?.notification;
      const isCompletingTask = Boolean(updatedTask.isComplete);
      let nextTask = updatedTask;

      if (isCompletingTask && pendingNotification) {
        await cancelTaskReminder(pendingNotification.id);
        nextTask = { ...updatedTask, notification: null };
      }

      await updateTaskDB((task) => task.id === updatedTask.id, nextTask);
    },
    [tasks, updateTaskDB],
  );

  const data = useMemo(
    () => ({
      tasks,
      addTask,
      removeTask,
      updateTask,
    }),
    [addTask, removeTask, tasks, updateTask],
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
