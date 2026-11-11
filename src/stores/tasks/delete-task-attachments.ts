import { Task } from "@/context/tasks/types/Task";
import { deleteTaskEvent } from "@/services/calendar";
import { deletePhoto } from "@/services/media";
import { getTaskPhotoUris } from "@/utils/task-photos";

export async function deleteTaskAttachments(task: Task): Promise<void> {
  getTaskPhotoUris(task).forEach((uri) => deletePhoto(uri));

  if (task.calendarEventId) {
    await deleteTaskEvent(task.calendarEventId);
  }
}
