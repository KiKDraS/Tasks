import { ThemedText } from "@/components/themed-text";
import { Spacing } from "@/constants/theme";
import { ReminderSelection } from "@/hooks/create-task/types/Reminder";
import { StyleSheet, View } from "react-native";
import { OptionChip } from "./option-chip";

interface ReminderModeSelectorProps {
  reminder: ReminderSelection;
  selectedDate: Date;
  onSelect: (reminder: ReminderSelection) => void;
}

export function ReminderModeSelector({
  reminder,
  selectedDate,
  onSelect,
}: Readonly<ReminderModeSelectorProps>) {
  const timeSelected = reminder.type === "time";

  return (
    <View style={styles.modeSelector}>
      <OptionChip
        selected={timeSelected}
        onPress={() =>
          onSelect({
            type: "time",
            seconds: reminder.type === "time" ? reminder.seconds : 5,
          })
        }
        style={styles.modeChip}
      >
        <ThemedText
          type="label-md"
          color={timeSelected ? "on-secondary-container" : "on-surface-variant"}
        >
          Tiempo
        </ThemedText>
      </OptionChip>
      <OptionChip
        selected={!timeSelected}
        onPress={() => onSelect({ type: "date", date: selectedDate })}
        style={styles.modeChip}
      >
        <ThemedText
          type="label-md"
          color={!timeSelected ? "on-secondary-container" : "on-surface-variant"}
        >
          Fecha y hora
        </ThemedText>
      </OptionChip>
    </View>
  );
}

const styles = StyleSheet.create({
  modeSelector: {
    flexDirection: "row",
    gap: Spacing["space-sm"],
  },
  modeChip: {
    flex: 1,
    alignItems: "center",
  },
});
