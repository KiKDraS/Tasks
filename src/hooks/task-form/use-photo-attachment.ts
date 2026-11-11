import { TASK_FORM_ACTION_TYPES } from "@/hooks/task-form/constants";
import type { TaskFormAction } from "@/hooks/task-form/types/TaskForm";
import { getFailureState } from "@/hooks/task-form/utils/device-action-state";
import {
  pickPhotos as pickPhotosFromLibrary,
  takePhoto as capturePhoto,
} from "@/services/media";
import type { DeviceResult } from "@/services/permissions";
import { type Dispatch, useCallback, useRef } from "react";

const PHOTO_SOURCES = {
  CAMERA: "camera",
  LIBRARY: "library",
} as const;

type PhotoSource = (typeof PHOTO_SOURCES)[keyof typeof PHOTO_SOURCES];

type PhotoRequester = () => Promise<DeviceResult<string[]>>;

interface UsePhotoAttachmentOptions {
  dispatch: Dispatch<TaskFormAction>;
}

export interface PhotoAttachmentActions {
  takePhoto: () => Promise<void>;
  pickPhotos: () => Promise<void>;
  removePhoto: (uri: string) => void;
  retryPhoto: () => Promise<void>;
}

async function requestCameraPhoto(): Promise<DeviceResult<string[]>> {
  const result = await capturePhoto();
  if (result.status !== "granted") {
    return result;
  }

  return { status: "granted", value: [result.value.uri] };
}

async function requestLibraryPhotos(): Promise<DeviceResult<string[]>> {
  const result = await pickPhotosFromLibrary();
  if (result.status !== "granted") {
    return result;
  }

  return { status: "granted", value: result.value.uris };
}

export function usePhotoAttachment({
  dispatch,
}: Readonly<UsePhotoAttachmentOptions>): PhotoAttachmentActions {
  const lastPhotoSource = useRef<PhotoSource>(PHOTO_SOURCES.CAMERA);

  const applyPhotoResult = useCallback(
    (result: DeviceResult<string[]>) => {
      if (result.status === "granted") {
        dispatch({
          type: TASK_FORM_ACTION_TYPES.ADD_PHOTOS,
          payload: result.value,
        });
        return;
      }

      dispatch({
        type: TASK_FORM_ACTION_TYPES.SET_PHOTO_STATE,
        payload: getFailureState(result),
      });
    },
    [dispatch],
  );

  const runPhotoAction = useCallback(
    async (requestPhotos: PhotoRequester, source: PhotoSource) => {
      lastPhotoSource.current = source;
      dispatch({
        type: TASK_FORM_ACTION_TYPES.SET_PHOTO_STATE,
        payload: { status: "pending" },
      });

      applyPhotoResult(await requestPhotos());
    },
    [applyPhotoResult, dispatch],
  );

  const takePhoto = useCallback(async (): Promise<void> => {
    await runPhotoAction(requestCameraPhoto, PHOTO_SOURCES.CAMERA);
  }, [runPhotoAction]);

  const pickPhotos = useCallback(async (): Promise<void> => {
    await runPhotoAction(requestLibraryPhotos, PHOTO_SOURCES.LIBRARY);
  }, [runPhotoAction]);

  const retryPhoto = useCallback(async (): Promise<void> => {
    const source = lastPhotoSource.current;
    const requestPhotos =
      source === PHOTO_SOURCES.CAMERA
        ? requestCameraPhoto
        : requestLibraryPhotos;

    await runPhotoAction(requestPhotos, source);
  }, [runPhotoAction]);

  const removePhoto = useCallback(
    (uri: string) => {
      dispatch({ type: TASK_FORM_ACTION_TYPES.REMOVE_PHOTO, payload: uri });
    },
    [dispatch],
  );

  return { takePhoto, pickPhotos, removePhoto, retryPhoto };
}
