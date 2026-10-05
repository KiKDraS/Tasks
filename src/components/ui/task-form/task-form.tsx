import { ThemedText } from "@/components/themed-text";
import { Colors } from "@/constants/theme";
import { useTaskById } from "@/hooks/tasks/use-task-by-id";
import { ActivityIndicator } from "react-native";
import { TaskFormContent } from "./task-form-content";

interface TaskFormProps {
  taskId?: string;
}

export function TaskForm({ taskId }: Readonly<TaskFormProps>) {
  const { task, isLoading, notFound } = useTaskById(taskId);

  if (taskId && isLoading) {
    return <ActivityIndicator color={Colors.primary} />;
  }

  if (notFound) {
    return (
      <ThemedText type="body-md" color="error">
        No encontramos la tarea.
      </ThemedText>
    );
  }

  return <TaskFormContent key={taskId ?? "new"} task={task} />;
}
