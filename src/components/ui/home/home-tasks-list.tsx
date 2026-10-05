import { ThemedText } from "@/components/themed-text";
import { Colors, Spacing } from "@/constants/theme";
import { useTasks } from "@/context/users/tasks-context";
import { FlatList, StyleSheet, View } from "react-native";
import { HomeTask } from "./home-task";

export function HomeTasksList() {
  const { tasks } = useTasks();

  if (!tasks || tasks.length === 0) {
    return <ThemedText>No tasks found.</ThemedText>;
  }

  return (
    <View style={styles.container}>
      <ThemedText type="display">Mis tareas</ThemedText>
      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id!}
        renderItem={({ item }) => <HomeTask task={item} />}
        contentContainerStyle={{ gap: Spacing.gutter }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: Spacing.gutter,
    backgroundColor: Colors["surface-container"],
    gap: Spacing.margin,
  },
});
