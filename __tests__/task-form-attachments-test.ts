import type { Task, TaskLocation } from "@/context/tasks/types/Task";
import { TASK_FORM_ACTION_TYPES } from "@/hooks/task-form/constants";
import {
  initialTaskFormState,
  taskFormReducer,
  taskFormStateFromTask,
} from "@/hooks/task-form/task-form-reducer";
import { getFailureState } from "@/hooks/task-form/utils/device-action-state";
import { getPhotoToDelete } from "@/hooks/task-form/utils/photo-cleanup";
import { buildTaskFields } from "@/hooks/task-form/utils/task-fields";
import { formatLocationLabel } from "@/utils/location";

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
  test("prefills the photo, location, and granted states", () => {
    const state = taskFormStateFromTask(
      buildTask({ photoUri: "file:///photo.jpg", location: LOCATION }),
    );

    expect(state.photoUri).toBe("file:///photo.jpg");
    expect(state.location).toEqual(LOCATION);
    expect(state.photoState).toEqual({ status: "granted" });
    expect(state.locationState).toEqual({ status: "granted" });
  });

  test("leaves attachments empty when the task has none", () => {
    const state = taskFormStateFromTask(buildTask());

    expect(state.photoUri).toBeNull();
    expect(state.location).toBeNull();
    expect(state.photoState).toEqual({ status: "idle" });
    expect(state.locationState).toEqual({ status: "idle" });
  });
});

describe("taskFormReducer attachments", () => {
  test("SET_PHOTO stores the photo uri", () => {
    const state = taskFormReducer(initialTaskFormState, {
      type: TASK_FORM_ACTION_TYPES.SET_PHOTO,
      payload: "file:///photo.jpg",
    });

    expect(state.photoUri).toBe("file:///photo.jpg");
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
});

describe("buildTaskFields", () => {
  test("carries the photo uri and location into the saved fields", () => {
    const fields = buildTaskFields({
      ...initialTaskFormState,
      title: "  Comprar pan  ",
      description: "  Ir al almacén ",
      photoUri: "file:///photo.jpg",
      location: LOCATION,
    });

    expect(fields).toEqual({
      title: "Comprar pan",
      description: "Ir al almacén",
      photoUri: "file:///photo.jpg",
      location: LOCATION,
    });
  });
});

describe("getPhotoToDelete", () => {
  test("returns the old photo when it changes", () => {
    expect(
      getPhotoToDelete(
        buildTask({ photoUri: "file:///old.jpg" }),
        "file:///new.jpg",
      ),
    ).toBe("file:///old.jpg");
  });

  test("returns null when the photo is unchanged", () => {
    expect(
      getPhotoToDelete(
        buildTask({ photoUri: "file:///photo.jpg" }),
        "file:///photo.jpg",
      ),
    ).toBeNull();
  });

  test("returns null when there is no previous photo", () => {
    expect(getPhotoToDelete(buildTask(), "file:///new.jpg")).toBeNull();
  });
});
