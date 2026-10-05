import ReminderNotificationIcon from "@/components/icons/ReminderNotificationIcon";
import { ThemedText } from "@/components/themed-text";
import { Colors, Spacing } from "@/constants/theme";
import { TaskNotification } from "@/context/tasks/types/Task";
import { getNotificationBadgeLabel } from "@/context/tasks/utils/notification-badge";
import { StyleSheet, View } from "react-native";
import { HomeBadge } from "../home-badge";

interface TaskBodyProps {
  description: string;
  isComplete: boolean;
  notification: TaskNotification | null;
  now: Date;
}

export function TaskBody({
  description,
  isComplete,
  notification,
  now,
}: Readonly<TaskBodyProps>) {
  const notificationLabel = getNotificationBadgeLabel(notification, now);

  return (
    <View style={styles.body}>
      <ThemedText type="body-md" style={isComplete ? styles.completeText : null}>
        {description}
      </ThemedText>
      {isComplete ? (
        <HomeBadge>
          <ThemedText type="label-sm">Completed</ThemedText>
        </HomeBadge>
      ) : (
        notificationLabel && (
          <HomeBadge>
            <ReminderNotificationIcon size={11} color={Colors["on-surface"]} />
            <ThemedText type="label-sm">{notificationLabel}</ThemedText>
          </HomeBadge>
        )
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  body: {
    gap: Spacing["space-md"],
  },
  completeText: {
    color: Colors["on-surface-variant"],
    textDecorationLine: "line-through",
  },
});
