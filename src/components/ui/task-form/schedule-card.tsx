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
  reminder: ReminderSelection;
  reminderLabel: string;
  error: string | null;
  disabled: boolean;
  isComplete?: boolean;
  calendarEventId: string | null;
  calendarState: DeviceActionState;
  onToggleReminder: () => void;
  onSelect: (reminder: ReminderSelection) => void;
  onRetryCalendar: () => void;
  onOpenSettings?: () => void;
  retryDisabled?: boolean;
}

export function ScheduleCard({
  reminderEnabled,
  reminder,
  reminderLabel,
  error,
  disabled,
  isComplete = false,
  calendarEventId,
  calendarState,
  onToggleReminder,
  onSelect,
  onRetryCalendar,
  onOpenSettings,
  retryDisabled,
}: Readonly<ScheduleCardProps>) {
  const showsScheduleOptions = shouldShowScheduleOptions({
    reminderEnabled,
    calendarEventId,
  });
  const showError = showsScheduleOptions && !!error;
  const hint = getScheduleHint(
    { reminderEnabled, calendarEventId, calendarState, isComplete },
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
        disabled={disabled}
        calendarEventId={calendarEventId}
        calendarState={calendarState}
        onToggleReminder={onToggleReminder}
        onRetryCalendar={onRetryCalendar}
        onOpenSettings={onOpenSettings}
        retryDisabled={retryDisabled}
      />

      <ReminderOptions
        visible={showsScheduleOptions}
        reminder={reminder}
        onSelect={onSelect}
        disabled={disabled || calendarState.status === "pending"}
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
