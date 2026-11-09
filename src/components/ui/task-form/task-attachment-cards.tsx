import { useContactAttachment } from "@/hooks/task-form/use-contact-attachment";
import { useTaskAttachments } from "@/hooks/task-form/use-task-attachments";
import type {
  TaskFormAction,
  TaskFormState,
} from "@/hooks/task-form/types/TaskForm";
import type { Dispatch } from "react";
import { ContactCard } from "./contact-card";
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
  const contact = useContactAttachment({ dispatch });

  return (
    <>
      <PhotoCard
        photoUri={state.photoUri}
        state={state.photoState}
        disabled={disabled}
        onTakePhoto={attachments.takePhoto}
        onPickPhoto={attachments.pickPhoto}
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

      <ContactCard
        contact={state.contact}
        state={state.contactState}
        disabled={disabled}
        onPickContact={contact.pickContact}
        onRemoveContact={contact.removeContact}
        onRetry={contact.pickContact}
        onOpenSettings={attachments.openSettings}
      />
    </>
  );
}
