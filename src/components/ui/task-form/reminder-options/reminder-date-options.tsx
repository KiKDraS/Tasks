import { Spacing } from "@/constants/theme";
import { REMINDER_TYPES, ReminderType } from "@/context/tasks/types/Reminder";
import { formatDate, formatTime } from "@/utils/date";
import { DateTimePicker } from "@expo/ui/community/datetime-picker";
import { Platform, StyleSheet, View } from "react-native";
import { ReminderPickerField } from "./reminder-picker-field";

interface ReminderDateOptionsProps {
  selectedDate: Date;
  androidPicker: ReminderType | null;
  onAndroidPickerChange: (picker: ReminderType | null) => void;
  onDateChange: (date: Date) => void;
  onTimeChange: (date: Date) => void;
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
}: Readonly<ReminderDateOptionsProps>) {
  const isIos = Platform.OS === "ios";
  const isAndroid = Platform.OS === "android";

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

  return (
    <View style={styles.dateSection}>
      <View style={styles.dateRow}>
        {fields.map((field) => (
          <ReminderPickerField
            key={field.mode}
            label={field.label}
            value={field.value}
            onPress={() => isAndroid && onAndroidPickerChange(field.mode)}
          >
            {isIos && (
              <DateTimePicker
                value={selectedDate}
                mode={field.mode}
                display="compact"
                minimumDate={field.minimumDate}
                onValueChange={(_, date) => date && field.onChange(date)}
                style={styles.nativePickerOverlay}
              />
            )}
          </ReminderPickerField>
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
  nativePickerOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.011,
  },
});
