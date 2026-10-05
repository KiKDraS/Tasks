import { Spacing } from "@/constants/theme";
import { REMINDER_TYPES, ReminderType } from "@/hooks/create-task/types/Reminder";
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

export function ReminderDateOptions({
  selectedDate,
  androidPicker,
  onAndroidPickerChange,
  onDateChange,
  onTimeChange,
}: Readonly<ReminderDateOptionsProps>) {
  const isIos = Platform.OS === "ios";
  const isAndroid = Platform.OS === "android";

  return (
    <View style={styles.dateSection}>
      <View style={styles.dateRow}>
        <ReminderPickerField
          label="Fecha"
          value={formatDate(selectedDate)}
          onPress={() => isAndroid && onAndroidPickerChange(REMINDER_TYPES.DATE)}
        >
          {isIos && (
            <DateTimePicker
              value={selectedDate}
              mode="date"
              display="compact"
              minimumDate={new Date()}
              onValueChange={(_, date) => date && onDateChange(date)}
              style={styles.nativePickerOverlay}
            />
          )}
        </ReminderPickerField>

        <ReminderPickerField
          label="Hora"
          value={formatTime(selectedDate)}
          onPress={() => isAndroid && onAndroidPickerChange(REMINDER_TYPES.TIME)}
        >
          {isIos && (
            <DateTimePicker
              value={selectedDate}
              mode="time"
              display="compact"
              onValueChange={(_, date) => date && onTimeChange(date)}
              style={styles.nativePickerOverlay}
            />
          )}
        </ReminderPickerField>
      </View>

      {isAndroid && androidPicker === REMINDER_TYPES.DATE && (
        <DateTimePicker
          value={selectedDate}
          mode="date"
          minimumDate={new Date()}
          onValueChange={(_, date) => date && onDateChange(date)}
          onDismiss={() => onAndroidPickerChange(null)}
        />
      )}
      {isAndroid && androidPicker === REMINDER_TYPES.TIME && (
        <DateTimePicker
          value={selectedDate}
          mode="time"
          onValueChange={(_, date) => date && onTimeChange(date)}
          onDismiss={() => onAndroidPickerChange(null)}
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
  nativePickerOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.011,
  },
});
