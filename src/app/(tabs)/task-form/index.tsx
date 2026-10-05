import { ThemedText } from "@/components/themed-text";
import { TaskForm } from "@/components/ui/task-form/task-form";
import { Spacing } from "@/constants/theme";
import { useLocalSearchParams } from "expo-router";
import { ScrollView, StyleSheet, View } from "react-native";

export default function TaskFormScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const isEditing = !!id;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <ThemedText type="display">
          {isEditing ? "Editar tarea" : "Nueva tarea"}
        </ThemedText>
        <ThemedText type="body-md" color="on-surface-variant">
          {isEditing
            ? "Modificá los datos de tu tarea"
            : "Completá los datos para crear tu tarea"}
        </ThemedText>
      </View>
      <View style={styles.content}>
        <TaskForm taskId={id} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: Spacing.gutter,
    gap: Spacing["space-lg"],
  },
  content: {
    flex: 1,
    gap: Spacing["space-lg"],
  },
  header: {
    gap: Spacing["space-xs"],
  },
});
