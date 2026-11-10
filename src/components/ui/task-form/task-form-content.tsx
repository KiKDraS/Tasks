import { TextField } from "@/components/ui/form/text-field";
import { ReminderSelection } from "@/context/tasks/types/Reminder";
import { Task } from "@/context/tasks/types/Task";
import { useSchedulePermission } from "@/hooks/task-form/use-schedule-permission";
import { TASK_FORM_ACTION_TYPES } from "@/hooks/task-form/constants";
import { useTaskForm } from "@/hooks/task-form/use-task-form";
import { useShareTask } from "@/hooks/tasks/use-share-task";
import { openAppSettings } from "@/services/permissions";
import { closeTaskForm } from "@/utils/task-form-navigation";
import { useCallback, useRef } from "react";
import { ScheduleCard } from "./schedule-card";
import { TaskAttachmentCards } from "./task-attachment-cards";
import { TaskFormActions } from "./task-form-actions";

interface TaskFormContentProps {
  task?: Task;
}

export function TaskFormContent({ task }: Readonly<TaskFormContentProps>) {
  const { state, dispatch, handleSubmit, reminderLabel, isEditing } =
    useTaskForm(task);
  const { requestPermission } = useSchedulePermission({ dispatch });
  const { openShareMenu } = useShareTask(task);

  const showReminderError = state.reminderEnabled && !!state.reminderError;
  const eventWillBeRemoved =
    state.reminderToggledOff &&
    !!state.calendarEventId &&
    !state.reminderEnabled;
  const hasPendingAttachment =
    state.photoState.status === "pending" ||
    state.locationState.status === "pending" ||
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
    const isEnabling = !state.reminderEnabled;
    dispatch({ type: TASK_FORM_ACTION_TYPES.TOGGLE_REMINDER });

    if (isEnabling) {
      void requestPermission();
      return;
    }

    dispatch({
      type: TASK_FORM_ACTION_TYPES.SET_CALENDAR_STATE,
      payload: { status: "idle" },
    });
  };

  const handleReminderSelect = (reminder: ReminderSelection) => {
    dispatch({ type: TASK_FORM_ACTION_TYPES.SET_REMINDER, payload: reminder });
  };

  const handleCancel = () => {
    closeTaskForm();
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
        reminder={state.reminder}
        reminderLabel={reminderLabel}
        error={state.reminderError}
        disabled={!!task?.isComplete || state.isSubmitting}
        isComplete={!!task?.isComplete}
        calendarEventId={state.calendarEventId}
        calendarState={state.calendarState}
        eventWillBeRemoved={eventWillBeRemoved}
        onToggleReminder={handleReminderToggle}
        onSelect={handleReminderSelect}
        onRetryCalendar={requestPermission}
        onOpenSettings={handleOpenSettings}
        retryDisabled={state.isSubmitting}
      />

      <TaskFormActions
        isEditing={isEditing}
        isSubmitting={state.isSubmitting}
        submitDisabled={isSubmitDisabled}
        onCancel={handleCancel}
        onSubmit={handleSubmitGuarded}
        onShare={isEditing ? openShareMenu : undefined}
      />
    </>
  );
}
