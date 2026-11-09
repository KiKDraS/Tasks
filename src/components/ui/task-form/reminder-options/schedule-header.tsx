import ReminderIcon from "@/components/icons/ReminderIcon";
import { ThemedText } from "@/components/themed-text";
import { PermissionNotice } from "@/components/ui/permissions/permission-notice";
import { Colors, Spacing } from "@/constants/theme";
import type { DeviceActionState } from "@/utils/permission-state";
import { StyleSheet, View } from "react-native";
import { ScheduleToggleRow } from "./schedule-toggle-row";

interface ScheduleHeaderProps {
  reminderEnabled: boolean;
  calendarEnabled: boolean;
  disabled: boolean;
  calendarEventId: string | null;
  calendarState: DeviceActionState;
  onToggleReminder: () => void;
  onToggleCalendar: () => void;
  onRetryCalendar: () => void;
  onOpenSettings?: () => void;
  retryDisabled?: boolean;
}

function getCalendarLabel(
  enabled: boolean,
  eventId: string | null,
  isPending: boolean,
): string | null {
  if (isPending) {
    return "Verificando permiso...";
  }

  if (enabled) {
    return eventId ? "Evento creado" : "Se crea al guardar la tarea";
  }

  return eventId ? "Se quitará al guardar la tarea" : null;
}

export function ScheduleHeader({
  reminderEnabled,
  calendarEnabled,
  disabled,
  calendarEventId,
  calendarState,
  onToggleReminder,
  onToggleCalendar,
  onRetryCalendar,
  onOpenSettings,
  retryDisabled,
}: Readonly<ScheduleHeaderProps>) {
  const isCalendarPending = calendarState.status === "pending";
  const calendarLabel = getCalendarLabel(
    calendarEnabled,
    calendarEventId,
    isCalendarPending,
  );

  return (
    <View style={styles.container}>
      <View style={styles.titleRow}>
        <View
          style={styles.icon}
          accessibilityElementsHidden
          importantForAccessibility="no"
        >
          <ReminderIcon size={20} color={Colors["on-surface"]} />
        </View>
        <ThemedText type="label-md" accessibilityRole="header">
          Recordatorio
        </ThemedText>
      </View>

      <ScheduleToggleRow
        label="Notificación en la app"
        value={reminderEnabled}
        disabled={disabled}
        onValueChange={onToggleReminder}
      />

      <ScheduleToggleRow
        label="Evento en el calendario"
        value={calendarEnabled}
        disabled={disabled || isCalendarPending}
        onValueChange={onToggleCalendar}
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
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing["space-sm"],
  },
  icon: {
    width: 20,
    height: 20,
    alignItems: "center",
    justifyContent: "center",
  },
});
