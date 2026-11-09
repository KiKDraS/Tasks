import CameraIcon from "@/components/icons/CameraIcon";
import CloseIcon from "@/components/icons/CloseIcon";
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
  photoUris: string[];
  state: DeviceActionState;
  disabled?: boolean;
  onTakePhoto: () => void;
  onPickPhotos: () => void;
  onRemovePhoto: (uri: string) => void;
  onRetry: () => void;
  onOpenSettings: () => void;
}

export function PhotoCard({
  photoUris,
  state,
  disabled,
  onTakePhoto,
  onPickPhotos,
  onRemovePhoto,
  onRetry,
  onOpenSettings,
}: Readonly<PhotoCardProps>) {
  const isPending = state.status === "pending";
  const isDisabled = !!disabled || isPending;
  const hasPhotos = photoUris.length > 0;

  return (
    <AttachmentCard
      icon={<CameraIcon size={20} color={Colors["on-surface"]} />}
      title="Fotos"
    >
      {hasPhotos ? (
        <View style={styles.grid}>
          {photoUris.map((uri, index) => (
            <View key={uri} style={styles.thumbnailWrapper}>
              <Image
                source={{ uri }}
                style={styles.thumbnail}
                contentFit="cover"
                accessible
                accessibilityRole="image"
                accessibilityLabel={`Foto ${index + 1} de la tarea`}
              />
              <AppTouchableOpacity
                onPress={() => onRemovePhoto(uri)}
                disabled={isDisabled}
                accessibilityRole="button"
                accessibilityLabel={`Quitar foto ${index + 1}`}
                accessibilityState={{ disabled: isDisabled }}
                style={styles.removeButton}
              >
                <View style={styles.removeCircle}>
                  <CloseIcon size={16} color={Colors["on-primary"]} />
                </View>
              </AppTouchableOpacity>
            </View>
          ))}
        </View>
      ) : (
        <ThemedText type="body-md" color="secondary">
          Sin fotos
        </ThemedText>
      )}

      {isPending && (
        <ActivityIndicator
          color={Colors.primary}
          accessibilityLabel="Cargando fotos"
        />
      )}

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
          onPress={onPickPhotos}
          disabled={isDisabled}
          style={styles.action}
        >
          Elegir de galería
        </FormButton>
      </View>

      <PermissionNotice
        state={state}
        onRetry={onRetry}
        onOpenSettings={onOpenSettings}
      />
    </AttachmentCard>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing["space-md"],
  },
  thumbnailWrapper: {
    width: 64,
    height: 64,
  },
  thumbnail: {
    width: 64,
    height: 64,
    borderRadius: Rounded.md,
    backgroundColor: Colors["surface-variant"],
  },
  removeButton: {
    position: "absolute",
    top: 0,
    right: 0,
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  removeCircle: {
    width: 28,
    height: 28,
    borderRadius: Rounded.full,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.error,
  },
  actions: {
    flexDirection: "row",
    gap: Spacing["space-md"],
  },
  action: {
    flex: 1,
  },
});
