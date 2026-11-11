import { FormButton } from "@/components/ui/form/form-button";
import { Spacing } from "@/constants/theme";
import { StyleSheet, View } from "react-native";

interface TaskFormActionsProps {
  isEditing: boolean;
  isSubmitting: boolean;
  submitDisabled: boolean;
  onCancel: () => void;
  onSubmit: () => void;
}

export function TaskFormActions({
  isEditing,
  isSubmitting,
  submitDisabled,
  onCancel,
  onSubmit,
}: Readonly<TaskFormActionsProps>) {
  return (
    <View style={styles.actions}>
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
});
