import { useDB } from "@/hooks/use-db";
import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useMemo,
} from "react";
import { Task } from "./types/Task";

const TASKS_DB: Task[] = [
  {
    id: "task-1",
    title: "Task 1",
    description: "Description for Task 1",
    isComplete: false,
    notification: "Tomorrow, 8:00 AM",
  },
  {
    id: "task-2",
    title: "Task 2",
    description: "Description for Task 2",
    isComplete: true,
    notification: null,
  },
];

const generateId = () => crypto.randomUUID();

const TasksContext = createContext<{
  tasks: Task[];
  addTask: (task: Task) => Promise<void>;
  removeTask: (id: string) => Promise<void>;
  updateTask: (updatedTask: Task) => Promise<void>;
} | null>(null);

export function TasksProvider({ children }: Readonly<PropsWithChildren>) {
  const {
    items: tasks,
    createItem: createTaskDB,
    updateItem: updateTaskDB,
    deleteItem: deleteTaskDB,
  } = useDB<Task>("tasks", TASKS_DB);

  const addTask = useCallback(
    async (task: Task) => {
      await createTaskDB({ ...task, id: task.id ?? generateId() });
    },
    [createTaskDB],
  );

  const removeTask = useCallback(
    async (id: string) => {
      await deleteTaskDB((task) => task.id === id);
    },
    [deleteTaskDB],
  );

  const updateTask = useCallback(
    async (updatedTask: Task) => {
      await updateTaskDB((task) => task.id === updatedTask.id, updatedTask);
    },
    [updateTaskDB],
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
