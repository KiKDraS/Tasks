import { useTaskAttachments } from "@/hooks/task-form/use-task-attachments";
import type {
  TaskFormAction,
  TaskFormState,
} from "@/hooks/task-form/types/TaskForm";
import type { Dispatch } from "react";
import { LocationCard } from "./location-card";
import { PhotoCard } from "./photo-card";

interface TaskAttachmentCardsProps {
  state: TaskFormState;
  dispatch: Dispatch<TaskFormAction>;
  disabled: boolean;
}

export function TaskAttachmentCards({
  state,
  dispatch,
  disabled,
}: Readonly<TaskAttachmentCardsProps>) {
  const attachments = useTaskAttachments({ dispatch });

  return (
    <>
      <PhotoCard
        photoUris={state.photoUris}
        state={state.photoState}
        disabled={disabled}
        onTakePhoto={attachments.takePhoto}
        onPickPhotos={attachments.pickPhotos}
        onRemovePhoto={attachments.removePhoto}
        onRetry={attachments.retryPhoto}
        onOpenSettings={attachments.openSettings}
      />

      <LocationCard
        location={state.location}
        state={state.locationState}
        disabled={disabled}
        onGetLocation={attachments.getLocation}
        onRemoveLocation={attachments.removeLocation}
        onRetry={attachments.getLocation}
        onOpenSettings={attachments.openSettings}
      />
    </>
  );
}
