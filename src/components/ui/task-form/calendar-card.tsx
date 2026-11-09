import CalendarIcon from "@/components/icons/CalendarIcon";
import { ThemedText } from "@/components/themed-text";
import { PermissionNotice } from "@/components/ui/permissions/permission-notice";
import { Colors } from "@/constants/theme";
import type { DeviceActionState } from "@/utils/permission-state";
import { Switch } from "react-native";
import { AttachmentCard } from "./attachment-card";

interface CalendarCardProps {
  enabled: boolean;
  eventId: string | null;
  state: DeviceActionState;
  disabled?: boolean;
  onToggle: () => void;
  onRetry: () => void;
  onOpenSettings: () => void;
}

function getCalendarLabel(
  enabled: boolean,
  eventId: string | null,
  isPending: boolean,
): string | null {
  if (isPending) {
    return "Verificando permiso...";
  }

  if (enabled && eventId) {
    return "Evento creado";
  }

  if (!enabled && eventId) {
    return "Se quitará al guardar la tarea";
  }

  if (enabled) {
    return "Se crea al guardar la tarea";
  }

  return null;
}

export function CalendarCard({
  enabled,
  eventId,
  state,
  disabled,
  onToggle,
  onRetry,
  onOpenSettings,
}: Readonly<CalendarCardProps>) {
  const isPending = state.status === "pending";
  const isDisabled = !!disabled || isPending;
  const calendarLabel = getCalendarLabel(enabled, eventId, isPending);

  return (
    <AttachmentCard
      icon={<CalendarIcon size={20} color={Colors["on-surface"]} />}
      title="Calendario"
      trailing={
        <Switch
          value={enabled}
          onValueChange={onToggle}
          disabled={isDisabled}
          accessibilityLabel="Evento en el calendario"
          trackColor={{
            true: Colors["secondary-container"],
            false: Colors["surface-variant"],
          }}
          thumbColor={enabled ? Colors.secondary : Colors["on-surface-variant"]}
        />
      }
    >
      <ThemedText type="body-md" color="secondary">
        {enabled ? "Evento en el calendario" : "Sin evento"}
      </ThemedText>

      {calendarLabel ? (
        <ThemedText type="label-sm" color="secondary">
          {calendarLabel}
        </ThemedText>
      ) : null}

      <PermissionNotice
        state={state}
        onRetry={onRetry}
        onOpenSettings={onOpenSettings}
      />
    </AttachmentCard>
  );
}
