import { ThemedText } from "@/components/themed-text";
import { Spacing } from "@/constants/theme";
import { StyleSheet, View } from "react-native";
import { TaskActions } from "./task-actions";
import { TaskCheckbox } from "./task-checkbox";
import { taskTextStyles } from "./task-text-styles";

interface TaskHeaderProps {
  title: string;
  isComplete: boolean;
  onToggle: () => void;
  onDelete: () => void;
  onEdit: () => void;
}

export function TaskHeader({
  title,
  isComplete,
  onToggle,
  onDelete,
  onEdit,
}: Readonly<TaskHeaderProps>) {
  return (
    <View style={styles.header}>
      <TaskCheckbox isComplete={isComplete} onToggle={onToggle} />
      <ThemedText
        type="headline-md"
        style={[styles.title, isComplete && taskTextStyles.completeText]}
      >
        {title}
      </ThemedText>
      <TaskActions onEdit={onEdit} onDelete={onDelete} />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: Spacing["space-md"],
  },
  title: {
    flex: 1,
  },
});
