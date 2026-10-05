import { NOTIFICATION_COPY } from "@/context/tasks/constants";
import { useTasks } from "@/context/tasks/tasks-context";
import { ReminderSelection } from "@/context/tasks/types/Reminder";
import { Task, TaskNotification } from "@/context/tasks/types/Task";
import {
  cancelTaskReminder,
  scheduleTaskReminder,
} from "@/context/tasks/utils/notifications";
import {
  TASK_FORM_ACTION_TYPES,
  TASK_FORM_MESSAGES,
} from "@/hooks/task-form/constants";
import {
  initialTaskFormState,
  taskFormReducer,
  taskFormStateFromTask,
} from "@/hooks/task-form/task-form-reducer";
import { TaskFormState } from "@/hooks/task-form/types/TaskForm";
import { formatReminderLabel } from "@/hooks/task-form/utils/reminder";
import { router } from "expo-router";
import { useCallback, useReducer } from "react";
import { Alert } from "react-native";

type TaskFields = {
  title: string;
  description: string;
};

const getTitleError = (title: string): string | null =>
  title.trim() ? null : TASK_FORM_MESSAGES.titleRequired;

const hasInvalidReminder = (state: TaskFormState) =>
  state.reminderEnabled && !!state.reminderError;

const buildTaskFields = (state: TaskFormState): TaskFields => ({
  title: state.title.trim(),
  description: state.description.trim(),
});

async function resolveTaskNotification(options: {
  reminderEnabled: boolean;
  reminder: ReminderSelection;
  title: string;
  body: string;
  previousNotification: TaskNotification | null;
}): Promise<TaskNotification | null> {
  const { reminderEnabled, reminder, title, body, previousNotification } =
    options;

  if (previousNotification) {
    await cancelTaskReminder(previousNotification.id);
  }

  if (!reminderEnabled) {
    return null;
  }

  const scheduled = await scheduleTaskReminder({ title, body, reminder });
  if (scheduled) {
    return scheduled;
  }

  Alert.alert(
    NOTIFICATION_COPY.permissionAlertTitle,
    NOTIFICATION_COPY.permissionAlertMessage,
  );
  return null;
}

export function useTaskForm(task?: Task) {
  const { addTask, updateTask } = useTasks();
  const [state, dispatch] = useReducer(taskFormReducer, task, (initialTask) =>
    initialTask ? taskFormStateFromTask(initialTask) : initialTaskFormState,
  );
  const isEditing = !!task;

  const validateForm = useCallback((): boolean => {
    const titleError = getTitleError(state.title);
    dispatch({
      type: TASK_FORM_ACTION_TYPES.SET_TITLE_ERROR,
      payload: titleError,
    });

    return !titleError && !hasInvalidReminder(state);
  }, [state]);

  const saveTask = useCallback(
    async (fields: TaskFields, notification: TaskNotification | null) => {
      if (task) {
        await updateTask({ ...task, ...fields, notification });
        return;
      }

      await addTask({ ...fields, isComplete: false, notification });
    },
    [addTask, task, updateTask],
  );

  const handleSubmit = useCallback(async () => {
    const isValid = validateForm();
    if (!isValid) {
      return;
    }

    dispatch({ type: TASK_FORM_ACTION_TYPES.SET_SUBMITTING, payload: true });

    const fields = buildTaskFields(state);
    const notification = await resolveTaskNotification({
      reminderEnabled: state.reminderEnabled,
      reminder: state.reminder,
      title: fields.title,
      body: fields.description || NOTIFICATION_COPY.defaultBody,
      previousNotification: task?.notification ?? null,
    });
    await saveTask(fields, notification);

    dispatch({ type: TASK_FORM_ACTION_TYPES.SET_SUBMITTING, payload: false });
    router.back();
  }, [saveTask, state, task, validateForm]);

  return {
    state,
    dispatch,
    handleSubmit,
    isEditing,
    reminderLabel: formatReminderLabel(state.reminder),
  };
}
