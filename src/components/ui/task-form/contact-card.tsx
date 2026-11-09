import ContactIcon from "@/components/icons/ContactIcon";
import { ThemedText } from "@/components/themed-text";
import { AppTouchableOpacity } from "@/components/ui/app-touchable-opacity";
import { FormButton } from "@/components/ui/form/form-button";
import { PermissionNotice } from "@/components/ui/permissions/permission-notice";
import { Colors } from "@/constants/theme";
import type { TaskContact } from "@/context/tasks/types/Task";
import { formatContactLabel } from "@/utils/contact";
import type { DeviceActionState } from "@/utils/permission-state";
import { StyleSheet } from "react-native";
import { AttachmentCard } from "./attachment-card";

interface ContactCardProps {
  contact: TaskContact | null;
  state: DeviceActionState;
  disabled?: boolean;
  onPickContact: () => void;
  onRemoveContact: () => void;
  onRetry: () => void;
  onOpenSettings: () => void;
}

export function ContactCard({
  contact,
  state,
  disabled,
  onPickContact,
  onRemoveContact,
  onRetry,
  onOpenSettings,
}: Readonly<ContactCardProps>) {
  const isPending = state.status === "pending";
  const isDisabled = !!disabled || isPending;

  return (
    <AttachmentCard
      icon={<ContactIcon size={20} color={Colors["on-surface"]} />}
      title="Contacto"
    >
      <ThemedText type="body-md" color="secondary">
        {contact ? formatContactLabel(contact) : "Sin contacto"}
      </ThemedText>

      <FormButton
        onPress={onPickContact}
        loading={isPending}
        disabled={isDisabled}
      >
        Elegir contacto
      </FormButton>

      {contact && (
        <AppTouchableOpacity
          onPress={onRemoveContact}
          disabled={isDisabled}
          accessibilityRole="button"
          accessibilityLabel="Quitar contacto"
          style={styles.remove}
        >
          <ThemedText type="label-md" color="error">
            Quitar contacto
          </ThemedText>
        </AppTouchableOpacity>
      )}

      <PermissionNotice
        state={state}
        onRetry={onRetry}
        onOpenSettings={onOpenSettings}
      />
    </AttachmentCard>
  );
}

const styles = StyleSheet.create({
  remove: {
    alignSelf: "flex-start",
    justifyContent: "center",
    minHeight: 44,
  },
});
