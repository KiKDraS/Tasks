import type {
  Task,
  TaskShare,
  TaskShareMethod,
} from "@/context/tasks/types/Task";
import { Share, type ShareAction } from "react-native";

type RecordTaskShare = (id: string, share: TaskShare) => Promise<void>;

interface ShareRecordDetails {
  method: TaskShareMethod;
  recipientName?: string;
}

export async function recordTaskShareAfterShare(
  record: RecordTaskShare,
  task: Task,
  result: ShareAction,
  details: ShareRecordDetails,
): Promise<void> {
  const isShared = result.action === Share.sharedAction;

  if (!isShared || !task.id) {
    return;
  }

  try {
    await record(task.id, {
      method: details.method,
      ...(details.recipientName ? { recipientName: details.recipientName } : {}),
      ...(result.activityType ? { activityType: result.activityType } : {}),
      sharedAt: new Date().toISOString(),
    });
  } catch {
    // The share already succeeded; history is best effort.
  }
}
