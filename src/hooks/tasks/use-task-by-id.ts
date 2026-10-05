import { useTasks } from "@/context/tasks/tasks-context";

export function useTaskById(taskId?: string) {
  const { tasks, isLoading } = useTasks();
  const task = taskId
    ? tasks.find((item) => item.id === taskId)
    : undefined;
  const notFound = !!taskId && !isLoading && !task;

  return { task, isLoading, notFound };
}
