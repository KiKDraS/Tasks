import { ThemedText } from "@/components/themed-text";
import { AppTouchableOpacity } from "@/components/ui/app-touchable-opacity";
import { Colors, Rounded, Spacing } from "@/constants/theme";
import { PropsWithChildren } from "react";
import { StyleSheet, View } from "react-native";

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
    <View style={styles.field}>
      <AppTouchableOpacity style={styles.fieldContent} onPress={onPress}>
        <ThemedText type="label-sm" color="on-surface-variant">
          {label}
        </ThemedText>
        <ThemedText type="label-md">{value}</ThemedText>
      </AppTouchableOpacity>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  field: {
    flex: 1,
    overflow: "hidden",
    borderRadius: Rounded.md,
    backgroundColor: Colors["surface-variant"],
  },
  fieldContent: {
    gap: Spacing["space-xs"],
    padding: Spacing["space-md"],
  },
});
