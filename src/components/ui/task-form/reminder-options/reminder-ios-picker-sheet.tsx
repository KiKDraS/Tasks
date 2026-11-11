import { ThemedText } from "@/components/themed-text";
import { FormButton } from "@/components/ui/form/form-button";
import { Colors, Spacing } from "@/constants/theme";
import { REMINDER_TYPES, ReminderType } from "@/context/tasks/types/Reminder";
import { DateTimePicker } from "@expo/ui/community/datetime-picker";
import { Modal, StyleSheet, View } from "react-native";

interface ReminderIosPickerSheetProps {
  label: string;
  mode: ReminderType;
  selectedDate: Date;
  minimumDate?: Date;
  onChange: (date: Date) => void;
  onClose: () => void;
}

export function ReminderIosPickerSheet({
  label,
  mode,
  selectedDate,
  minimumDate,
  onChange,
  onClose,
}: Readonly<ReminderIosPickerSheetProps>) {
  const display = mode === REMINDER_TYPES.DATE ? "inline" : "spinner";

  return (
    <Modal
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
      visible
    >
      <View style={styles.sheet}>
        <ThemedText type="headline-md" accessibilityRole="header">
          {label}
        </ThemedText>
        <DateTimePicker
          value={selectedDate}
          mode={mode}
          display={display}
          minimumDate={minimumDate}
          onValueChange={(_, date) => date && onChange(date)}
        />
        <FormButton onPress={onClose}>Listo</FormButton>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  sheet: {
    flex: 1,
    gap: Spacing["space-lg"],
    padding: Spacing.margin,
    backgroundColor: Colors.surface,
  },
});
