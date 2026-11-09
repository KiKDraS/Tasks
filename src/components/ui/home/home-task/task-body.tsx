import ReminderNotificationIcon from "@/components/icons/ReminderNotificationIcon";
import { ThemedText } from "@/components/themed-text";
import { Colors, Spacing } from "@/constants/theme";
import { Task } from "@/context/tasks/types/Task";
import { getNotificationBadgeLabel } from "@/context/tasks/utils/notification-badge";
import { StyleSheet, View } from "react-native";
import { HomeBadge } from "../home-badge";
import { TaskAttachments } from "./task-attachments";
import { taskTextStyles } from "./task-text-styles";

interface TaskBodyProps {
  task: Task;
  isComplete: boolean;
  now: Date;
}

export function TaskBody({ task, isComplete, now }: Readonly<TaskBodyProps>) {
  const notificationLabel = getNotificationBadgeLabel(task.notification, now);
  const hasNotificationBadge = !isComplete && !!notificationLabel;

  return (
    <View style={styles.body}>
      <ThemedText
        type="body-md"
        style={isComplete ? taskTextStyles.completeText : null}
      >
        {task.description}
      </ThemedText>
      <TaskAttachments task={task} isComplete={isComplete} />
      {hasNotificationBadge && (
        <HomeBadge>
          <ReminderNotificationIcon size={11} color={Colors["on-surface"]} />
          <ThemedText type="label-sm">{notificationLabel}</ThemedText>
        </HomeBadge>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  body: {
    gap: Spacing["space-md"],
  },
});
