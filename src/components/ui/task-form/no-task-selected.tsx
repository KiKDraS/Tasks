import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { FormButton } from "@/components/ui/form/form-button";
import { TASK_FORM_PARAMS } from "@/constants/routes";
import { Spacing } from "@/constants/theme";
import { router } from "expo-router";
import { StyleSheet } from "react-native";

export function NoTaskSelected() {
  const createTask = () => {
    router.setParams(TASK_FORM_PARAMS.create);
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="display" accessibilityRole="header" style={styles.text}>
        Ninguna tarea seleccionada
      </ThemedText>
      <ThemedText
        type="body-md"
        color="on-surface-variant"
        style={styles.text}
      >
        Elegí una tarea de la lista o creá una nueva.
      </ThemedText>
      <FormButton onPress={createTask} style={styles.action}>
        Crear tarea
      </FormButton>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: Spacing.gutter,
    justifyContent: "center",
    alignItems: "center",
    gap: Spacing.gutter,
  },
  text: {
    textAlign: "center",
  },
  action: {
    paddingHorizontal: Spacing["space-lg"],
  },
});
