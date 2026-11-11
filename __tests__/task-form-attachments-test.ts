import { REMINDER_TYPES } from "@/context/tasks/types/Reminder";
import type { Task, TaskLocation } from "@/context/tasks/types/Task";
import { TASK_FORM_ACTION_TYPES } from "@/hooks/task-form/constants";
import {
  initialTaskFormState,
  taskFormReducer,
  taskFormStateFromTask,
} from "@/hooks/task-form/task-form-reducer";
import { getFailureState } from "@/hooks/task-form/utils/device-action-state";
import { buildTaskFields } from "@/hooks/task-form/utils/task-fields";
import { formatLocationLabel } from "@/utils/location";
import { getPhotosToDelete } from "@/utils/task-photos";

const PHOTOS = ["file:///photo-1.jpg", "file:///photo-2.jpg"];

const LOCATION: TaskLocation = {
  latitude: -34.603712,
  longitude: -58.381569,
};

const buildTask = (overrides: Partial<Task> = {}): Task => ({
  id: "task-1",
  title: "Comprar pan",
  description: "Ir al almacén",
  notification: null,
  ...overrides,
});

describe("getFailureState", () => {
  test("maps cancelled to idle", () => {
    expect(getFailureState({ status: "cancelled" })).toEqual({ status: "idle" });
  });

  test("maps denied with canAskAgain to denied", () => {
    expect(
      getFailureState({ status: "denied", canAskAgain: true }),
    ).toEqual({ status: "denied", canAskAgain: true });
  });

  test("maps denied without canAskAgain to blocked", () => {
    expect(
      getFailureState({ status: "denied", canAskAgain: false }),
    ).toEqual({ status: "blocked" });
  });

  test("keeps the service message for errors", () => {
    const message = "No pudimos obtener tu ubicación. Intentá de nuevo.";

    expect(getFailureState({ status: "error", message })).toEqual({
      status: "error",
      message,
    });
  });
});

describe("formatLocationLabel", () => {
  test("prefers the address when present", () => {
    expect(
      formatLocationLabel({ ...LOCATION, address: "Av. Corrientes 1234" }),
    ).toBe("Av. Corrientes 1234");
  });

  test("formats coordinates with four decimals when there is no address", () => {
    expect(formatLocationLabel(LOCATION)).toBe("-34.6037, -58.3816");
  });
});

describe("taskFormStateFromTask", () => {
  test("prefills the photo list, location, and granted states", () => {
    const state = taskFormStateFromTask(
      buildTask({ photoUris: PHOTOS, location: LOCATION }),
    );

    expect(state.photoUris).toEqual(PHOTOS);
    expect(state.location).toEqual(LOCATION);
    expect(state.photoState).toEqual({ status: "granted" });
    expect(state.locationState).toEqual({ status: "granted" });
  });

  test("prefills a legacy photoUri as a one-photo list", () => {
    const state = taskFormStateFromTask(
      buildTask({ photoUri: "file:///legacy.jpg" }),
    );

    expect(state.photoUris).toEqual(["file:///legacy.jpg"]);
    expect(state.photoState).toEqual({ status: "granted" });
  });

  test("prefills the calendar event and granted state", () => {
    const state = taskFormStateFromTask(
      buildTask({ calendarEventId: "event-1" }),
    );

    expect(state.calendarEventId).toBe("event-1");
    expect(state.calendarState).toEqual({ status: "granted" });
  });

  test("prefills the reminder from a pending notification", () => {
    const scheduledAt = new Date(Date.now() + 60 * 60 * 1000).toISOString();
    const state = taskFormStateFromTask(
      buildTask({ notification: { id: "notification-1", scheduledAt } }),
    );

    expect(state.reminderEnabled).toBe(true);
    expect(state.reminder).toEqual({
      type: REMINDER_TYPES.DATE,
      date: new Date(scheduledAt),
    });
  });

  test("disables the reminder but keeps the calendar event when the notification expired", () => {
    const scheduledAt = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    const state = taskFormStateFromTask(
      buildTask({
        notification: { id: "notification-1", scheduledAt },
        calendarEventId: "event-1",
      }),
    );

    expect(state.reminderEnabled).toBe(false);
    expect(state.calendarEventId).toBe("event-1");
    expect(state.reminder).toEqual({
      type: REMINDER_TYPES.TIME,
      seconds: expect.any(Number),
    });
  });

  test("disables the reminder but keeps the calendar event when there is no notification", () => {
    const state = taskFormStateFromTask(
      buildTask({ notification: null, calendarEventId: "event-1" }),
    );

    expect(state.reminderEnabled).toBe(false);
    expect(state.calendarEventId).toBe("event-1");
  });

  test("leaves attachments empty when the task has none", () => {
    const state = taskFormStateFromTask(buildTask());

    expect(state.photoUris).toEqual([]);
    expect(state.location).toBeNull();
    expect(state.calendarEventId).toBeNull();
    expect(state.photoState).toEqual({ status: "idle" });
    expect(state.locationState).toEqual({ status: "idle" });
    expect(state.calendarState).toEqual({ status: "idle" });
  });
});

