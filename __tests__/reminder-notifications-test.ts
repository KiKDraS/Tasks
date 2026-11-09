import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

import { SECOND_MS } from "@/constants/time";
import { NOTIFICATION_DATA_KEYS } from "@/context/tasks/constants";
import { REMINDER_TYPES } from "@/context/tasks/types/Reminder";
import { scheduleTaskReminder } from "@/context/tasks/utils/notifications";
import { getReminderDate } from "@/utils/reminder-date";

jest.mock("expo-notifications", () => ({
  setNotificationHandler: jest.fn(),
  getPermissionsAsync: jest.fn(),
  requestPermissionsAsync: jest.fn(),
  scheduleNotificationAsync: jest.fn(),
  cancelScheduledNotificationAsync: jest.fn(),
  setNotificationChannelAsync: jest.fn(),
  AndroidImportance: { HIGH: 4 },
  SchedulableTriggerInputTypes: { DATE: "date", TIME_INTERVAL: "timeInterval" },
}));

const getPermissionsMock = jest.mocked(Notifications.getPermissionsAsync);
const requestPermissionsMock = jest.mocked(
  Notifications.requestPermissionsAsync,
);
const scheduleMock = jest.mocked(Notifications.scheduleNotificationAsync);

const permission = (
  status: "granted" | "denied",
): Awaited<ReturnType<typeof Notifications.getPermissionsAsync>> =>
  ({
    status,
    canAskAgain: true,
    granted: status === "granted",
    expires: "never",
  }) as unknown as Awaited<
    ReturnType<typeof Notifications.getPermissionsAsync>
  >;

const title = "Comprar pan";
const body = "Recordatorio de tu tarea";

describe("scheduleTaskReminder", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.replaceProperty(Platform, "OS", "ios");
    scheduleMock.mockResolvedValue("notification-1");
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  test("schedules a DATE trigger and reports the reminder date", async () => {
    const date = new Date("2026-05-10T18:30:00.000Z");
    const reminder = { type: REMINDER_TYPES.DATE, date } as const;
    getPermissionsMock.mockResolvedValue(permission("granted"));

    await expect(
      scheduleTaskReminder({ title, body, reminder }),
    ).resolves.toEqual({
      id: "notification-1",
      scheduledAt: getReminderDate(reminder).toISOString(),
    });
    expect(scheduleMock).toHaveBeenCalledWith({
      content: {
        title,
        body,
        sound: "default",
        data: { [NOTIFICATION_DATA_KEYS.taskTitle]: title },
      },
      trigger: { type: "date", date },
    });
  });

  test("schedules a TIME_INTERVAL trigger and matches getReminderDate", async () => {
    const now = new Date("2026-05-10T18:30:00.000Z");
    jest.useFakeTimers();
    jest.setSystemTime(now);
    const reminder = { type: REMINDER_TYPES.TIME, seconds: 90 } as const;
    getPermissionsMock.mockResolvedValue(permission("granted"));

    const result = await scheduleTaskReminder({ title, body, reminder });

    expect(result?.scheduledAt).toBe(
      getReminderDate(reminder).toISOString(),
    );
    expect(result?.scheduledAt).toBe(
      new Date(now.getTime() + 90 * SECOND_MS).toISOString(),
    );
    expect(scheduleMock).toHaveBeenCalledWith(
      expect.objectContaining({
        trigger: { type: "timeInterval", seconds: 90 },
      }),
    );
  });

  test("returns null and does not schedule when permission is denied", async () => {
    const reminder = {
      type: REMINDER_TYPES.TIME,
      seconds: 60,
    } as const;
    getPermissionsMock.mockResolvedValue(permission("denied"));
    requestPermissionsMock.mockResolvedValue(permission("denied"));

    await expect(
      scheduleTaskReminder({ title, body, reminder }),
    ).resolves.toBeNull();
    expect(scheduleMock).not.toHaveBeenCalled();
  });
});
