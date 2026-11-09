import CalendarIcon from "@/components/icons/CalendarIcon";
import ContactIcon from "@/components/icons/ContactIcon";
import LocationIcon from "@/components/icons/LocationIcon";
import { ThemedText } from "@/components/themed-text";
import { Colors, Rounded, Spacing } from "@/constants/theme";
import type { Task } from "@/context/tasks/types/Task";
import { formatContactLabel } from "@/utils/contact";
import { formatLocationLabel } from "@/utils/location";
import { Image } from "expo-image";
import type { ReactNode } from "react";
import { StyleSheet, View } from "react-native";
import { taskTextStyles } from "./task-text-styles";

interface TaskAttachmentsProps {
  task: Task;
  isComplete: boolean;
}

interface TaskAttachmentMetaProps {
  icon: ReactNode;
  label: string;
  isComplete: boolean;
}

function TaskAttachmentMeta({
  icon,
  label,
  isComplete,
}: Readonly<TaskAttachmentMetaProps>) {
  return (
    <View style={styles.metaRow}>
      <View
        accessible={false}
        accessibilityElementsHidden
        importantForAccessibility="no"
      >
        {icon}
      </View>
      <ThemedText
        type="label-sm"
        color="secondary"
        numberOfLines={1}
        style={[styles.metaLabel, isComplete && taskTextStyles.completeText]}
      >
        {label}
      </ThemedText>
    </View>
  );
}

export function TaskAttachments({
  task,
  isComplete,
}: Readonly<TaskAttachmentsProps>) {
  const hasAttachments =
    !!task.photoUri ||
    !!task.location ||
    !!task.contact ||
    !!task.calendarEventId;

  if (!hasAttachments) {
    return null;
  }

  const hasMeta = !!task.location || !!task.contact || !!task.calendarEventId;

  return (
    <View style={styles.container}>
      {task.photoUri && (
        <Image
          source={{ uri: task.photoUri }}
          style={[styles.photo, isComplete && styles.completePhoto]}
          contentFit="cover"
          accessible
          accessibilityRole="image"
          accessibilityLabel="Foto de la tarea"
        />
      )}
      {hasMeta && (
        <View style={styles.meta}>
          {task.location && (
            <TaskAttachmentMeta
              icon={<LocationIcon size={14} color={Colors.secondary} />}
              label={formatLocationLabel(task.location)}
              isComplete={isComplete}
            />
          )}
          {task.contact && (
            <TaskAttachmentMeta
              icon={<ContactIcon size={14} color={Colors.secondary} />}
              label={formatContactLabel(task.contact)}
              isComplete={isComplete}
            />
          )}
          {task.calendarEventId && (
            <TaskAttachmentMeta
              icon={<CalendarIcon size={14} color={Colors.secondary} />}
              label="Evento"
              isComplete={isComplete}
            />
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: Spacing["space-md"],
  },
  photo: {
    width: 56,
    height: 56,
    borderRadius: Rounded.md,
    backgroundColor: Colors["surface-variant"],
  },
  completePhoto: {
    opacity: 0.6,
  },
  meta: {
    flex: 1,
    gap: Spacing["space-xs"],
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing["space-xs"],
  },
  metaLabel: {
    flex: 1,
  },
});