describe("taskFormReducer attachments", () => {
  test("ADD_PHOTOS appends the new photos and grants the state", () => {
    const state = taskFormReducer(initialTaskFormState, {
      type: TASK_FORM_ACTION_TYPES.ADD_PHOTOS,
      payload: PHOTOS,
    });

    expect(state.photoUris).toEqual(PHOTOS);
    expect(state.photoState).toEqual({ status: "granted" });
  });

  test("ADD_PHOTOS appends to the photos already in the form", () => {
    const withFirstPhoto = taskFormReducer(initialTaskFormState, {
      type: TASK_FORM_ACTION_TYPES.ADD_PHOTOS,
      payload: [PHOTOS[0]],
    });
    const state = taskFormReducer(withFirstPhoto, {
      type: TASK_FORM_ACTION_TYPES.ADD_PHOTOS,
      payload: [PHOTOS[1]],
    });

    expect(state.photoUris).toEqual(PHOTOS);
  });

  test("REMOVE_PHOTO removes the matching uri and keeps the state granted", () => {
    const state = taskFormReducer(
      {
        ...initialTaskFormState,
        photoUris: PHOTOS,
        photoState: { status: "granted" },
      },
      {
        type: TASK_FORM_ACTION_TYPES.REMOVE_PHOTO,
        payload: PHOTOS[0],
      },
    );

    expect(state.photoUris).toEqual([PHOTOS[1]]);
    expect(state.photoState).toEqual({ status: "granted" });
  });

  test("REMOVE_PHOTO returns to idle when the last photo is removed", () => {
    const state = taskFormReducer(
      {
        ...initialTaskFormState,
        photoUris: [PHOTOS[0]],
        photoState: { status: "granted" },
      },
      {
        type: TASK_FORM_ACTION_TYPES.REMOVE_PHOTO,
        payload: PHOTOS[0],
      },
    );

    expect(state.photoUris).toEqual([]);
    expect(state.photoState).toEqual({ status: "idle" });
  });

  test("SET_LOCATION stores the location", () => {
    const state = taskFormReducer(initialTaskFormState, {
      type: TASK_FORM_ACTION_TYPES.SET_LOCATION,
      payload: LOCATION,
    });

    expect(state.location).toEqual(LOCATION);
  });

  test("SET_PHOTO_STATE stores the photo permission state", () => {
    const state = taskFormReducer(initialTaskFormState, {
      type: TASK_FORM_ACTION_TYPES.SET_PHOTO_STATE,
      payload: { status: "blocked" },
    });

    expect(state.photoState).toEqual({ status: "blocked" });
  });

  test("SET_LOCATION_STATE stores the location permission state", () => {
    const state = taskFormReducer(initialTaskFormState, {
      type: TASK_FORM_ACTION_TYPES.SET_LOCATION_STATE,
      payload: { status: "denied", canAskAgain: true },
    });

    expect(state.locationState).toEqual({
      status: "denied",
      canAskAgain: true,
    });
  });

  test("SET_CALENDAR_EVENT stores the calendar event id", () => {
    const state = taskFormReducer(initialTaskFormState, {
      type: TASK_FORM_ACTION_TYPES.SET_CALENDAR_EVENT,
      payload: "event-1",
    });

    expect(state.calendarEventId).toBe("event-1");
  });

  test("SET_CALENDAR_STATE stores the calendar permission state", () => {
    const state = taskFormReducer(initialTaskFormState, {
      type: TASK_FORM_ACTION_TYPES.SET_CALENDAR_STATE,
      payload: { status: "denied", canAskAgain: true },
    });

    expect(state.calendarState).toEqual({
      status: "denied",
      canAskAgain: true,
    });
  });

  test("TOGGLE_REMINDER marks the reminder as toggled off when disabling", () => {
    const state = taskFormReducer(initialTaskFormState, {
      type: TASK_FORM_ACTION_TYPES.TOGGLE_REMINDER,
    });

    expect(state.reminderEnabled).toBe(false);
    expect(state.reminderToggledOff).toBe(true);
  });

  test("TOGGLE_REMINDER clears the toggled-off flag when enabling again", () => {
    const disabled = taskFormReducer(initialTaskFormState, {
      type: TASK_FORM_ACTION_TYPES.TOGGLE_REMINDER,
    });
    const state = taskFormReducer(disabled, {
      type: TASK_FORM_ACTION_TYPES.TOGGLE_REMINDER,
    });

    expect(state.reminderEnabled).toBe(true);
    expect(state.reminderToggledOff).toBe(false);
  });
});

describe("buildTaskFields", () => {
  test("carries the photo list and location into the saved fields", () => {
    const fields = buildTaskFields({
      ...initialTaskFormState,
      title: "  Comprar pan  ",
      description: "  Ir al almacén ",
      photoUris: PHOTOS,
      location: LOCATION,
    });

    expect(fields).toEqual({
      title: "Comprar pan",
      description: "Ir al almacén",
      photoUris: PHOTOS,
      photoUri: null,
      location: LOCATION,
      calendarEventId: null,
    });
  });

  test("carries the calendar event id into the saved fields", () => {
    const fields = buildTaskFields({
      ...initialTaskFormState,
      calendarEventId: "event-1",
    });

    expect(fields.calendarEventId).toBe("event-1");
  });
});

describe("getPhotosToDelete", () => {
  test("returns every removed photo", () => {
    const task = buildTask({
      photoUris: [PHOTOS[0], PHOTOS[1], "file:///photo-3.jpg"],
    });

    expect(getPhotosToDelete(task, [PHOTOS[0]])).toEqual([
      PHOTOS[1],
      "file:///photo-3.jpg",
    ]);
  });

  test("counts the legacy photoUri as a removable photo", () => {
    expect(
      getPhotosToDelete(buildTask({ photoUri: "file:///legacy.jpg" }), []),
    ).toEqual(["file:///legacy.jpg"]);
  });

  test("returns no photos when the list is unchanged", () => {
    const task = buildTask({ photoUris: PHOTOS });

    expect(getPhotosToDelete(task, [PHOTOS[1], PHOTOS[0]])).toEqual([]);
  });

  test("keeps the legacy photo when it is still in the next list", () => {
    const task = buildTask({ photoUri: "file:///legacy.jpg" });

    expect(getPhotosToDelete(task, ["file:///legacy.jpg"])).toEqual([]);
  });
});
