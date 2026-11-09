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

  test("clears the event id when the calendar is disabled", async () => {
    const dispatch = jest.fn();

    await expect(
      resolveCalendarAttachment({ ...FIELDS, calendarEventId: "event-1" }, buildState(), dispatch),
    ).resolves.toEqual({
      status: "ready",
      fields: { ...FIELDS, calendarEventId: null },
    });
    expect(createTaskEventMock).not.toHaveBeenCalled();
    expect(dispatch).not.toHaveBeenCalled();
  });

  test("keeps the existing event when the calendar is enabled", async () => {
    const dispatch = jest.fn();
    const fields = { ...FIELDS, calendarEventId: "event-1" };

    await expect(
      resolveCalendarAttachment(
        fields,
        buildState({ calendarEnabled: true, calendarEventId: "event-1" }),
        dispatch,
      ),
    ).resolves.toEqual({ status: "ready", fields });
    expect(createTaskEventMock).not.toHaveBeenCalled();
    expect(dispatch).not.toHaveBeenCalled();
  });

  test("creates the event and stores its id when the calendar is enabled", async () => {
    const dispatch = jest.fn();
    createTaskEventMock.mockResolvedValue({
      status: "granted",
      value: { eventId: "event-2" },
    });

    await expect(
      resolveCalendarAttachment(
        FIELDS,
        buildState({ calendarEnabled: true }),
        dispatch,
      ),
    ).resolves.toEqual({
      status: "ready",
      fields: { ...FIELDS, calendarEventId: "event-2" },
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

  test("stores the blocked permission state and returns failed", async () => {
    const dispatch = jest.fn();
    createTaskEventMock.mockResolvedValue({
      status: "denied",
      canAskAgain: false,
    });

    await expect(
      resolveCalendarAttachment(
        FIELDS,
        buildState({ calendarEnabled: true }),
        dispatch,
      ),
    ).resolves.toEqual({ status: "failed" });
    expect(dispatch).toHaveBeenCalledWith({
      type: TASK_FORM_ACTION_TYPES.SET_CALENDAR_STATE,
      payload: { status: "blocked" },
    });
  });

  test("stores the device error state and returns failed", async () => {
    const dispatch = jest.fn();
    const message = "No pudimos acceder a tu calendario. Intentá de nuevo.";
    createTaskEventMock.mockResolvedValue({ status: "error", message });

    await expect(
      resolveCalendarAttachment(
        FIELDS,
        buildState({ calendarEnabled: true }),
        dispatch,
      ),
    ).resolves.toEqual({ status: "failed" });
    expect(dispatch).toHaveBeenCalledWith({
      type: TASK_FORM_ACTION_TYPES.SET_CALENDAR_STATE,
      payload: { status: "error", message },
    });
  });
});
