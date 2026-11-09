import { ThemedText } from "@/components/themed-text";
import { Colors, Rounded, Spacing } from "@/constants/theme";
import type { ReminderSelection } from "@/context/tasks/types/Reminder";
import { getScheduleHint } from "@/hooks/task-form/utils/schedule-hint";
import { shouldShowScheduleOptions } from "@/hooks/task-form/utils/schedule-state";
import type { DeviceActionState } from "@/utils/permission-state";
import { useEffect } from "react";
import { AccessibilityInfo, Platform, StyleSheet, View } from "react-native";
import { ReminderOptions } from "./reminder-options";
import { ScheduleHeader } from "./reminder-options/schedule-header";

interface ScheduleCardProps {
  reminderEnabled: boolean;
  calendarEnabled: boolean;
  reminder: ReminderSelection;
  reminderLabel: string;
  error: string | null;
  disabled: boolean;
  calendarEventId: string | null;
  calendarState: DeviceActionState;
  onToggleReminder: () => void;
  onToggleCalendar: () => void;
  onSelect: (reminder: ReminderSelection) => void;
  onRetryCalendar: () => void;
  onOpenSettings?: () => void;
  retryDisabled?: boolean;
}

export function ScheduleCard({
  reminderEnabled,
  calendarEnabled,
  reminder,
  reminderLabel,
  error,
  disabled,
  calendarEventId,
  calendarState,
  onToggleReminder,
  onToggleCalendar,
  onSelect,
  onRetryCalendar,
  onOpenSettings,
  retryDisabled,
}: Readonly<ScheduleCardProps>) {
  const showsScheduleOptions = shouldShowScheduleOptions({
    reminderEnabled,
    calendarEnabled,
    calendarEventId,
  });
  const showError = showsScheduleOptions && !!error;
  const hint = getScheduleHint(
    reminderEnabled,
    calendarEnabled,
    calendarEventId,
    reminderLabel,
  );

  useEffect(() => {
    if (Platform.OS === "ios" && showError && error) {
      AccessibilityInfo.announceForAccessibility(error);
    }
  }, [error, showError]);

  return (
    <View style={styles.scheduleCard}>
      <ScheduleHeader
        reminderEnabled={reminderEnabled}
        calendarEnabled={calendarEnabled}
        disabled={disabled}
        calendarEventId={calendarEventId}
        calendarState={calendarState}
        onToggleReminder={onToggleReminder}
        onToggleCalendar={onToggleCalendar}
        onRetryCalendar={onRetryCalendar}
        onOpenSettings={onOpenSettings}
        retryDisabled={retryDisabled}
      />

      <ReminderOptions
        visible={showsScheduleOptions}
        reminder={reminder}
        onSelect={onSelect}
        disabled={disabled}
      />

      {showError ? (
        <ThemedText
          type="label-sm"
          color="error"
          accessibilityLiveRegion="polite"
        >
          {error}
        </ThemedText>
      ) : null}

      {!showError && hint ? (
        <ThemedText type="label-sm" color="secondary">
          {hint}
        </ThemedText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  scheduleCard: {
    backgroundColor: Colors["surface-container"],
    borderRadius: Rounded.lg,
    padding: Spacing.gutter,
    gap: Spacing["space-md"],
  },
});
