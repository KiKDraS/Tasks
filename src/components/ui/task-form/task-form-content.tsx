import { FormButton } from "@/components/ui/form/form-button";
import { TextField } from "@/components/ui/form/text-field";
import { Spacing } from "@/constants/theme";
import { ReminderSelection } from "@/context/tasks/types/Reminder";
import { Task } from "@/context/tasks/types/Task";
import { TASK_FORM_ACTION_TYPES } from "@/hooks/task-form/constants";
import { useTaskForm } from "@/hooks/task-form/use-task-form";
import { router } from "expo-router";
import { StyleSheet, View } from "react-native";
import { ReminderCard } from "./reminder-card";

interface TaskFormContentProps {
  task?: Task;
}

export function TaskFormContent({ task }: Readonly<TaskFormContentProps>) {
  const { state, dispatch, handleSubmit, reminderLabel, isEditing } =
    useTaskForm(task);

  const showReminderError = state.reminderEnabled && !!state.reminderError;
  const isSubmitDisabled = showReminderError || !!state.titleError;

  const setField = (field: "title" | "description", value: string) => {
    dispatch(
      field === "title"
        ? { type: TASK_FORM_ACTION_TYPES.SET_TITLE, payload: value }
        : { type: TASK_FORM_ACTION_TYPES.SET_DESCRIPTION, payload: value },
    );
  };

  const handleReminderToggle = () => {
    dispatch({ type: TASK_FORM_ACTION_TYPES.TOGGLE_REMINDER });
  };

  const handleReminderSelect = (reminder: ReminderSelection) => {
    dispatch({ type: TASK_FORM_ACTION_TYPES.SET_REMINDER, payload: reminder });
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <>
      <TextField
        label="Título"
        value={state.title}
        onChangeText={(value) => setField("title", value)}
        placeholder="Ej: Comprar leche"
        error={state.titleError}
      />
      <TextField
        label="Descripción"
        value={state.description}
        onChangeText={(value) => setField("description", value)}
        placeholder="Detalles de la tarea"
        multiline
      />

      <ReminderCard
        enabled={state.reminderEnabled}
        reminder={state.reminder}
        reminderLabel={reminderLabel}
        error={state.reminderError}
        disabled={!!task?.isComplete}
        onToggle={handleReminderToggle}
        onSelect={handleReminderSelect}
      />

      <View style={styles.actions}>
        <FormButton
          variant="surface"
          onPress={handleCancel}
          disabled={state.isSubmitting}
          style={styles.action}
        >
          Cancelar
        </FormButton>
        <FormButton
          onPress={handleSubmit}
          loading={state.isSubmitting}
          disabled={isSubmitDisabled}
          style={styles.action}
        >
          {isEditing ? "Actualizar tarea" : "Crear tarea"}
        </FormButton>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  actions: {
    flexDirection: "row",
    gap: Spacing["space-md"],
  },
  action: {
    flex: 1,
  },
});
