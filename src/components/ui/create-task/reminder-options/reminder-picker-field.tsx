import { ThemedText } from "@/components/themed-text";
import { Colors, Rounded, Spacing } from "@/constants/theme";
import { PropsWithChildren } from "react";
import { Pressable, StyleSheet } from "react-native";

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
    <Pressable style={styles.field} onPress={onPress}>
      <ThemedText type="label-sm" color="on-surface-variant">
        {label}
      </ThemedText>
      <ThemedText type="label-md">{value}</ThemedText>
      {children}
    </Pressable>
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
