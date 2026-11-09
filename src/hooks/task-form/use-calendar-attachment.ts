import { TASK_FORM_ACTION_TYPES } from "@/hooks/task-form/constants";
import type { TaskFormAction } from "@/hooks/task-form/types/TaskForm";
import { getFailureState } from "@/hooks/task-form/utils/device-action-state";
import { requestCalendarPermission } from "@/services/calendar";
import { type Dispatch, useCallback } from "react";

interface UseCalendarAttachmentOptions {
  dispatch: Dispatch<TaskFormAction>;
  enabled: boolean;
}

export interface CalendarAttachmentActions {
  toggleCalendar: () => Promise<void>;
  retryCalendar: () => Promise<void>;
}

export function useCalendarAttachment({
  dispatch,
  enabled,
}: Readonly<UseCalendarAttachmentOptions>): CalendarAttachmentActions {
  const enableCalendar = useCallback(async (): Promise<void> => {
    dispatch({
      type: TASK_FORM_ACTION_TYPES.SET_CALENDAR_STATE,
      payload: { status: "pending" },
    });

    const result = await requestCalendarPermission();
    if (result.status === "granted") {
      dispatch({
        type: TASK_FORM_ACTION_TYPES.SET_CALENDAR_ENABLED,
        payload: true,
      });
      dispatch({
        type: TASK_FORM_ACTION_TYPES.SET_CALENDAR_STATE,
        payload: { status: "granted" },
      });
      return;
    }

    dispatch({
      type: TASK_FORM_ACTION_TYPES.SET_CALENDAR_ENABLED,
      payload: false,
    });
    dispatch({
      type: TASK_FORM_ACTION_TYPES.SET_CALENDAR_STATE,
      payload: getFailureState(result),
    });
  }, [dispatch]);

  const toggleCalendar = useCallback(async (): Promise<void> => {
    if (enabled) {
      dispatch({
        type: TASK_FORM_ACTION_TYPES.SET_CALENDAR_ENABLED,
        payload: false,
      });
      dispatch({
        type: TASK_FORM_ACTION_TYPES.SET_CALENDAR_STATE,
        payload: { status: "idle" },
      });
      return;
    }

    await enableCalendar();
  }, [dispatch, enableCalendar, enabled]);

  return { toggleCalendar, retryCalendar: enableCalendar };
}
