import { TASK_FORM_ACTION_TYPES } from "@/hooks/task-form/constants";
import type {
  TaskFormAction,
  TaskFormState,
} from "@/hooks/task-form/types/TaskForm";
import { buildCalendarEventInput } from "@/hooks/task-form/utils/calendar-event";
import { getFailureState } from "@/hooks/task-form/utils/device-action-state";
import { shouldCreateCalendarEvent } from "@/hooks/task-form/utils/schedule-state";
import type { TaskFields } from "@/hooks/task-form/utils/task-fields";
import { createTaskEvent } from "@/services/calendar";
import type { Dispatch } from "react";

export type CalendarFieldsResult =
  | { status: "ready"; fields: TaskFields }
  | { status: "failed" };

async function createCalendarFields(
  fields: TaskFields,
  state: TaskFormState,
  dispatch: Dispatch<TaskFormAction>,
): Promise<CalendarFieldsResult> {
  const result = await createTaskEvent(buildCalendarEventInput(fields, state));
  if (result.status !== "granted") {
    dispatch({
      type: TASK_FORM_ACTION_TYPES.SET_CALENDAR_STATE,
      payload: getFailureState(result),
    });
    return { status: "failed" };
  }

  dispatch({
    type: TASK_FORM_ACTION_TYPES.SET_CALENDAR_EVENT,
    payload: result.value.eventId,
  });
  return {
    status: "ready",
    fields: { ...fields, calendarEventId: result.value.eventId },
  };
}

export async function resolveCalendarAttachment(
  fields: TaskFields,
  state: TaskFormState,
  dispatch: Dispatch<TaskFormAction>,
): Promise<CalendarFieldsResult> {
  if (shouldCreateCalendarEvent(state)) {
    return createCalendarFields(fields, state, dispatch);
  }

  if (state.calendarEnabled) {
    return { status: "ready", fields };
  }

  return { status: "ready", fields: { ...fields, calendarEventId: null } };
}
