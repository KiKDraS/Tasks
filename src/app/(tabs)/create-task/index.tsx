import { ThemedText } from "@/components/themed-text";
import { CreateTaskForm } from "@/components/ui/create-task/create-task-form";
import { Spacing } from "@/constants/theme";
import { StyleSheet, View } from "react-native";

export default function CreateTasksScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <ThemedText type="display">Nueva tarea</ThemedText>
        <ThemedText type="body-md" color="on-surface-variant">
          Completá los datos para crear tu tarea
        </ThemedText>
      </View>
      <View style={styles.content}>
        <CreateTaskForm />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: Spacing.gutter,
    gap: Spacing["space-lg"],
    justifyContent: "space-between",
  },
  content: {
    flex: 1,
    gap: Spacing["space-lg"],
  },
  header: {
    gap: Spacing["space-xs"],
  },
});
