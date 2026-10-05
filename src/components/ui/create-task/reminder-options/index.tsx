import { Spacing } from "@/constants/theme";
import { ReminderSelection } from "@/hooks/create-task/types/Reminder";
import { useReminderOptions } from "@/hooks/create-task/use-reminder-options";
import { StyleSheet, View } from "react-native";
import { ReminderDateOptions } from "./reminder-date-options";
import { ReminderHeader } from "./reminder-header";
import { ReminderModeSelector } from "./reminder-mode-selector";
import { ReminderTimeOptions } from "./reminder-time-options";

interface ReminderOptionsProps {
  enabled: boolean;
  onToggle: (enabled: boolean) => void;
  reminder: ReminderSelection;
  onSelect: (reminder: ReminderSelection) => void;
}

export function ReminderOptions({
  enabled,
  onToggle,
  reminder,
  onSelect,
}: Readonly<ReminderOptionsProps>) {
  const {
    androidPicker,
    selectedDate,
    handleDateChange,
    handleTimeChange,
    setAndroidPicker,
  } = useReminderOptions(reminder, onSelect);

  return (
    <View style={styles.container}>
      <ReminderHeader enabled={enabled} onToggle={onToggle} />
      {enabled && (
        <>
          <ReminderModeSelector
            reminder={reminder}
            selectedDate={selectedDate}
            onSelect={onSelect}
          />
          {reminder.type === "time" ? (
            <ReminderTimeOptions reminder={reminder} onSelect={onSelect} />
          ) : (
            <ReminderDateOptions
              selectedDate={selectedDate}
              androidPicker={androidPicker}
              onAndroidPickerChange={setAndroidPicker}
              onDateChange={handleDateChange}
              onTimeChange={handleTimeChange}
            />
          )}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing["space-md"],
  },
});
