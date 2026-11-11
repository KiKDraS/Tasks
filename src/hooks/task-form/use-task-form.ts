import { Task } from "@/context/tasks/types/Task";
import {
  TASK_FORM_ACTION_TYPES,
  TASK_FORM_MESSAGES,
} from "@/hooks/task-form/constants";
import {
  initialTaskFormState,
  taskFormReducer,
  taskFormStateFromTask,
} from "@/hooks/task-form/task-form-reducer";
import {
  persistTask,
  showCalendarFailureAlert,
} from "@/hooks/task-form/utils/persist-task";
import { formatReminderLabel } from "@/hooks/task-form/utils/reminder";
import { resolveCalendarAttachment } from "@/hooks/task-form/utils/resolve-calendar-attachment";
import { buildTaskFields } from "@/hooks/task-form/utils/task-fields";
import { validateTaskForm } from "@/hooks/task-form/utils/validate-task-form";
import { useTasksStore } from "@/stores/tasks/tasks-store";
import { closeTaskForm } from "@/utils/task-form-navigation";
import { useCallback, useReducer } from "react";
import { Alert } from "react-native";

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

    try {
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
      closeTaskForm();

      if (failure) {
        showCalendarFailureAlert(failure, notification);
      }
    } catch {
      dispatch({ type: TASK_FORM_ACTION_TYPES.SET_SUBMITTING, payload: false });
      Alert.alert(
        TASK_FORM_MESSAGES.saveFailureTitle,
        TASK_FORM_MESSAGES.saveFailureMessage,
      );
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
