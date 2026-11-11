import { TASK_FORM_ACTION_TYPES } from "@/hooks/task-form/constants";
import type { TaskFormAction } from "@/hooks/task-form/types/TaskForm";
import { getFailureState } from "@/hooks/task-form/utils/device-action-state";
import { getCurrentLocation } from "@/services/location";
import { type Dispatch, useCallback } from "react";

interface UseLocationAttachmentOptions {
  dispatch: Dispatch<TaskFormAction>;
}

export interface LocationAttachmentActions {
  getLocation: () => Promise<void>;
  removeLocation: () => void;
}

export function useLocationAttachment({
  dispatch,
}: Readonly<UseLocationAttachmentOptions>): LocationAttachmentActions {
  const getLocation = useCallback(async (): Promise<void> => {
    dispatch({
      type: TASK_FORM_ACTION_TYPES.SET_LOCATION_STATE,
      payload: { status: "pending" },
    });

    const result = await getCurrentLocation();
    if (result.status === "granted") {
      dispatch({
        type: TASK_FORM_ACTION_TYPES.SET_LOCATION,
        payload: result.value,
      });
      dispatch({
        type: TASK_FORM_ACTION_TYPES.SET_LOCATION_STATE,
        payload: { status: "granted" },
      });
      return;
    }

    dispatch({
      type: TASK_FORM_ACTION_TYPES.SET_LOCATION_STATE,
      payload: getFailureState(result),
    });
  }, [dispatch]);

  const removeLocation = useCallback(() => {
    dispatch({ type: TASK_FORM_ACTION_TYPES.SET_LOCATION, payload: null });
    dispatch({
      type: TASK_FORM_ACTION_TYPES.SET_LOCATION_STATE,
      payload: { status: "idle" },
    });
  }, [dispatch]);

  return { getLocation, removeLocation };
}
