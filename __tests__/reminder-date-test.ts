import { SECOND_MS } from "@/constants/time";
import { REMINDER_TYPES } from "@/context/tasks/types/Reminder";
import { getReminderDate } from "@/utils/reminder-date";

describe("getReminderDate", () => {
  test("returns the selected Date for a DATE reminder", () => {
    const date = new Date("2026-05-10T18:30:00.000Z");

    expect(
      getReminderDate({ type: REMINDER_TYPES.DATE, date }),
    ).toBe(date);
  });

  test("returns now plus seconds for a TIME reminder", () => {
    const now = new Date("2026-05-10T18:30:00.000Z");
    const seconds = 90;

    expect(
      getReminderDate({ type: REMINDER_TYPES.TIME, seconds }, now).getTime(),
    ).toBe(now.getTime() + seconds * SECOND_MS);
  });
});
