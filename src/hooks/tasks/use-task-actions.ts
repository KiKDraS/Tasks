import { ROUTES } from "@/constants/routes";
import { Task } from "@/context/tasks/types/Task";
import { useShareTask } from "@/hooks/tasks/use-share-task";
import { useTasksStore } from "@/stores/tasks/tasks-store";
import { router } from "expo-router";
import { useCallback } from "react";

export function useTaskActions(task: Task) {
  const toggleComplete = useTasksStore((state) => state.toggleComplete);
  const removeTask = useTasksStore((state) => state.removeTask);
  const { openShareMenu } = useShareTask(task);

  const toggleCompletion = useCallback(() => {
    if (task.id) {
      toggleComplete(task.id);
    }
  }, [task.id, toggleComplete]);

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

  return { toggleCompletion, handleDelete, openEdit, share: openShareMenu };
}
