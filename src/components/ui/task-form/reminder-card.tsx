import { ThemedText } from "@/components/themed-text";
import { Colors, Rounded, Spacing } from "@/constants/theme";
import { ReminderSelection } from "@/context/tasks/types/Reminder";
import { StyleSheet, View } from "react-native";
import { ReminderOptions } from "./reminder-options";

interface ReminderCardProps {
  enabled: boolean;
  reminder: ReminderSelection;
  reminderLabel: string;
  error: string | null;
  disabled: boolean;
  onToggle: () => void;
  onSelect: (reminder: ReminderSelection) => void;
}

export function ReminderCard({
  enabled,
  reminder,
  reminderLabel,
  error,
  disabled,
  onToggle,
  onSelect,
}: Readonly<ReminderCardProps>) {
  const showError = enabled && !!error;
  const showHint = enabled && !showError;

  return (
    <View style={styles.reminderCard}>
      <ReminderOptions
        enabled={enabled}
        onToggle={onToggle}
        reminder={reminder}
        onSelect={onSelect}
        disabled={disabled}
      />
      {showError && (
        <ThemedText type="label-sm" color="error">
          {error}
        </ThemedText>
      )}
      {showHint && (
        <ThemedText type="label-sm" color="on-surface-variant">
          La notificación se enviará {reminderLabel.toLowerCase()}
        </ThemedText>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  reminderCard: {
    backgroundColor: Colors["surface-container"],
    borderRadius: Rounded.lg,
    padding: Spacing.gutter,
    gap: Spacing["space-md"],
  },
});
