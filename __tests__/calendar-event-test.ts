import { HOUR_MS, MINUTE_MS, SECOND_MS } from "@/constants/time";
import { REMINDER_TYPES } from "@/context/tasks/types/Reminder";
import { initialTaskFormState } from "@/hooks/task-form/task-form-reducer";
import type { TaskFormState } from "@/hooks/task-form/types/TaskForm";
import { buildCalendarEventInput } from "@/hooks/task-form/utils/calendar-event";
import type { TaskFields } from "@/hooks/task-form/utils/task-fields";

const NOW = new Date("2026-05-10T18:00:00.000Z");

const FIELDS: TaskFields = {
  title: "Comprar pan",
  description: "Ir al almacén",
  photoUris: [],
  photoUri: null,
  location: {
    latitude: -34.603712,
    longitude: -58.381569,
    address: "Av. Corrientes 1234",
  },
  calendarEventId: null,
};

const buildState = (
  overrides: Partial<TaskFormState> = {},
): TaskFormState => ({
  ...initialTaskFormState,
  ...overrides,
});

describe("buildCalendarEventInput", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(NOW);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test("maps the task fields and uses the DATE reminder as start", () => {
    const date = new Date("2026-06-01T12:00:00.000Z");

    const event = buildCalendarEventInput(
      FIELDS,
      buildState({
        reminderEnabled: true,
        reminder: { type: REMINDER_TYPES.DATE, date },
      }),
    );

    expect(event).toEqual({
      title: "Comprar pan",
      description: "Ir al almacén",
      location: "Av. Corrientes 1234",
      startDate: date,
      endDate: new Date(date.getTime() + HOUR_MS),
    });
  });

  test("uses now plus the TIME reminder seconds as start", () => {
    const event = buildCalendarEventInput(
      FIELDS,
      buildState({
        reminderEnabled: true,
        reminder: { type: REMINDER_TYPES.TIME, seconds: 90 },
      }),
    );
    const start = NOW.getTime() + 90 * SECOND_MS;

    expect(event.startDate.getTime()).toBe(start);
    expect(event.endDate.getTime()).toBe(start + HOUR_MS);
  });

  test("uses the selected reminder when the reminder is disabled", () => {
    const event = buildCalendarEventInput(
      FIELDS,
      buildState({ reminderEnabled: false }),
    );
    const start = NOW.getTime() + 15 * MINUTE_MS;

    expect(event.startDate.getTime()).toBe(start);
    expect(event.endDate.getTime()).toBe(start + HOUR_MS);
  });
});
