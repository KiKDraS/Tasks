import { ThemedText } from "@/components/themed-text";
import { Colors, Spacing } from "@/constants/theme";
import type { ReactNode } from "react";
import { Pressable, StyleSheet, Switch, View } from "react-native";

interface ScheduleToggleRowProps {
  label: string;
  icon?: ReactNode;
  value: boolean;
  disabled: boolean;
  onValueChange: () => void;
}

export function ScheduleToggleRow({
  label,
  icon,
  value,
  disabled,
  onValueChange,
}: Readonly<ScheduleToggleRowProps>) {
  return (
    <Pressable
      style={styles.row}
      onPress={onValueChange}
      disabled={disabled}
      accessibilityRole="switch"
      accessibilityState={{ checked: value, disabled }}
      accessibilityLabel={label}
    >
      {icon ? (
        <View
          style={styles.icon}
          accessibilityElementsHidden
          importantForAccessibility="no-hide-descendants"
        >
          {icon}
        </View>
      ) : null}
      <ThemedText
        type="body-md"
        style={styles.label}
        accessible={false}
        importantForAccessibility="no"
      >
        {label}
      </ThemedText>
      <View
        pointerEvents="none"
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
      >
        <Switch
          value={value}
          disabled={disabled}
          accessible={false}
          trackColor={{
            true: Colors["secondary-container"],
            false: Colors["surface-variant"],
          }}
          thumbColor={value ? Colors.secondary : Colors["on-surface-variant"]}
        />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    minHeight: 48,
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing["space-md"],
  },
  icon: {
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    flex: 1,
  },
});
