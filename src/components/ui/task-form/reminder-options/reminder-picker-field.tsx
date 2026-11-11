import { ThemedText } from "@/components/themed-text";
import { AppTouchableOpacity } from "@/components/ui/app-touchable-opacity";
import { Colors, Rounded, Spacing } from "@/constants/theme";
import { StyleSheet } from "react-native";

interface ReminderPickerFieldProps {
  label: string;
  value: string;
  onPress: () => void;
  disabled?: boolean;
}

export function ReminderPickerField({
  label,
  value,
  onPress,
  disabled,
}: Readonly<ReminderPickerFieldProps>) {
  return (
    <AppTouchableOpacity
      style={styles.field}
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityValue={{ text: value }}
      accessibilityHint={disabled ? undefined : "Abre el selector"}
      accessibilityState={{ disabled }}
    >
      <ThemedText type="label-sm" color="on-surface-variant">
        {label}
      </ThemedText>
      <ThemedText type="label-md">{value}</ThemedText>
    </AppTouchableOpacity>
  );
}

const styles = StyleSheet.create({
  field: {
    flex: 1,
    overflow: "hidden",
    gap: Spacing["space-xs"],
    padding: Spacing["space-md"],
    borderRadius: Rounded.md,
    backgroundColor: Colors["surface-variant"],
  },
});
