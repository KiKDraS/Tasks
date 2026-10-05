import { Spacing } from "@/constants/theme";
import {
  REMINDER_TYPES,
  ReminderSelection,
} from "@/context/tasks/types/Reminder";
import { useReminderOptions } from "@/hooks/task-form/use-reminder-options";
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
  disabled?: boolean;
}

export function ReminderOptions({
  enabled,
  onToggle,
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

  return (
    <View
      pointerEvents={disabled ? "none" : "auto"}
      style={[styles.container, disabled && styles.disabled]}
    >
      <ReminderHeader enabled={enabled} onToggle={onToggle} />
      {enabled && (
        <>
          <ReminderModeSelector
            reminder={reminder}
            selectedDate={selectedDate}
            onSelect={onSelect}
          />
          {reminder.type === REMINDER_TYPES.TIME ? (
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
  disabled: {
    opacity: 0.5,
  },
});
