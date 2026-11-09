import { Task, TaskNotification } from "@/context/tasks/types/Task";
import { TASK_FORM_ACTION_TYPES } from "@/hooks/task-form/constants";
import {
  initialTaskFormState,
  taskFormReducer,
  taskFormStateFromTask,
} from "@/hooks/task-form/task-form-reducer";
import type { TaskFormState } from "@/hooks/task-form/types/TaskForm";
import type { DeviceFailure } from "@/hooks/task-form/utils/device-action-state";
import { getPhotoToDelete } from "@/hooks/task-form/utils/photo-cleanup";
import { formatReminderLabel } from "@/hooks/task-form/utils/reminder";
import { resolveCalendarAttachment } from "@/hooks/task-form/utils/resolve-calendar-attachment";
import { resolveTaskNotification } from "@/hooks/task-form/utils/resolve-task-notification";
import { saveTask } from "@/hooks/task-form/utils/save-task";
import {
  buildTaskFields,
  type TaskFields,
} from "@/hooks/task-form/utils/task-fields";
import { validateTaskForm } from "@/hooks/task-form/utils/validate-task-form";
import { deleteTaskEvent } from "@/services/calendar";
import { DEVICE_MESSAGES } from "@/services/constants/device-messages";
import { deletePhoto } from "@/services/media";
import { useTasksStore } from "@/stores/tasks/tasks-store";
import { router } from "expo-router";
import { useCallback, useReducer } from "react";
import { Alert } from "react-native";

async function cleanupReplacedAttachments(
  task: Task | undefined,
  state: TaskFormState,
): Promise<void> {
  const photoToDelete = getPhotoToDelete(task, state.photoUri);
  if (photoToDelete) {
    deletePhoto(photoToDelete);
  }

  const calendarEventToDelete = state.reminderEnabled
    ? null
    : task?.calendarEventId;
  if (calendarEventToDelete) {
    await deleteTaskEvent(calendarEventToDelete);
  }
}

function getCalendarFailureMessage(
  failure: DeviceFailure,
  notification: TaskNotification | null,
): string {
  if (failure.status === "error") {
    return failure.message;
  }

  if (notification) {
    return DEVICE_MESSAGES.calendarSkippedWithNotification;
  }

  return DEVICE_MESSAGES.calendarSkipped;
}

function showCalendarFailureAlert(
  failure: DeviceFailure,
  notification: TaskNotification | null,
): void {
  Alert.alert(
    "No se agregó al calendario",
    getCalendarFailureMessage(failure, notification),
    [{ text: "Entendido" }],
  );
}

interface PersistTaskOptions {
  task?: Task;
  state: TaskFormState;
  fields: TaskFields;
  addTask: (task: Task) => Promise<void>;
  updateTask: (updatedTask: Task) => Promise<void>;
}

async function persistTask(
  options: PersistTaskOptions,
): Promise<TaskNotification | null> {
  const { task, state, fields, addTask, updateTask } = options;
  const notification = await resolveTaskNotification({
    reminderEnabled: state.reminderEnabled && !task?.isComplete,
    reminder: state.reminder,
    title: fields.title,
    description: fields.description,
    previousNotification: task?.notification ?? null,
  });
  await saveTask({ task, fields, notification, addTask, updateTask });
  await cleanupReplacedAttachments(task, state);
  return notification;
}

export function useTaskForm(task?: Task) {
  const addTask = useTasksStore((state) => state.addTask);
  const updateTask = useTasksStore((state) => state.updateTask);
  const [state, dispatch] = useReducer(taskFormReducer, task, (initialTask) =>
    initialTask ? taskFormStateFromTask(initialTask) : initialTaskFormState,
  );
  const isEditing = !!task;

  const handleSubmit = useCallback(async () => {
    const { titleError, isValid } = validateTaskForm(state);
    dispatch({
      type: TASK_FORM_ACTION_TYPES.SET_TITLE_ERROR,
      payload: titleError,
    });
    if (!isValid) {
      return;
    }

    dispatch({ type: TASK_FORM_ACTION_TYPES.SET_SUBMITTING, payload: true });

    const { fields, failure } = await resolveCalendarAttachment(
      buildTaskFields(state),
      state,
      dispatch,
    );
    const notification = await persistTask({
      task,
      state,
      fields,
      addTask,
      updateTask,
    });

    dispatch({ type: TASK_FORM_ACTION_TYPES.SET_SUBMITTING, payload: false });
    router.back();

    if (failure) {
      showCalendarFailureAlert(failure, notification);
    }
  }, [addTask, task, updateTask, state]);

  return {
    state,
    dispatch,
    handleSubmit,
    isEditing,
    reminderLabel: formatReminderLabel(state.reminder),
  };
}
