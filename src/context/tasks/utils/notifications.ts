import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import { SECOND_MS } from "@/constants/time";
import { NOTIFICATION_COPY, NOTIFICATION_DATA_KEYS } from "../constants";
import { REMINDER_TYPES, ReminderSelection } from "../types/Reminder";
import { TaskNotification } from "../types/Task";

const DEFAULT_CHANNEL_ID = "default";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

async function ensureAndroidChannel(): Promise<void> {
  if (Platform.OS !== "android") {
    return;
  }

  await Notifications.setNotificationChannelAsync(DEFAULT_CHANNEL_ID, {
    name: NOTIFICATION_COPY.channelName,
    importance: Notifications.AndroidImportance.HIGH,
  });
}

function getScheduledAt(reminder: ReminderSelection): Date {
  return reminder.type === REMINDER_TYPES.DATE
    ? reminder.date
    : new Date(Date.now() + reminder.seconds * SECOND_MS);
}

function getNotificationTrigger(
  reminder: ReminderSelection,
  scheduledAt: Date,
): Notifications.SchedulableNotificationTriggerInput {
  return reminder.type === REMINDER_TYPES.DATE
    ? {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date: scheduledAt,
      }
    : {
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: reminder.seconds,
      };
}

export async function getPermissions(): Promise<boolean> {
  await ensureAndroidChannel();

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

  const scheduledAt = getScheduledAt(options.reminder);
  const trigger = getNotificationTrigger(options.reminder, scheduledAt);

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
