import { FormButton } from "@/components/ui/form/form-button";
import { TextField } from "@/components/ui/form/text-field";
import { Spacing } from "@/constants/theme";
import { ReminderSelection } from "@/context/tasks/types/Reminder";
import { Task } from "@/context/tasks/types/Task";
import { useCalendarAttachment } from "@/hooks/task-form/use-calendar-attachment";
import { TASK_FORM_ACTION_TYPES } from "@/hooks/task-form/constants";
import { useTaskForm } from "@/hooks/task-form/use-task-form";
import { shouldShowScheduleOptions } from "@/hooks/task-form/utils/schedule-state";
import { openAppSettings } from "@/services/permissions";
import { router } from "expo-router";
import { useCallback, useRef } from "react";
import { StyleSheet, View } from "react-native";
import { ScheduleCard } from "./schedule-card";
import { TaskAttachmentCards } from "./task-attachment-cards";

interface TaskFormContentProps {
  task?: Task;
}

export function TaskFormContent({ task }: Readonly<TaskFormContentProps>) {
  const { state, dispatch, handleSubmit, reminderLabel, isEditing } =
    useTaskForm(task);
  const calendar = useCalendarAttachment({
    dispatch,
    enabled: state.calendarEnabled,
  });

  const showReminderError =
    shouldShowScheduleOptions(state) && !!state.reminderError;
  const hasPendingAttachment =
    state.photoState.status === "pending" ||
    state.locationState.status === "pending" ||
    state.contactState.status === "pending" ||
    state.calendarState.status === "pending";
  const isSubmitDisabled =
    showReminderError || !!state.titleError || hasPendingAttachment;
  const submitLock = useRef(false);

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

  const handleSubmitGuarded = async () => {
    if (isSubmitDisabled || state.isSubmitting || submitLock.current) {
      return;
    }

    submitLock.current = true;
    try {
      await handleSubmit();
    } finally {
      submitLock.current = false;
    }
  };

  const handleOpenSettings = useCallback(() => {
    void openAppSettings();
  }, []);

  const handleRetryCalendar = state.calendarEnabled
    ? handleSubmitGuarded
    : calendar.retryCalendar;

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

      <TaskAttachmentCards
        state={state}
        dispatch={dispatch}
        disabled={state.isSubmitting}
      />

      <ScheduleCard
        reminderEnabled={state.reminderEnabled}
        calendarEnabled={state.calendarEnabled}
        reminder={state.reminder}
        reminderLabel={reminderLabel}
        error={state.reminderError}
        disabled={!!task?.isComplete || state.isSubmitting}
        calendarEventId={state.calendarEventId}
        calendarState={state.calendarState}
        onToggleReminder={handleReminderToggle}
        onToggleCalendar={calendar.toggleCalendar}
        onSelect={handleReminderSelect}
        onRetryCalendar={handleRetryCalendar}
        onOpenSettings={handleOpenSettings}
        retryDisabled={isSubmitDisabled || state.isSubmitting}
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
          onPress={handleSubmitGuarded}
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
