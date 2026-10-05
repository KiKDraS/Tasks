import { ThemedText } from "@/components/themed-text";
import { FormButton } from "@/components/ui/form/form-button";
import { TextField } from "@/components/ui/form/text-field";
import { Colors, Rounded, Spacing } from "@/constants/theme";
import { useTasks } from "@/context/tasks/tasks-context";
import { ReminderSelection } from "@/context/tasks/types/Reminder";
import { Task } from "@/context/tasks/types/Task";
import { TASK_FORM_ACTION_TYPES } from "@/hooks/task-form/constants";
import { useTaskForm } from "@/hooks/task-form/use-task-form";
import { router } from "expo-router";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { ReminderOptions } from "./reminder-options";

function useTaskById(taskId?: string) {
  const { tasks, isLoading } = useTasks();
  const task = taskId
    ? tasks.find((item) => item.id === taskId)
    : undefined;
  const notFound = !!taskId && !isLoading && !task;

  return { task, isLoading, notFound };
}

interface TaskFormProps {
  taskId?: string;
}

export function TaskForm({ taskId }: Readonly<TaskFormProps>) {
  const { task, isLoading, notFound } = useTaskById(taskId);

  if (taskId && isLoading) {
    return <ActivityIndicator color={Colors.primary} />;
  }

  if (notFound) {
    return (
      <ThemedText type="body-md" color="error">
        No encontramos la tarea.
      </ThemedText>
    );
  }

  return <TaskFormContent key={taskId ?? "new"} task={task} />;
}

interface ReminderCardProps {
  enabled: boolean;
  reminder: ReminderSelection;
  reminderLabel: string;
  error: string | null;
  disabled: boolean;
  onToggle: () => void;
  onSelect: (reminder: ReminderSelection) => void;
}

function ReminderCard({
  enabled,
  reminder,
  reminderLabel,
  error,
  disabled,
  onToggle,
  onSelect,
}: Readonly<ReminderCardProps>) {
  const showError = enabled && !!error;
  const showHint = enabled && !showError;

  return (
    <View style={styles.reminderCard}>
      <ReminderOptions
        enabled={enabled}
        onToggle={onToggle}
        reminder={reminder}
        onSelect={onSelect}
        disabled={disabled}
      />
      {showError && (
        <ThemedText type="label-sm" color="error">
          {error}
        </ThemedText>
      )}
      {showHint && (
        <ThemedText type="label-sm" color="on-surface-variant">
          La notificación se enviará {reminderLabel.toLowerCase()}
        </ThemedText>
      )}
    </View>
  );
}

interface TaskFormContentProps {
  task?: Task;
}

function TaskFormContent({ task }: Readonly<TaskFormContentProps>) {
  const { state, dispatch, handleSubmit, reminderLabel, isEditing } =
    useTaskForm(task);
  const showReminderError =
    state.reminderEnabled && !!state.reminderError;

  const handleTitleChange = (title: string) => {
    dispatch({ type: TASK_FORM_ACTION_TYPES.SET_TITLE, payload: title });
  };

  const handleDescriptionChange = (description: string) => {
    dispatch({
      type: TASK_FORM_ACTION_TYPES.SET_DESCRIPTION,
      payload: description,
    });
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
        onChangeText={handleTitleChange}
        placeholder="Ej: Comprar leche"
        error={state.titleError}
      />
      <TextField
        label="Descripción"
        value={state.description}
        onChangeText={handleDescriptionChange}
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
          disabled={showReminderError || !!state.titleError}
          style={styles.action}
        >
          {isEditing ? "Actualizar tarea" : "Crear tarea"}
        </FormButton>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  reminderCard: {
    backgroundColor: Colors["surface-container"],
    borderRadius: Rounded.lg,
    padding: Spacing.gutter,
    gap: Spacing["space-md"],
  },
  actions: {
    flexDirection: "row",
    gap: Spacing["space-md"],
  },
  action: {
    flex: 1,
  },
});
