import CalendarIcon from "@/components/icons/CalendarIcon";
import ContactIcon from "@/components/icons/ContactIcon";
import GalleryIcon from "@/components/icons/GalleryIcon";
import LocationIcon from "@/components/icons/LocationIcon";
import { ThemedText } from "@/components/themed-text";
import { Colors, Spacing } from "@/constants/theme";
import type { Task } from "@/context/tasks/types/Task";
import { formatContactLabel } from "@/utils/contact";
import { formatLocationLabel } from "@/utils/location";
import { getTaskPhotoUris } from "@/utils/task-photos";
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
  const photoCount = getTaskPhotoUris(task).length;
  const hasPhotos = photoCount > 0;
  const hasMeta = !!task.location || !!task.contact || !!task.calendarEventId;

  if (!hasPhotos && !hasMeta) {
    return null;
  }

  const photoLabel = `${photoCount} foto${photoCount === 1 ? "" : "s"}`;

  return (
    <View style={styles.meta}>
      {hasPhotos && (
        <TaskAttachmentMeta
          icon={<GalleryIcon size={14} color={Colors.secondary} />}
          label={photoLabel}
          isComplete={isComplete}
        />
      )}
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
  );
}

const styles = StyleSheet.create({
  meta: {
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
