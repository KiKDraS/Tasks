import { Task } from "@/context/tasks/types/Task";
import { useTasksStore } from "@/stores/tasks/tasks-store";

interface TaskByIdResult {
  task?: Task;
  isLoading: boolean;
  notFound: boolean;
}

export function useTasks(): Task[] {
  return useTasksStore((state) => state.tasks);
}

export function useTasksLoading(): boolean {
  return useTasksStore((state) => state.isLoading);
}

export function useTaskById(taskId?: string): TaskByIdResult {
  const task = useTasksStore((state) =>
    taskId ? state.tasks.find((item) => item.id === taskId) : undefined,
  );
  const isLoading = useTasksLoading();

  const notFound = !!taskId && !isLoading && !task;

  return { task, isLoading, notFound };
}
