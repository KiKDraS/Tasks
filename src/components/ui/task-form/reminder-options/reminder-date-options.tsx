import { Spacing } from "@/constants/theme";
import { REMINDER_TYPES, ReminderType } from "@/context/tasks/types/Reminder";
import { formatDate, formatTime } from "@/utils/date";
import { DateTimePicker } from "@expo/ui/community/datetime-picker";
import { useState } from "react";
import { Platform, StyleSheet, View } from "react-native";
import { ReminderIosPickerSheet } from "./reminder-ios-picker-sheet";
import { ReminderPickerField } from "./reminder-picker-field";

interface ReminderDateOptionsProps {
  selectedDate: Date;
  androidPicker: ReminderType | null;
  onAndroidPickerChange: (picker: ReminderType | null) => void;
  onDateChange: (date: Date) => void;
  onTimeChange: (date: Date) => void;
  disabled?: boolean;
}

type ReminderDateField = {
  mode: ReminderType;
  label: string;
  value: string;
  onChange: (date: Date) => void;
  minimumDate?: Date;
};

export function ReminderDateOptions({
  selectedDate,
  androidPicker,
  onAndroidPickerChange,
  onDateChange,
  onTimeChange,
  disabled,
}: Readonly<ReminderDateOptionsProps>) {
  const isIos = Platform.OS === "ios";
  const isAndroid = Platform.OS === "android";
  const [iosPicker, setIosPicker] = useState<ReminderType | null>(null);

  if (disabled && iosPicker !== null) {
    setIosPicker(null);
  }

  const fields: ReminderDateField[] = [
    {
      mode: REMINDER_TYPES.DATE,
      label: "Fecha",
      value: formatDate(selectedDate),
      onChange: onDateChange,
      minimumDate: new Date(),
    },
    {
      mode: REMINDER_TYPES.TIME,
      label: "Hora",
      value: formatTime(selectedDate),
      onChange: onTimeChange,
    },
  ];

  const activeIosField = fields.find((field) => field.mode === iosPicker);

  const handleFieldPress = (mode: ReminderType) => {
    if (isAndroid) {
      onAndroidPickerChange(mode);
      return;
    }
    setIosPicker(mode);
  };

  const closeIosPicker = () => setIosPicker(null);

  return (
    <View style={styles.dateSection}>
      <View style={styles.dateRow}>
        {fields.map((field) => (
          <ReminderPickerField
            key={field.mode}
            label={field.label}
            value={field.value}
            onPress={() => handleFieldPress(field.mode)}
            disabled={disabled}
          />
        ))}
      </View>

      {isAndroid &&
        fields.map((field) =>
          androidPicker === field.mode ? (
            <DateTimePicker
              key={field.mode}
              value={selectedDate}
              mode={field.mode}
              minimumDate={field.minimumDate}
              onValueChange={(_, date) => date && field.onChange(date)}
              onDismiss={() => onAndroidPickerChange(null)}
            />
          ) : null,
        )}

      {isIos && !disabled && activeIosField && (
        <ReminderIosPickerSheet
          label={activeIosField.label}
          mode={activeIosField.mode}
          selectedDate={selectedDate}
          minimumDate={activeIosField.minimumDate}
          onChange={activeIosField.onChange}
          onClose={closeIosPicker}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  dateSection: {
    gap: Spacing["space-md"],
  },
  dateRow: {
    flexDirection: "row",
    gap: Spacing["space-sm"],
  },
});
