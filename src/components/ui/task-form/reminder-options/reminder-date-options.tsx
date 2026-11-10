import { ThemedText } from "@/components/themed-text";
import { FormButton } from "@/components/ui/form/form-button";
import { Colors, Spacing } from "@/constants/theme";
import { REMINDER_TYPES, ReminderType } from "@/context/tasks/types/Reminder";
import { formatDate, formatTime } from "@/utils/date";
import { DateTimePicker } from "@expo/ui/community/datetime-picker";
import { useState } from "react";
import { Modal, Platform, StyleSheet, View } from "react-native";
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
  const isIosPickerVisible = isIos && !disabled && activeIosField !== undefined;

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

      {isIosPickerVisible && activeIosField && (
        <Modal presentationStyle="pageSheet" onRequestClose={closeIosPicker} visible>
          <View style={styles.sheet}>
            <ThemedText type="headline-md">{activeIosField.label}</ThemedText>
            <DateTimePicker
              value={selectedDate}
              mode={activeIosField.mode}
              display={
                activeIosField.mode === REMINDER_TYPES.DATE
                  ? "inline"
                  : "spinner"
              }
              minimumDate={activeIosField.minimumDate}
              onValueChange={(_, date) => date && activeIosField.onChange(date)}
            />
            <FormButton onPress={closeIosPicker}>Listo</FormButton>
          </View>
        </Modal>
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
  sheet: {
    flex: 1,
    gap: Spacing["space-lg"],
    padding: Spacing.margin,
    backgroundColor: Colors.surface,
  },
});
