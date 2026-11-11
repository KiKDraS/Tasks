import type { DeviceActionState } from "@/utils/permission-state";

const PENDING_LABEL = "Verificando permiso...";
const EVENT_ADDED_LABEL = "Evento agregado";
const EVENT_REMOVED_LABEL = "Se quitará al guardar";
const EVENT_WILL_BE_ADDED_LABEL = "Se agregará al calendario al guardar";
const PERMISSION_WILL_BE_REQUESTED_LABEL = "Se pedirá permiso al guardar";
const EVENT_SKIPPED_LABEL = "No se agregará al calendario";

function getEnabledCalendarLabel(state: DeviceActionState): string | null {
  if (state.status === "granted") {
    return EVENT_WILL_BE_ADDED_LABEL;
  }

  if (state.status === "idle") {
    return PERMISSION_WILL_BE_REQUESTED_LABEL;
  }

  if (
    state.status === "denied" ||
    state.status === "blocked" ||
    state.status === "error"
  ) {
    return EVENT_SKIPPED_LABEL;
  }

  return null;
}

export function getCalendarLabel(
  reminderEnabled: boolean,
  eventId: string | null,
  calendarState: DeviceActionState,
): string | null {
  if (calendarState.status === "pending") {
    return PENDING_LABEL;
  }

  if (eventId) {
    return reminderEnabled ? EVENT_ADDED_LABEL : EVENT_REMOVED_LABEL;
  }

  return reminderEnabled ? getEnabledCalendarLabel(calendarState) : null;
}
