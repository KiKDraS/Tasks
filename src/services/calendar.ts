import * as Calendar from "expo-calendar/legacy";
import { Platform } from "react-native";

import { DEVICE_MESSAGES } from "@/services/constants/device-messages";
import { isPermissionGranted, type DeviceResult } from "@/services/permissions";

export interface TaskCalendarEvent {
  title: string;
  description: string;
  location?: string;
  startDate: Date;
  endDate: Date;
}

const isWritable = (calendar: Calendar.Calendar): boolean =>
  calendar.allowsModifications;

async function getDefaultWritableCalendar(): Promise<Calendar.Calendar | null> {
  if (Platform.OS !== "ios") {
    return null;
  }

  try {
    const calendar = await Calendar.getDefaultCalendarAsync();

    return isWritable(calendar) ? calendar : null;
  } catch {
    return null;
  }
}

async function getWritableCalendar(): Promise<Calendar.Calendar | null> {
  const defaultCalendar = await getDefaultWritableCalendar();
  if (defaultCalendar) {
    return defaultCalendar;
  }

  const calendars = await Calendar.getCalendarsAsync(
    Calendar.EntityTypes.EVENT,
  );

  return calendars.find(isWritable) ?? null;
}

function createEventInCalendar(
  calendar: Calendar.Calendar,
  event: TaskCalendarEvent,
): Promise<string> {
  return Calendar.createEventAsync(calendar.id, {
    title: event.title,
    notes: event.description,
    location: event.location,
    startDate: event.startDate,
    endDate: event.endDate,
    allDay: false,
  });
}

export async function createTaskEvent(
  event: TaskCalendarEvent,
): Promise<DeviceResult<{ eventId: string }>> {
  try {
    const permission = await Calendar.requestCalendarPermissionsAsync();
    if (!isPermissionGranted(permission)) {
      return { status: "denied", canAskAgain: permission.canAskAgain };
    }

    const calendar = await getWritableCalendar();
    if (!calendar) {
      return { status: "error", message: DEVICE_MESSAGES.calendarMissing };
    }

    const eventId = await createEventInCalendar(calendar, event);

    return { status: "granted", value: { eventId } };
  } catch {
    return { status: "error", message: DEVICE_MESSAGES.calendarError };
  }
}

export async function deleteTaskEvent(eventId: string): Promise<void> {
  try {
    await Calendar.deleteEventAsync(eventId);
  } catch {
    // Best effort: the event may already be gone or the permission revoked.
  }
}
