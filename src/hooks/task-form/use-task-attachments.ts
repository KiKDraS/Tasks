import type { TaskFormAction } from "@/hooks/task-form/types/TaskForm";
import {
  useLocationAttachment,
  type LocationAttachmentActions,
} from "@/hooks/task-form/use-location-attachment";
import {
  usePhotoAttachment,
  type PhotoAttachmentActions,
} from "@/hooks/task-form/use-photo-attachment";
import { openAppSettings } from "@/services/permissions";
import { type Dispatch, useCallback } from "react";

interface UseTaskAttachmentsOptions {
  dispatch: Dispatch<TaskFormAction>;
}

export interface TaskAttachments
  extends PhotoAttachmentActions,
    LocationAttachmentActions {
  openSettings: () => void;
}

export function useTaskAttachments({
  dispatch,
}: Readonly<UseTaskAttachmentsOptions>): TaskAttachments {
  const photo = usePhotoAttachment({ dispatch });
  const location = useLocationAttachment({ dispatch });

  const openSettings = useCallback(() => {
    void openAppSettings();
  }, []);

  return { ...photo, ...location, openSettings };
}
