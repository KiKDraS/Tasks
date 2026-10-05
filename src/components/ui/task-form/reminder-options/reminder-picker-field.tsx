import { ThemedText } from "@/components/themed-text";
import { PressableOpacity } from "@/components/ui/pressable-opacity";
import { Colors, Rounded, Spacing } from "@/constants/theme";
import { PropsWithChildren } from "react";
import { StyleSheet } from "react-native";

interface ReminderPickerFieldProps extends PropsWithChildren {
  label: string;
  value: string;
  onPress?: () => void;
}

export function ReminderPickerField({
  label,
  value,
  onPress,
  children,
}: Readonly<ReminderPickerFieldProps>) {
  return (
    <PressableOpacity style={styles.field} onPress={onPress}>
      <ThemedText type="label-sm" color="on-surface-variant">
        {label}
      </ThemedText>
      <ThemedText type="label-md">{value}</ThemedText>
      {children}
    </PressableOpacity>
  );
}

const styles = StyleSheet.create({
  field: {
    flex: 1,
    position: "relative",
    overflow: "hidden",
    gap: Spacing["space-xs"],
    padding: Spacing["space-md"],
    borderRadius: Rounded.md,
    backgroundColor: Colors["surface-variant"],
  },
});
