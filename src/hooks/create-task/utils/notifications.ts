import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import { TaskNotification } from "@/context/tasks/types/Task";
import { ReminderSelection } from "../types/Reminder";

const DEFAULT_CHANNEL_ID = "default";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export async function getPermissions(): Promise<boolean> {
  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync(DEFAULT_CHANNEL_ID, {
      name: "Recordatorios",
      importance: Notifications.AndroidImportance.HIGH,
    });
  }

  const { status } = await Notifications.getPermissionsAsync();
  if (status === "granted") {
    return true;
  }

  const { status: requestedStatus } =
    await Notifications.requestPermissionsAsync();

  return requestedStatus === "granted";
}

export async function scheduleTaskReminder(options: {
  title: string;
  body: string;
  reminder: ReminderSelection;
}): Promise<TaskNotification | null> {
  const granted = await getPermissions();

  if (!granted) {
    return null;
  }

  const scheduledAt =
    options.reminder.type === "date"
      ? options.reminder.date
      : new Date(Date.now() + options.reminder.seconds * 1000);

  const trigger: Notifications.SchedulableNotificationTriggerInput =
    options.reminder.type === "date"
      ? {
          type: Notifications.SchedulableTriggerInputTypes.DATE,
          date: scheduledAt,
        }
      : {
          type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
          seconds: options.reminder.seconds,
        };

  const id = await Notifications.scheduleNotificationAsync({
    content: {
      title: options.title,
      body: options.body,
      sound: "default",
      data: { taskTitle: options.title },
    },
    trigger,
  });

  return { id, scheduledAt: scheduledAt.toISOString() };
}

export async function cancelTaskReminder(id: string): Promise<void> {
  await Notifications.cancelScheduledNotificationAsync(id);
}
