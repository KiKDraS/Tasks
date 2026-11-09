import { TASK_FORM_ACTION_TYPES } from "@/hooks/task-form/constants";
import type { TaskFormAction } from "@/hooks/task-form/types/TaskForm";
import { getFailureState } from "@/hooks/task-form/utils/device-action-state";
import { pickContact as pickContactFromDevice } from "@/services/contacts";
import { type Dispatch, useCallback } from "react";

interface UseContactAttachmentOptions {
  dispatch: Dispatch<TaskFormAction>;
}

export interface ContactAttachmentActions {
  pickContact: () => Promise<void>;
  removeContact: () => void;
}

export function useContactAttachment({
  dispatch,
}: Readonly<UseContactAttachmentOptions>): ContactAttachmentActions {
  const pickContact = useCallback(async (): Promise<void> => {
    dispatch({
      type: TASK_FORM_ACTION_TYPES.SET_CONTACT_STATE,
      payload: { status: "pending" },
    });

    const result = await pickContactFromDevice();
    if (result.status === "granted") {
      dispatch({
        type: TASK_FORM_ACTION_TYPES.SET_CONTACT,
        payload: result.value,
      });
      dispatch({
        type: TASK_FORM_ACTION_TYPES.SET_CONTACT_STATE,
        payload: { status: "granted" },
      });
      return;
    }

    dispatch({
      type: TASK_FORM_ACTION_TYPES.SET_CONTACT_STATE,
      payload: getFailureState(result),
    });
  }, [dispatch]);

  const removeContact = useCallback(() => {
    dispatch({ type: TASK_FORM_ACTION_TYPES.SET_CONTACT, payload: null });
    dispatch({
      type: TASK_FORM_ACTION_TYPES.SET_CONTACT_STATE,
      payload: { status: "idle" },
    });
  }, [dispatch]);

  return { pickContact, removeContact };
}
