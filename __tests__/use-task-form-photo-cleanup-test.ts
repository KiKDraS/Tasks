import { act, renderHook } from "@testing-library/react-native";
import { Alert } from "react-native";

import type { Task } from "@/context/tasks/types/Task";
import { TASK_FORM_ACTION_TYPES } from "@/hooks/task-form/constants";
import { useTaskForm } from "@/hooks/task-form/use-task-form";
import { resolveTaskNotification } from "@/hooks/task-form/utils/resolve-task-notification";
import { saveTask } from "@/hooks/task-form/utils/save-task";
import { createTaskEvent, deleteTaskEvent } from "@/services/calendar";
import { deletePhoto } from "@/services/media";
import { useTasksStore } from "@/stores/tasks/tasks-store";
import { router } from "expo-router";

jest.mock("@/stores/tasks/tasks-store", () => ({
  useTasksStore: jest.fn(),
}));

jest.mock("@/hooks/task-form/utils/save-task", () => ({
  saveTask: jest.fn(),
}));

jest.mock("@/hooks/task-form/utils/resolve-task-notification", () => ({
  resolveTaskNotification: jest.fn(),
}));

jest.mock("@/services/calendar", () => ({
  createTaskEvent: jest.fn(),
  deleteTaskEvent: jest.fn(),
}));

jest.mock("@/services/media", () => ({
  deletePhoto: jest.fn(),
}));

jest.mock("expo-router", () => ({
  router: { back: jest.fn() },
}));

const PHOTOS = ["file:///photo-1.jpg", "file:///photo-2.jpg"];
const REMOVED_PHOTO = PHOTOS[1];

const task: Task = {
  id: "task-1",
  title: "Comprar pan",
  description: "Ir al almacén",
  notification: null,
  photoUris: PHOTOS,
};

const addTask = jest.fn();
const updateTask = jest.fn();

const useTasksStoreMock = useTasksStore as unknown as jest.Mock;
const saveTaskMock = jest.mocked(saveTask);
const resolveTaskNotificationMock = jest.mocked(resolveTaskNotification);
const createTaskEventMock = jest.mocked(createTaskEvent);
const deleteTaskEventMock = jest.mocked(deleteTaskEvent);
const deletePhotoMock = jest.mocked(deletePhoto);
const routerMock = jest.mocked(router);
const alertSpy = jest.spyOn(Alert, "alert").mockImplementation(() => {});

async function renderEditingForm() {
  const utils = await renderHook(() => useTaskForm(task));

  await act(async () => {
    utils.result.current.dispatch({
      type: TASK_FORM_ACTION_TYPES.REMOVE_PHOTO,
      payload: REMOVED_PHOTO,
    });
  });

  return utils;
}

beforeEach(() => {
  jest.clearAllMocks();
  useTasksStoreMock.mockImplementation(
    (
      selector: (state: {
        addTask: typeof addTask;
        updateTask: typeof updateTask;
      }) => unknown,
    ) => selector({ addTask, updateTask }),
  );
  resolveTaskNotificationMock.mockResolvedValue(null);
  saveTaskMock.mockResolvedValue(undefined);
  createTaskEventMock.mockResolvedValue({
    status: "granted",
    value: { eventId: "event-1" },
  });
  deleteTaskEventMock.mockResolvedValue(undefined);
});

describe("useTaskForm photo cleanup", () => {
  test("deletes a removed photo after a successful save", async () => {
    const { result } = await renderEditingForm();

    await act(async () => {
      await result.current.handleSubmit();
    });

    expect(saveTaskMock).toHaveBeenCalledWith(
      expect.objectContaining({
        task,
        fields: expect.objectContaining({ photoUris: [PHOTOS[0]] }),
      }),
    );
    expect(deletePhotoMock).toHaveBeenCalledTimes(1);
    expect(deletePhotoMock).toHaveBeenCalledWith(REMOVED_PHOTO);
    expect(deletePhotoMock.mock.invocationCallOrder[0]).toBeGreaterThan(
      saveTaskMock.mock.invocationCallOrder[0],
    );
  });

  test("keeps the removed photo when the save fails", async () => {
    saveTaskMock.mockRejectedValueOnce(new Error("storage failed"));
    const { result } = await renderEditingForm();

    await act(async () => {
      await result.current.handleSubmit();
    });

    expect(alertSpy).toHaveBeenCalledWith(
      "No se pudo guardar la tarea",
      "Intentá de nuevo.",
    );
    expect(routerMock.back).not.toHaveBeenCalled();
    expect(result.current.state.isSubmitting).toBe(false);
    expect(deletePhotoMock).not.toHaveBeenCalled();
  });
});
