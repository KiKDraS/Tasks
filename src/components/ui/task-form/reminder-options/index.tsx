import { Spacing } from "@/constants/theme";
import {
  REMINDER_TYPES,
  ReminderSelection,
} from "@/context/tasks/types/Reminder";
import { useReminderOptions } from "@/hooks/task-form/use-reminder-options";
import { StyleSheet, View } from "react-native";
import { ReminderDateOptions } from "./reminder-date-options";
import { ReminderModeSelector } from "./reminder-mode-selector";
import { ReminderTimeOptions } from "./reminder-time-options";

interface ReminderOptionsProps {
  visible: boolean;
  reminder: ReminderSelection;
  onSelect: (reminder: ReminderSelection) => void;
  disabled?: boolean;
}

export function ReminderOptions({
  visible,
  reminder,
  onSelect,
  disabled,
}: Readonly<ReminderOptionsProps>) {
  const {
    androidPicker,
    selectedDate,
    handleDateChange,
    handleTimeChange,
    setAndroidPicker,
  } = useReminderOptions(reminder, onSelect);

  if (!visible) {
    return null;
  }

  return (
    <View
      pointerEvents={disabled ? "none" : "auto"}
      style={[styles.container, disabled && styles.disabled]}
    >
      <ReminderModeSelector
        reminder={reminder}
        selectedDate={selectedDate}
        onSelect={onSelect}
        disabled={disabled}
      />
      {reminder.type === REMINDER_TYPES.TIME ? (
        <View
          accessibilityElementsHidden={disabled}
          importantForAccessibility={disabled ? "no-hide-descendants" : "auto"}
          pointerEvents={disabled ? "none" : "auto"}
        >
          <ReminderTimeOptions reminder={reminder} onSelect={onSelect} />
        </View>
      ) : (
        <ReminderDateOptions
          selectedDate={selectedDate}
          androidPicker={androidPicker}
          onAndroidPickerChange={setAndroidPicker}
          onDateChange={handleDateChange}
          onTimeChange={handleTimeChange}
          disabled={disabled}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing["space-md"],
  },
  disabled: {
    opacity: 0.5,
  },
});
