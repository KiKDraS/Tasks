import * as Calendar from "expo-calendar/legacy";
import { Platform } from "react-native";

import {
  createTaskEvent,
  deleteTaskEvent,
  type TaskCalendarEvent,
} from "@/services/calendar";
import { DEVICE_MESSAGES } from "@/services/constants/device-messages";

jest.mock("expo-calendar/legacy", () => ({
  requestCalendarPermissionsAsync: jest.fn(),
  getDefaultCalendarAsync: jest.fn(),
  getCalendarsAsync: jest.fn(),
  createEventAsync: jest.fn(),
  deleteEventAsync: jest.fn(),
  EntityTypes: { EVENT: "event" },
}));

const permissionMock = jest.mocked(Calendar.requestCalendarPermissionsAsync);
const defaultCalendarMock = jest.mocked(Calendar.getDefaultCalendarAsync);
const calendarsMock = jest.mocked(Calendar.getCalendarsAsync);
const createEventMock = jest.mocked(Calendar.createEventAsync);
const deleteEventMock = jest.mocked(Calendar.deleteEventAsync);

const permission = (
  status: "granted" | "denied",
  canAskAgain = true,
): Awaited<ReturnType<typeof Calendar.requestCalendarPermissionsAsync>> =>
  ({
    status,
    canAskAgain,
    granted: status === "granted",
    expires: "never",
  }) as unknown as Awaited<
    ReturnType<typeof Calendar.requestCalendarPermissionsAsync>
  >;

const makeCalendar = (
  id: string,
  allowsModifications: boolean,
): Calendar.Calendar =>
  ({
    id,
    title: id,
    allowsModifications,
  }) as Calendar.Calendar;

const event: TaskCalendarEvent = {
  title: "Comprar pan",
  description: "Ir al almacén",
  location: "Av. Siempreviva 742",
  startDate: new Date("2026-05-10T18:00:00.000Z"),
  endDate: new Date("2026-05-10T19:00:00.000Z"),
};

describe("createTaskEvent", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.replaceProperty(Platform, "OS", "ios");
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test("returns denied with canAskAgain when calendar permission is denied", async () => {
    permissionMock.mockResolvedValue(permission("denied", false));

    await expect(createTaskEvent(event)).resolves.toEqual({
      status: "denied",
      canAskAgain: false,
    });
    expect(createEventMock).not.toHaveBeenCalled();
  });

  test("uses the iOS default writable calendar and maps the event fields", async () => {
    permissionMock.mockResolvedValue(permission("granted"));
    defaultCalendarMock.mockResolvedValue(makeCalendar("default", true));
    createEventMock.mockResolvedValue("event-1");

    await expect(createTaskEvent(event)).resolves.toEqual({
      status: "granted",
      value: { eventId: "event-1" },
    });
    expect(createEventMock).toHaveBeenCalledWith("default", {
      title: "Comprar pan",
      notes: "Ir al almacén",
      location: "Av. Siempreviva 742",
      startDate: event.startDate,
      endDate: event.endDate,
      allDay: false,
    });
    expect(calendarsMock).not.toHaveBeenCalled();
  });

  test("falls back to the first writable calendar when the default is read-only", async () => {
    permissionMock.mockResolvedValue(permission("granted"));
    defaultCalendarMock.mockResolvedValue(makeCalendar("default", false));
    calendarsMock.mockResolvedValue([
      makeCalendar("read-only", false),
      makeCalendar("writable", true),
    ]);
    createEventMock.mockResolvedValue("event-2");

    await expect(createTaskEvent(event)).resolves.toEqual({
      status: "granted",
      value: { eventId: "event-2" },
    });
    expect(createEventMock).toHaveBeenCalledWith(
      "writable",
      expect.objectContaining({ title: "Comprar pan" }),
    );
  });

  test("falls back to getCalendarsAsync when there is no default calendar", async () => {
    permissionMock.mockResolvedValue(permission("granted"));
    defaultCalendarMock.mockRejectedValue(new Error("no default"));
    calendarsMock.mockResolvedValue([makeCalendar("writable", true)]);
    createEventMock.mockResolvedValue("event-3");

    await expect(createTaskEvent(event)).resolves.toEqual({
      status: "granted",
      value: { eventId: "event-3" },
    });
    expect(createEventMock).toHaveBeenCalledWith(
      "writable",
      expect.objectContaining({ title: "Comprar pan" }),
    );
  });

  test("returns calendarMissing when no calendar is writable", async () => {
    permissionMock.mockResolvedValue(permission("granted"));
    defaultCalendarMock.mockResolvedValue(makeCalendar("default", false));
    calendarsMock.mockResolvedValue([
      makeCalendar("read-only", false),
      makeCalendar("other-read-only", false),
    ]);

    await expect(createTaskEvent(event)).resolves.toEqual({
      status: "error",
      message: DEVICE_MESSAGES.calendarMissing,
    });
    expect(createEventMock).not.toHaveBeenCalled();
  });

  test("returns calendarError when creating the event throws", async () => {
    permissionMock.mockResolvedValue(permission("granted"));
    defaultCalendarMock.mockResolvedValue(makeCalendar("default", true));
    createEventMock.mockRejectedValue(new Error("create failed"));

    await expect(createTaskEvent(event)).resolves.toEqual({
      status: "error",
      message: DEVICE_MESSAGES.calendarError,
    });
  });

  test("on Android skips getDefaultCalendarAsync and uses a writable calendar", async () => {
    jest.replaceProperty(Platform, "OS", "android");
    permissionMock.mockResolvedValue(permission("granted"));
    calendarsMock.mockResolvedValue([makeCalendar("android", true)]);
    createEventMock.mockResolvedValue("event-4");

    await expect(createTaskEvent(event)).resolves.toEqual({
      status: "granted",
      value: { eventId: "event-4" },
    });
    expect(defaultCalendarMock).not.toHaveBeenCalled();
    expect(createEventMock).toHaveBeenCalledWith(
      "android",
      expect.objectContaining({ title: "Comprar pan" }),
    );
  });
});

describe("deleteTaskEvent", () => {
  test("swallows a delete throw", async () => {
    deleteEventMock.mockRejectedValue(new Error("already gone"));

    await expect(deleteTaskEvent("event-1")).resolves.toBeUndefined();
    expect(deleteEventMock).toHaveBeenCalledWith("event-1");
  });
});
