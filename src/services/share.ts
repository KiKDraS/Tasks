import type { Task } from "@/context/tasks/types/Task";
import { buildTaskShareMessage } from "@/utils/share-task";
import { Share, type ShareAction } from "react-native";

export interface ShareTaskOptions {
  recipientName?: string;
}

export function shareTask(
  task: Task,
  options?: ShareTaskOptions,
): Promise<ShareAction> {
  return Share.share({
    message: buildTaskShareMessage(task, options?.recipientName),
    title: task.title,
  });
}
