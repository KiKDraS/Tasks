import { useTasks } from "@/context/tasks/tasks-context";
import { Task } from "@/context/tasks/types/Task";
import { TASK_FORM_ACTION_TYPES } from "@/hooks/task-form/constants";
import {
  initialTaskFormState,
  taskFormReducer,
  taskFormStateFromTask,
} from "@/hooks/task-form/task-form-reducer";
import { formatReminderLabel } from "@/hooks/task-form/utils/reminder";
import { resolveTaskNotification } from "@/hooks/task-form/utils/resolve-task-notification";
import { saveTask } from "@/hooks/task-form/utils/save-task";
import { buildTaskFields } from "@/hooks/task-form/utils/task-fields";
import { validateTaskForm } from "@/hooks/task-form/utils/validate-task-form";
import { router } from "expo-router";
import { useCallback, useReducer } from "react";

export function useTaskForm(task?: Task) {
  const { addTask, updateTask } = useTasks();
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

    const fields = buildTaskFields(state);
    const notification = await resolveTaskNotification({
      reminderEnabled: state.reminderEnabled,
      reminder: state.reminder,
      title: fields.title,
      description: fields.description,
      previousNotification: task?.notification ?? null,
    });
    await saveTask({ task, fields, notification, addTask, updateTask });

    dispatch({ type: TASK_FORM_ACTION_TYPES.SET_SUBMITTING, payload: false });
    router.back();
  }, [addTask, task, updateTask, state]);

  return {
    state,
    dispatch,
    handleSubmit,
    isEditing,
    reminderLabel: formatReminderLabel(state.reminder),
  };
}
