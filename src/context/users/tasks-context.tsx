import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { delay } from "../auth/utils/delay";
import { Task } from "./types/Task";

const TASKS_DB: Task[] = [
  {
    title: "Task 1",
    description: "Description for Task 1",
    isComplete: false,
  },
  {
    title: "Task 2",
    description: "Description for Task 2",
    isComplete: true,
  },
];

const TasksContext = createContext<{
  tasks: Task[];
  addTask: (task: Task) => void;
  removeTask: (id: string) => void;
  updateTask: (updatedTask: Task) => void;
} | null>(null);

const NETWORK_DELAY_MS = 500;

export function TasksProvider({ children }: Readonly<PropsWithChildren>) {
  const [tasks, setTasks] = useState<Task[]>(TASKS_DB);

  const addTask = useCallback(
    async (task: Task) => {
      await delay(NETWORK_DELAY_MS);
      setTasks((prevTasks) => [...prevTasks, task]);
    },
    [setTasks],
  );

  const removeTask = useCallback(
    async (id: string) => {
      await delay(NETWORK_DELAY_MS);
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
    },
    [setTasks],
  );

  const updateTask = useCallback(
    async (updatedTask: Task) => {
      await delay(NETWORK_DELAY_MS);
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === updatedTask.id ? updatedTask : task,
        ),
      );
    },
    [setTasks],
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
