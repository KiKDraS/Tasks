import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import { SECOND_MS } from "@/constants/time";
import { TaskNotification } from "@/context/tasks/types/Task";
import {
  NOTIFICATION_COPY,
  NOTIFICATION_DATA_KEYS,
} from "@/hooks/create-task/constants";
import { REMINDER_TYPES, ReminderSelection } from "../types/Reminder";

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
      name: NOTIFICATION_COPY.channelName,
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

  const reminder = options.reminder;
  const isDateReminder = reminder.type === REMINDER_TYPES.DATE;
  const scheduledAt = isDateReminder
    ? reminder.date
    : new Date(Date.now() + reminder.seconds * SECOND_MS);

  const trigger: Notifications.SchedulableNotificationTriggerInput =
    isDateReminder
      ? {
          type: Notifications.SchedulableTriggerInputTypes.DATE,
          date: scheduledAt,
        }
      : {
          type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
          seconds: reminder.seconds,
        };

  const id = await Notifications.scheduleNotificationAsync({
    content: {
      title: options.title,
      body: options.body,
      sound: "default",
      data: { [NOTIFICATION_DATA_KEYS.taskTitle]: options.title },
    },
    trigger,
  });

  return { id, scheduledAt: scheduledAt.toISOString() };
}

export async function cancelTaskReminder(id: string): Promise<void> {
  await Notifications.cancelScheduledNotificationAsync(id);
}
