import {
  createTaskFormReducer,
  initialCreateTaskFormState,
} from "@/hooks/create-task/create-task-reducer";
import { TYPES } from "@/hooks/create-task/constants";
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
    if (!state.title.trim()) {
      dispatch({
        type: TYPES.SET_TITLE_ERROR,
        payload: "El título es obligatorio",
      });
      return;
    }
    dispatch({ type: TYPES.SET_TITLE_ERROR, payload: null });
    if (state.reminderEnabled && state.reminderError) {
      return;
    }
    dispatch({ type: TYPES.SET_SUBMITTING, payload: true });

    let notification: TaskNotification | null = null;
    if (state.reminderEnabled) {
      const scheduled = await scheduleTaskReminder({
        title: state.title.trim(),
        body: state.description.trim() || "Recordatorio de tu tarea",
        reminder: state.reminder,
      });
      if (scheduled) {
        notification = scheduled;
      } else {
        Alert.alert(
          "Permiso denegado",
          "No se pudo programar la notificación. Activá los permisos de notificaciones en los ajustes.",
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