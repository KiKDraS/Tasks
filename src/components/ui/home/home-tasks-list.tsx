import { ThemedText } from "@/components/themed-text";
import { Colors, Spacing } from "@/constants/theme";
import { useTasks } from "@/context/tasks/tasks-context";
import { useCurrentTime } from "@/hooks/use-current-time";
import { FlatList, StyleSheet, View } from "react-native";
import { HomeTask } from "./home-task";
import { HomeTasksEmpty } from "./home-tasks-empty";

export function HomeTasksList() {
  const { tasks } = useTasks();
  const now = useCurrentTime();

  return (
    <View style={styles.container}>
      <ThemedText type="display">Mis tareas</ThemedText>
      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id ?? item.title}
        renderItem={({ item }) => <HomeTask task={item} now={now} />}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={HomeTasksEmpty}
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
  listContent: {
    gap: Spacing.gutter,
  },
});
