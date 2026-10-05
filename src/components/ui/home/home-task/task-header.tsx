import DeleteIcon from "@/components/icons/DeleteIcon";
import EditIcon from "@/components/icons/EditIcon";
import { ThemedText } from "@/components/themed-text";
import { PressableOpacity } from "@/components/ui/pressable-opacity";
import { Colors, Rounded, Spacing } from "@/constants/theme";
import { Image } from "expo-image";
import { StyleSheet, View } from "react-native";

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
      <PressableOpacity onPress={onToggle}>
        {isComplete ? (
          <Image
            source={require("@/assets/images/icon.png")}
            style={styles.completeCheckTask}
            contentFit="contain"
          />
        ) : (
          <View style={styles.incompleteCheckTask} />
        )}
      </PressableOpacity>
      <ThemedText
        type="headline-md"
        style={[styles.title, isComplete && styles.completeText]}
      >
        {title}
      </ThemedText>
      <View style={styles.actions}>
        <PressableOpacity onPress={onEdit}>
          <EditIcon size={22} color={Colors["on-surface-variant"]} />
        </PressableOpacity>
        <PressableOpacity onPress={onDelete}>
          <DeleteIcon size={22} color={Colors.error} />
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
  incompleteCheckTask: {
    width: 24,
    height: 24,
    backgroundColor: Colors["surface-variant"],
    borderRadius: Rounded.md,
  },
  completeCheckTask: {
    width: 24,
    height: 24,
  },
});
