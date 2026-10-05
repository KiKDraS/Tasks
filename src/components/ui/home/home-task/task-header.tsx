import DeleteIcon from "@/components/icons/DeleteIcon";
import EditIcon from "@/components/icons/EditIcon";
import { ThemedText } from "@/components/themed-text";
import { PressableOpacity } from "@/components/ui/pressable-opacity";
import { Colors, Spacing } from "@/constants/theme";
import { StyleSheet, View } from "react-native";
import { TaskCheckbox } from "./task-checkbox";

const ACTION_ICON_SIZE = 22;

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
        style={[styles.title, isComplete && styles.completeText]}
      >
        {title}
      </ThemedText>
      <View style={styles.actions}>
        <PressableOpacity onPress={onEdit}>
          <EditIcon size={ACTION_ICON_SIZE} color={Colors["on-surface-variant"]} />
        </PressableOpacity>
        <PressableOpacity onPress={onDelete}>
          <DeleteIcon size={ACTION_ICON_SIZE} color={Colors.error} />
        </PressableOpacity>
      </View>
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
  actions: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing["space-md"],
  },
  completeText: {
    color: Colors["on-surface-variant"],
    textDecorationLine: "line-through",
  },
});
