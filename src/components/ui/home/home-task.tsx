import ReminderNotificationIcon from "@/components/icons/ReminderNotificationIcon";
import { ThemedText } from "@/components/themed-text";
import { Colors, Rounded, setShadow, Spacing } from "@/constants/theme";
import { useTasks } from "@/context/users/tasks-context";
import { Task } from "@/context/users/types/Task";
import { Image } from "expo-image";
import { Pressable, StyleSheet, View } from "react-native";
import { HomeBadge } from "./home-badge";

interface HomeTaskProps {
  task: Task;
}

export function HomeTask({
  task: { title, description, isComplete, notification },
  task,
}: Readonly<HomeTaskProps>) {
  const { updateTask } = useTasks();

  const toggleCompletion = () => {
    updateTask({ ...task, isComplete: !isComplete });
  };

  return (
    <View
      style={
        isComplete
          ? { ...styles.container, ...styles.completeContainer }
          : styles.container
      }
    >
      <View style={styles.header}>
        <Pressable onPress={toggleCompletion}>
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
          style={isComplete ? styles.completeText : null}
        >
          {title}
        </ThemedText>
      </View>
      <View style={styles.body}>
        <ThemedText
          type="body-md"
          style={isComplete ? styles.completeText : null}
        >
          {description}
        </ThemedText>
        {!isComplete && notification && (
          <HomeBadge>
            <ReminderNotificationIcon size={11} color={Colors["on-surface"]} />
            <ThemedText type="label-sm">{notification}</ThemedText>
          </HomeBadge>
        )}
        {isComplete && (
          <HomeBadge>
            <ThemedText type="label-sm">Completed</ThemedText>
          </HomeBadge>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: Spacing.gutter,
    borderRadius: Rounded.md,
    backgroundColor: Colors.surface,
    gap: Spacing["space-lg"],
    ...setShadow("on-primary-container"),
  },
  completeContainer: {
    shadowColor: "transparent",
    borderColor: Colors["surface-variant"],
    borderWidth: 1,
    backgroundColor: Colors["surface-variant"],
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing["space-md"],
  },
  headerIcons: {
    flexDirection: "row",
    gap: Spacing["space-md"],
    alignItems: "center",
  },
  body: {
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
