import { ThemedText } from "@/components/themed-text";
import { Spacing } from "@/constants/theme";
import {
  REMINDER_TYPES,
  ReminderSelection,
  TimeReminder,
} from "@/context/tasks/types/Reminder";
import { REMINDER_TIME_PRESETS } from "@/hooks/task-form/constants";
import { StyleSheet, View } from "react-native";
import { OptionChip } from "./option-chip";
import { ReminderCustomTime } from "./reminder-custom-time";

interface ReminderTimeOptionsProps {
  reminder: TimeReminder;
  onSelect: (reminder: ReminderSelection) => void;
}

export function ReminderTimeOptions({
  reminder,
  onSelect,
}: Readonly<ReminderTimeOptionsProps>) {
  return (
    <View style={styles.container}>
      <View style={styles.presets}>
        {REMINDER_TIME_PRESETS.map((option) => {
          const selected = option.seconds === reminder.seconds;
          return (
            <OptionChip
              key={option.seconds}
              selected={selected}
              onPress={() =>
                onSelect({ type: REMINDER_TYPES.TIME, seconds: option.seconds })
              }
            >
              <ThemedText
                type="label-md"
                color={
                  selected ? "on-secondary-container" : "on-surface-variant"
                }
              >
                {option.label}
              </ThemedText>
            </OptionChip>
          );
        })}
      </View>
      <ReminderCustomTime
        seconds={reminder.seconds}
        onChange={(seconds) =>
          onSelect({ type: REMINDER_TYPES.TIME, seconds })
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing["space-md"],
  },
  presets: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing["space-sm"],
  },
});
