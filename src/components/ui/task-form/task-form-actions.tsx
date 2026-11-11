import ShareIcon from "@/components/icons/ShareIcon";
import { AppTouchableOpacity } from "@/components/ui/app-touchable-opacity";
import { FormButton } from "@/components/ui/form/form-button";
import { Colors, Rounded, Spacing } from "@/constants/theme";
import { StyleSheet, View } from "react-native";

interface TaskFormActionsProps {
  isEditing: boolean;
  isSubmitting: boolean;
  submitDisabled: boolean;
  onCancel: () => void;
  onSubmit: () => void;
  onShare?: () => void;
}

export function TaskFormActions({
  isEditing,
  isSubmitting,
  submitDisabled,
  onCancel,
  onSubmit,
  onShare,
}: Readonly<TaskFormActionsProps>) {
  const showShare = isEditing && !!onShare;

  return (
    <View style={styles.actions}>
      {showShare && (
        <AppTouchableOpacity
          onPress={onShare}
          disabled={isSubmitting}
          accessibilityRole="button"
          accessibilityLabel="Compartir tarea"
          accessibilityState={{ disabled: isSubmitting }}
          style={styles.share}
        >
          <ShareIcon size={22} color={Colors["on-surface"]} />
        </AppTouchableOpacity>
      )}
      <FormButton
        variant="surface"
        onPress={onCancel}
        disabled={isSubmitting}
        style={styles.action}
      >
        Cancelar
      </FormButton>
      <FormButton
        onPress={onSubmit}
        loading={isSubmitting}
        disabled={submitDisabled}
        style={styles.action}
      >
        {isEditing ? "Actualizar tarea" : "Crear tarea"}
      </FormButton>
    </View>
  );
}

const styles = StyleSheet.create({
  actions: {
    flexDirection: "row",
    gap: Spacing["space-md"],
  },
  action: {
    flex: 1,
  },
  share: {
    width: 48,
    height: 48,
    borderRadius: Rounded.lg,
    backgroundColor: Colors["surface-variant"],
    alignItems: "center",
    justifyContent: "center",
  },
});
