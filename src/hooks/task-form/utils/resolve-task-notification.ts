import { NOTIFICATION_COPY } from "@/context/tasks/constants";
import { ReminderSelection } from "@/context/tasks/types/Reminder";
import { TaskNotification } from "@/context/tasks/types/Task";
import {
  cancelTaskReminder,
  scheduleTaskReminder,
} from "@/context/tasks/utils/notifications";
import { Alert } from "react-native";

export async function resolveTaskNotification(options: {
  reminderEnabled: boolean;
  reminder: ReminderSelection;
  title: string;
  description: string;
  previousNotification: TaskNotification | null;
}): Promise<TaskNotification | null> {
  const {
    reminderEnabled,
    reminder,
    title,
    description,
    previousNotification,
  } = options;

  if (previousNotification) {
    await cancelTaskReminder(previousNotification.id);
  }

  if (!reminderEnabled) {
    return null;
  }

  const scheduled = await scheduleTaskReminder({
    title,
    body: description || NOTIFICATION_COPY.defaultBody,
    reminder,
  });
  if (scheduled) {
    return scheduled;
  }

  Alert.alert(
    NOTIFICATION_COPY.permissionAlertTitle,
    NOTIFICATION_COPY.permissionAlertMessage,
  );
  return null;
}
