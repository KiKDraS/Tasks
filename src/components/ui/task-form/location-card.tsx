import LocationIcon from "@/components/icons/LocationIcon";
import { ThemedText } from "@/components/themed-text";
import { AppTouchableOpacity } from "@/components/ui/app-touchable-opacity";
import { FormButton } from "@/components/ui/form/form-button";
import { PermissionNotice } from "@/components/ui/permissions/permission-notice";
import { Colors } from "@/constants/theme";
import type { TaskLocation } from "@/context/tasks/types/Task";
import type { DeviceActionState } from "@/utils/permission-state";
import { formatLocationLabel } from "@/utils/location";
import { StyleSheet } from "react-native";
import { AttachmentCard } from "./attachment-card";

interface LocationCardProps {
  location: TaskLocation | null;
  state: DeviceActionState;
  disabled?: boolean;
  onGetLocation: () => void;
  onRemoveLocation: () => void;
  onRetry: () => void;
  onOpenSettings: () => void;
}

function getLocationLabel(
  location: TaskLocation | null,
  isPending: boolean,
): string {
  if (isPending) {
    return "Obteniendo ubicación...";
  }

  if (location) {
    return formatLocationLabel(location);
  }

  return "Sin ubicación";
}

export function LocationCard({
  location,
  state,
  disabled,
  onGetLocation,
  onRemoveLocation,
  onRetry,
  onOpenSettings,
}: Readonly<LocationCardProps>) {
  const isPending = state.status === "pending";
  const isDisabled = !!disabled || isPending;

  return (
    <AttachmentCard
      icon={<LocationIcon size={20} color={Colors["on-surface"]} />}
      title="Ubicación"
    >
      <ThemedText type="body-md" color="secondary">
        {getLocationLabel(location, isPending)}
      </ThemedText>

      <FormButton onPress={onGetLocation} loading={isPending} disabled={isDisabled}>
        Usar mi ubicación
      </FormButton>

      {location && (
        <AppTouchableOpacity
          onPress={onRemoveLocation}
          disabled={isDisabled}
          accessibilityRole="button"
          accessibilityLabel="Quitar ubicación"
          style={styles.remove}
        >
          <ThemedText type="label-md" color="error">
            Quitar ubicación
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
