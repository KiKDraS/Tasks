import type { Task, TaskShare } from "@/context/tasks/types/Task";
import { findTaskById } from "@/context/tasks/utils/find-task-by-id";
import { writeTasksBestEffort } from "@/stores/tasks/task-mutation-queue";

export async function recordTaskShare(
  tasks: Task[],
  id: string,
  share: TaskShare,
): Promise<Task[] | null> {
  const currentTask = findTaskById(tasks, id);

  if (!currentTask) {
    return null;
  }

  const nextTasks = tasks.map((task) =>
    task.id === id
      ? { ...task, shares: [...(task.shares ?? []), share] }
      : task,
  );

  await writeTasksBestEffort(nextTasks);

  return nextTasks;
}
