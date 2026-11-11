import type { Task } from "@/context/tasks/types/Task";
import { formatLocationLabel } from "@/utils/location";
import { getTaskPhotoUris } from "@/utils/task-photos";
import { Share, type ShareAction } from "react-native";

export interface ShareTaskOptions {
  title?: string;
  recipientName?: string;
}

export function buildTaskShareMessage(
  task: Task,
  recipientName?: string,
): string {
  const description = task.description.trim();
  const photoCount = getTaskPhotoUris(task).length;
  const lines = [
    `Tarea: ${task.title}`,
    ...(description ? [`Descripción: ${description}`] : []),
    `Estado: ${task.isComplete ? "Completada" : "Pendiente"}`,
    ...(task.location
      ? [`Ubicación: ${formatLocationLabel(task.location)}`]
      : []),
    ...(photoCount > 0 ? [`Fotos: ${photoCount}`] : []),
  ];
  const message = lines.join("\n");

  return recipientName ? `Para ${recipientName}:\n\n${message}` : message;
}

export function shareTask(
  task: Task,
  options?: ShareTaskOptions,
): Promise<ShareAction> {
  return Share.share({
    message: buildTaskShareMessage(task, options?.recipientName),
    title: options?.title ?? task.title,
  });
}
