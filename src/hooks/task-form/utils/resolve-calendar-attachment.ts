import { TASK_FORM_ACTION_TYPES } from "@/hooks/task-form/constants";
import type {
  TaskFormAction,
  TaskFormState,
} from "@/hooks/task-form/types/TaskForm";
import { buildCalendarEventInput } from "@/hooks/task-form/utils/calendar-event";
import {
  getFailureState,
  type DeviceFailure,
} from "@/hooks/task-form/utils/device-action-state";
import { shouldCreateCalendarEvent } from "@/hooks/task-form/utils/schedule-state";
import type { TaskFields } from "@/hooks/task-form/utils/task-fields";
import { createTaskEvent } from "@/services/calendar";
import type { Dispatch } from "react";

export interface CalendarAttachmentResult {
  fields: TaskFields;
  failure: DeviceFailure | null;
}

async function createCalendarFields(
  fields: TaskFields,
  state: TaskFormState,
  dispatch: Dispatch<TaskFormAction>,
): Promise<CalendarAttachmentResult> {
  const result = await createTaskEvent(buildCalendarEventInput(fields, state));
  if (result.status !== "granted") {
    dispatch({
      type: TASK_FORM_ACTION_TYPES.SET_CALENDAR_STATE,
      payload: getFailureState(result),
    });
    return { fields: { ...fields, calendarEventId: null }, failure: result };
  }

  dispatch({
    type: TASK_FORM_ACTION_TYPES.SET_CALENDAR_EVENT,
    payload: result.value.eventId,
  });
  return {
    fields: { ...fields, calendarEventId: result.value.eventId },
    failure: null,
  };
}

export async function resolveCalendarAttachment(
  fields: TaskFields,
  state: TaskFormState,
  dispatch: Dispatch<TaskFormAction>,
): Promise<CalendarAttachmentResult> {
  if (!state.reminderEnabled) {
    return { fields: { ...fields, calendarEventId: null }, failure: null };
  }

  if (shouldCreateCalendarEvent(state)) {
    return createCalendarFields(fields, state, dispatch);
  }

  return { fields, failure: null };
}
