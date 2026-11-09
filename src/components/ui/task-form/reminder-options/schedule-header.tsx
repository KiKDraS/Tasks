import ReminderIcon from "@/components/icons/ReminderIcon";
import { ThemedText } from "@/components/themed-text";
import { PermissionNotice } from "@/components/ui/permissions/permission-notice";
import { Colors, Spacing } from "@/constants/theme";
import { getCalendarLabel } from "@/hooks/task-form/utils/calendar-label";
import type { DeviceActionState } from "@/utils/permission-state";
import { StyleSheet, View } from "react-native";
import { ScheduleToggleRow } from "./schedule-toggle-row";

interface ScheduleHeaderProps {
  reminderEnabled: boolean;
  disabled: boolean;
  calendarEventId: string | null;
  calendarState: DeviceActionState;
  onToggleReminder: () => void;
  onRetryCalendar: () => void;
  onOpenSettings?: () => void;
  retryDisabled?: boolean;
}

export function ScheduleHeader({
  reminderEnabled,
  disabled,
  calendarEventId,
  calendarState,
  onToggleReminder,
  onRetryCalendar,
  onOpenSettings,
  retryDisabled,
}: Readonly<ScheduleHeaderProps>) {
  const calendarLabel = getCalendarLabel(
    reminderEnabled,
    calendarEventId,
    calendarState,
  );
  const isCalendarPending = calendarState.status === "pending";

  return (
    <View style={styles.container}>
      <ScheduleToggleRow
        label="Recordatorio"
        icon={<ReminderIcon size={20} color={Colors["on-surface"]} />}
        value={reminderEnabled}
        disabled={disabled || isCalendarPending}
        onValueChange={onToggleReminder}
      />

      {calendarLabel ? (
        <ThemedText type="label-sm" color="secondary">
          {calendarLabel}
        </ThemedText>
      ) : null}

      <PermissionNotice
        state={calendarState}
        onRetry={onRetryCalendar}
        onOpenSettings={onOpenSettings}
        disabled={retryDisabled}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing["space-md"],
  },
});
