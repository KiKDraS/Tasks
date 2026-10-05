import { useTasks } from "@/context/tasks/tasks-context";
import { Task } from "@/context/tasks/types/Task";
import { useCallback } from "react";

export function useTaskItem(task: Task) {
  const { updateTask, removeTask } = useTasks();
  const isComplete = !!task.isComplete;

  const toggleCompletion = useCallback(() => {
    updateTask({ ...task, isComplete: !isComplete });
  }, [isComplete, task, updateTask]);

  const handleDelete = useCallback(() => {
    if (task.id) {
      removeTask(task.id);
    }
  }, [removeTask, task.id]);

  return { isComplete, toggleCompletion, handleDelete };
}
