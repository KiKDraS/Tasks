import DeleteIcon from "@/components/icons/DeleteIcon";
import { ThemedText } from "@/components/themed-text";
import { Colors, Rounded, Spacing } from "@/constants/theme";
import { Image } from "expo-image";
import { Pressable, StyleSheet, View } from "react-native";

interface TaskHeaderProps {
  title: string;
  isComplete: boolean;
  onToggle: () => void;
  onDelete: () => void;
}

export function TaskHeader({
  title,
  isComplete,
  onToggle,
  onDelete,
}: Readonly<TaskHeaderProps>) {
  return (
    <View style={styles.header}>
      <Pressable onPress={onToggle}>
        {isComplete ? (
          <Image
            source={require("@/assets/images/icon.png")}
            style={styles.completeCheckTask}
            contentFit="contain"
          />
        ) : (
          <View style={styles.incompleteCheckTask} />
        )}
      </Pressable>
      <ThemedText
        type="headline-md"
        style={[styles.title, isComplete && styles.completeText]}
      >
        {title}
      </ThemedText>
      <Pressable onPress={onDelete}>
        <DeleteIcon size={22} color={Colors.error} />
      </Pressable>
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
    width: "75%",
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
