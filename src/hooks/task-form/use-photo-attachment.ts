import { TASK_FORM_ACTION_TYPES } from "@/hooks/task-form/constants";
import type { TaskFormAction } from "@/hooks/task-form/types/TaskForm";
import { getFailureState } from "@/hooks/task-form/utils/device-action-state";
import {
  pickPhoto as pickPhotoFromLibrary,
  takePhoto as capturePhoto,
} from "@/services/media";
import type { DeviceResult } from "@/services/permissions";
import { type Dispatch, useCallback, useRef } from "react";

const PHOTO_SOURCES = {
  CAMERA: "camera",
  LIBRARY: "library",
} as const;

type PhotoSource = (typeof PHOTO_SOURCES)[keyof typeof PHOTO_SOURCES];

interface UsePhotoAttachmentOptions {
  dispatch: Dispatch<TaskFormAction>;
}

export interface PhotoAttachmentActions {
  takePhoto: () => Promise<void>;
  pickPhoto: () => Promise<void>;
  removePhoto: () => void;
  retryPhoto: () => Promise<void>;
}

export function usePhotoAttachment({
  dispatch,
}: Readonly<UsePhotoAttachmentOptions>): PhotoAttachmentActions {
  const lastPhotoSource = useRef<PhotoSource>(PHOTO_SOURCES.CAMERA);

  const commitPhoto = useCallback(
    (uri: string) => {
      dispatch({ type: TASK_FORM_ACTION_TYPES.SET_PHOTO, payload: uri });
      dispatch({
        type: TASK_FORM_ACTION_TYPES.SET_PHOTO_STATE,
        payload: { status: "granted" },
      });
    },
    [dispatch],
  );

  const applyPhotoResult = useCallback(
    (result: DeviceResult<{ uri: string }>) => {
      if (result.status === "granted") {
        commitPhoto(result.value.uri);
        return;
      }

      dispatch({
        type: TASK_FORM_ACTION_TYPES.SET_PHOTO_STATE,
        payload: getFailureState(result),
      });
    },
    [commitPhoto, dispatch],
  );

  const runPhotoAction = useCallback(
    async (requestPhoto: () => Promise<DeviceResult<{ uri: string }>>) => {
      dispatch({
        type: TASK_FORM_ACTION_TYPES.SET_PHOTO_STATE,
        payload: { status: "pending" },
      });
      applyPhotoResult(await requestPhoto());
    },
    [applyPhotoResult, dispatch],
  );

  const takePhoto = useCallback(async (): Promise<void> => {
    lastPhotoSource.current = PHOTO_SOURCES.CAMERA;
    await runPhotoAction(capturePhoto);
  }, [runPhotoAction]);

  const pickPhoto = useCallback(async (): Promise<void> => {
    lastPhotoSource.current = PHOTO_SOURCES.LIBRARY;
    await runPhotoAction(pickPhotoFromLibrary);
  }, [runPhotoAction]);

  const retryPhoto = useCallback(async (): Promise<void> => {
    const requestPhoto =
      lastPhotoSource.current === PHOTO_SOURCES.CAMERA
        ? capturePhoto
        : pickPhotoFromLibrary;
    await runPhotoAction(requestPhoto);
  }, [runPhotoAction]);

  const removePhoto = useCallback(() => {
    dispatch({ type: TASK_FORM_ACTION_TYPES.SET_PHOTO, payload: null });
    dispatch({
      type: TASK_FORM_ACTION_TYPES.SET_PHOTO_STATE,
      payload: { status: "idle" },
    });
  }, [dispatch]);

  return { takePhoto, pickPhoto, removePhoto, retryPhoto };
}
