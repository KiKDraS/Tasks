import {
  createTaskFormReducer,
  initialCreateTaskFormState,
} from "@/hooks/create-task/create-task-reducer";
import {
  CREATE_TASK_MESSAGES,
  NOTIFICATION_COPY,
  TYPES,
} from "@/hooks/create-task/constants";
import { formatReminderLabel } from "@/hooks/create-task/utils/reminder";
import { useTasks } from "@/context/tasks/tasks-context";
import { TaskNotification } from "@/context/tasks/types/Task";
import { scheduleTaskReminder } from "@/hooks/create-task/utils/notifications";
import { router } from "expo-router";
import { useCallback, useReducer } from "react";
import { Alert } from "react-native";

export function useCreateTask() {
  const { addTask } = useTasks();
  const [state, dispatch] = useReducer(
    createTaskFormReducer,
    initialCreateTaskFormState,
  );

  const handleCreate = useCallback(async () => {
    const isTitleEmpty = !state.title.trim();
    if (isTitleEmpty) {
      dispatch({
        type: TYPES.SET_TITLE_ERROR,
        payload: CREATE_TASK_MESSAGES.titleRequired,
      });
      return;
    }
    dispatch({ type: TYPES.SET_TITLE_ERROR, payload: null });
    const hasInvalidReminder =
      state.reminderEnabled && Boolean(state.reminderError);
    if (hasInvalidReminder) {
      return;
    }
    dispatch({ type: TYPES.SET_SUBMITTING, payload: true });

    let notification: TaskNotification | null = null;
    if (state.reminderEnabled) {
      const scheduled = await scheduleTaskReminder({
        title: state.title.trim(),
        body: state.description.trim() || NOTIFICATION_COPY.defaultBody,
        reminder: state.reminder,
      });
      if (scheduled) {
        notification = scheduled;
      } else {
        Alert.alert(
          NOTIFICATION_COPY.permissionAlertTitle,
          NOTIFICATION_COPY.permissionAlertMessage,
        );
      }
    }

    await addTask({
      title: state.title.trim(),
      description: state.description.trim(),
      isComplete: false,
      notification,
    });

    dispatch({ type: TYPES.SET_SUBMITTING, payload: false });
    router.back();
  }, [
    addTask,
    state.description,
    state.reminder,
    state.reminderEnabled,
    state.reminderError,
    state.title,
  ]);

  return {
    state,
    dispatch,
    handleCreate,
    reminderLabel: formatReminderLabel(state.reminder),
  };
}
