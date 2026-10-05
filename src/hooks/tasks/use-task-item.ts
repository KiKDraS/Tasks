import { ROUTES } from "@/constants/routes";
import { useTasks } from "@/context/tasks/tasks-context";
import { Task } from "@/context/tasks/types/Task";
import { router } from "expo-router";
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

  const openEdit = useCallback(() => {
    if (!task.id) {
      return;
    }
    router.push({ pathname: ROUTES.taskForm, params: { id: task.id } });
  }, [task.id]);

  return { isComplete, toggleCompletion, handleDelete, openEdit };
}
