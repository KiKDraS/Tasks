import CameraIcon from "@/components/icons/CameraIcon";
import { ThemedText } from "@/components/themed-text";
import { AppTouchableOpacity } from "@/components/ui/app-touchable-opacity";
import { FormButton } from "@/components/ui/form/form-button";
import { PermissionNotice } from "@/components/ui/permissions/permission-notice";
import { Colors, Rounded, Spacing } from "@/constants/theme";
import type { DeviceActionState } from "@/utils/permission-state";
import { Image } from "expo-image";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { AttachmentCard } from "./attachment-card";

interface PhotoCardProps {
  photoUri: string | null;
  state: DeviceActionState;
  disabled?: boolean;
  onTakePhoto: () => void;
  onPickPhoto: () => void;
  onRemovePhoto: () => void;
  onRetry: () => void;
  onOpenSettings: () => void;
}

export function PhotoCard({
  photoUri,
  state,
  disabled,
  onTakePhoto,
  onPickPhoto,
  onRemovePhoto,
  onRetry,
  onOpenSettings,
}: Readonly<PhotoCardProps>) {
  const isPending = state.status === "pending";
  const isDisabled = !!disabled || isPending;

  return (
    <AttachmentCard
      icon={<CameraIcon size={20} color={Colors["on-surface"]} />}
      title="Foto"
    >
      <View style={styles.valueRow}>
        {photoUri ? (
          <Image
            source={{ uri: photoUri }}
            style={styles.thumbnail}
            contentFit="cover"
            accessible
            accessibilityRole="image"
            accessibilityLabel="Foto de la tarea"
          />
        ) : (
          <View
            style={styles.placeholder}
            accessibilityElementsHidden
            importantForAccessibility="no"
          />
        )}
        {!photoUri && (
          <ThemedText type="body-md" color="secondary">
            Sin foto
          </ThemedText>
        )}
        {isPending && <ActivityIndicator color={Colors.primary} />}
      </View>

      <View style={styles.actions}>
        <FormButton
          onPress={onTakePhoto}
          disabled={isDisabled}
          style={styles.action}
        >
          Tomar foto
        </FormButton>
        <FormButton
          variant="surface"
          onPress={onPickPhoto}
          disabled={isDisabled}
          style={styles.action}
        >
          Elegir de galería
        </FormButton>
      </View>

      {photoUri && (
        <AppTouchableOpacity
          onPress={onRemovePhoto}
          disabled={isDisabled}
          accessibilityRole="button"
          accessibilityLabel="Quitar foto"
          style={styles.remove}
        >
          <ThemedText type="label-md" color="error">
            Quitar foto
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
  valueRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing["space-md"],
  },
  thumbnail: {
    width: 64,
    height: 64,
    borderRadius: Rounded.md,
    backgroundColor: Colors["surface-variant"],
  },
  placeholder: {
    width: 64,
    height: 64,
    borderRadius: Rounded.md,
    backgroundColor: Colors["surface-variant"],
  },
  actions: {
    flexDirection: "row",
    gap: Spacing["space-md"],
  },
  action: {
    flex: 1,
  },
  remove: {
    alignSelf: "flex-start",
    justifyContent: "center",
    minHeight: 44,
  },
});
