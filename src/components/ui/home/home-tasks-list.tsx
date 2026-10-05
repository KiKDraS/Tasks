import { ThemedText } from "@/components/themed-text";
import { useTasks } from "@/context/users/tasks-context";
import { FlatList } from "react-native";

export function HomeTasksList() {
  const { tasks } = useTasks();

  if (!tasks || tasks.length === 0) {
    return <ThemedText>No tasks found.</ThemedText>;
  }

  return (
    <FlatList
      data={tasks}
      keyExtractor={(item) => item.id!}
      renderItem={({ item }) => <ThemedText>{item.title}</ThemedText>}
      contentContainerStyle={{ paddingBottom: 16 }}
    />
  );
}
