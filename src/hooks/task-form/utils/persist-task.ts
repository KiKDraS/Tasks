import { Task, TaskNotification } from "@/context/tasks/types/Task";
import type { TaskFormState } from "@/hooks/task-form/types/TaskForm";
import type { DeviceFailure } from "@/hooks/task-form/utils/device-action-state";
import { resolveTaskNotification } from "@/hooks/task-form/utils/resolve-task-notification";
import { saveTask } from "@/hooks/task-form/utils/save-task";
import { TaskFields } from "@/hooks/task-form/utils/task-fields";
import { deleteTaskEvent } from "@/services/calendar";
import { DEVICE_MESSAGES } from "@/services/constants/device-messages";
import { deletePhoto } from "@/services/media";
import { getPhotosToDelete } from "@/utils/task-photos";
import { Alert } from "react-native";

async function cleanupReplacedAttachments(
  task: Task | undefined,
  state: TaskFormState,
): Promise<void> {
  const photosToDelete = getPhotosToDelete(task, state.photoUris);
  photosToDelete.forEach((uri) => deletePhoto(uri));

  const calendarEventToDelete = state.reminderToggledOff
    ? task?.calendarEventId
    : null;
  if (calendarEventToDelete) {
    await deleteTaskEvent(calendarEventToDelete);
  }
}

function getCalendarFailureMessage(
  failure: DeviceFailure,
  notification: TaskNotification | null,
): string {
  if (failure.status === "error") {
    return failure.message;
  }

  if (notification) {
    return DEVICE_MESSAGES.calendarSkippedWithNotification;
  }

  return DEVICE_MESSAGES.calendarSkipped;
}

export function showCalendarFailureAlert(
  failure: DeviceFailure,
  notification: TaskNotification | null,
): void {
  Alert.alert(
    "No se agregó al calendario",
    getCalendarFailureMessage(failure, notification),
    [{ text: "Entendido" }],
  );
}

interface PersistTaskOptions {
  task?: Task;
  state: TaskFormState;
  fields: TaskFields;
  addTask: (task: Task) => Promise<void>;
  updateTask: (updatedTask: Task) => Promise<void>;
}

export async function persistTask(
  options: PersistTaskOptions,
): Promise<TaskNotification | null> {
  const { task, state, fields, addTask, updateTask } = options;
  const notification = await resolveTaskNotification({
    reminderEnabled: state.reminderEnabled && !task?.isComplete,
    reminder: state.reminder,
    title: fields.title,
    description: fields.description,
    previousNotification: task?.notification ?? null,
  });
  await saveTask({ task, fields, notification, addTask, updateTask });
  await cleanupReplacedAttachments(task, state);
  return notification;
}
