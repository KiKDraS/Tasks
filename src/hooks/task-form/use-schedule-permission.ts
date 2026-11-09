import { TASK_FORM_ACTION_TYPES } from "@/hooks/task-form/constants";
import type { TaskFormAction } from "@/hooks/task-form/types/TaskForm";
import { getFailureState } from "@/hooks/task-form/utils/device-action-state";
import { requestCalendarPermission } from "@/services/calendar";
import { type Dispatch, useCallback } from "react";

interface UseSchedulePermissionOptions {
  dispatch: Dispatch<TaskFormAction>;
}

export interface SchedulePermissionActions {
  requestPermission: () => Promise<void>;
}

export function useSchedulePermission({
  dispatch,
}: Readonly<UseSchedulePermissionOptions>): SchedulePermissionActions {
  const requestPermission = useCallback(async (): Promise<void> => {
    dispatch({
      type: TASK_FORM_ACTION_TYPES.SET_CALENDAR_STATE,
      payload: { status: "pending" },
    });

    const result = await requestCalendarPermission();
    if (result.status === "granted") {
      dispatch({
        type: TASK_FORM_ACTION_TYPES.SET_CALENDAR_STATE,
        payload: { status: "granted" },
      });
      return;
    }

    dispatch({
      type: TASK_FORM_ACTION_TYPES.SET_CALENDAR_STATE,
      payload: getFailureState(result),
    });
  }, [dispatch]);

  return { requestPermission };
}
