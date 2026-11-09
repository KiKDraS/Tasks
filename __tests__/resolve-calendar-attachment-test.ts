import { TASK_FORM_ACTION_TYPES } from "@/hooks/task-form/constants";
import { initialTaskFormState } from "@/hooks/task-form/task-form-reducer";
import type { TaskFormState } from "@/hooks/task-form/types/TaskForm";
import { resolveCalendarAttachment } from "@/hooks/task-form/utils/resolve-calendar-attachment";
import type { TaskFields } from "@/hooks/task-form/utils/task-fields";
import { createTaskEvent } from "@/services/calendar";

jest.mock("@/services/calendar", () => ({
  createTaskEvent: jest.fn(),
}));

const createTaskEventMock = jest.mocked(createTaskEvent);

const FIELDS: TaskFields = {
  title: "Comprar pan",
  description: "Ir al almacén",
  photoUris: [],
  photoUri: null,
  location: null,
  contact: null,
  calendarEventId: null,
};

const buildState = (
  overrides: Partial<TaskFormState> = {},
): TaskFormState => ({
  ...initialTaskFormState,
  title: FIELDS.title,
  description: FIELDS.description,
  ...overrides,
});

describe("resolveCalendarAttachment", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("clears the event id when the reminder was toggled off", async () => {
    const dispatch = jest.fn();

    await expect(
      resolveCalendarAttachment(
        { ...FIELDS, calendarEventId: "event-1" },
        buildState({ reminderEnabled: false, reminderToggledOff: true }),
        dispatch,
      ),
    ).resolves.toEqual({
      fields: { ...FIELDS, calendarEventId: null },
      failure: null,
    });
    expect(createTaskEventMock).not.toHaveBeenCalled();
    expect(dispatch).not.toHaveBeenCalled();
  });

  test("preserves the event id when the reminder is off but was not toggled off", async () => {
    const dispatch = jest.fn();
    const fields = { ...FIELDS, calendarEventId: "event-1" };

    await expect(
      resolveCalendarAttachment(
        fields,
        buildState({ reminderEnabled: false, reminderToggledOff: false }),
        dispatch,
      ),
    ).resolves.toEqual({ fields, failure: null });
    expect(createTaskEventMock).not.toHaveBeenCalled();
    expect(dispatch).not.toHaveBeenCalled();
  });

  test("keeps the existing event when the reminder is on", async () => {
    const dispatch = jest.fn();
    const fields = { ...FIELDS, calendarEventId: "event-1" };

    await expect(
      resolveCalendarAttachment(
        fields,
        buildState({ reminderEnabled: true, calendarEventId: "event-1" }),
        dispatch,
      ),
    ).resolves.toEqual({ fields, failure: null });
    expect(createTaskEventMock).not.toHaveBeenCalled();
    expect(dispatch).not.toHaveBeenCalled();
  });

  test("creates the event and stores its id when the reminder is on", async () => {
    const dispatch = jest.fn();
    createTaskEventMock.mockResolvedValue({
      status: "granted",
      value: { eventId: "event-2" },
    });

    await expect(
      resolveCalendarAttachment(
        FIELDS,
        buildState({ reminderEnabled: true }),
        dispatch,
      ),
    ).resolves.toEqual({
      fields: { ...FIELDS, calendarEventId: "event-2" },
      failure: null,
    });
    expect(createTaskEventMock).toHaveBeenCalledWith(
      expect.objectContaining({
        title: FIELDS.title,
        description: FIELDS.description,
      }),
    );
    expect(dispatch).toHaveBeenCalledWith({
      type: TASK_FORM_ACTION_TYPES.SET_CALENDAR_EVENT,
      payload: "event-2",
    });
  });

  test("returns the denied failure and a null event id without aborting", async () => {
    const dispatch = jest.fn();
    createTaskEventMock.mockResolvedValue({
      status: "denied",
      canAskAgain: false,
    });

    await expect(
      resolveCalendarAttachment(
        FIELDS,
        buildState({ reminderEnabled: true }),
        dispatch,
      ),
    ).resolves.toEqual({
      fields: { ...FIELDS, calendarEventId: null },
      failure: { status: "denied", canAskAgain: false },
    });
    expect(dispatch).toHaveBeenCalledWith({
      type: TASK_FORM_ACTION_TYPES.SET_CALENDAR_STATE,
      payload: { status: "blocked" },
    });
  });

  test("returns the device error failure and a null event id without aborting", async () => {
    const dispatch = jest.fn();
    const message = "No pudimos acceder a tu calendario. Intentá de nuevo.";
    createTaskEventMock.mockResolvedValue({ status: "error", message });

    await expect(
      resolveCalendarAttachment(
        FIELDS,
        buildState({ reminderEnabled: true }),
        dispatch,
      ),
    ).resolves.toEqual({
      fields: { ...FIELDS, calendarEventId: null },
      failure: { status: "error", message },
    });
    expect(dispatch).toHaveBeenCalledWith({
      type: TASK_FORM_ACTION_TYPES.SET_CALENDAR_STATE,
      payload: { status: "error", message },
    });
  });
});
