import { Colors, Rounded, Spacing } from "@/constants/theme";
import { PropsWithChildren } from "react";
import { Pressable, StyleSheet, type StyleProp, type ViewStyle } from "react-native";

interface OptionChipProps extends PropsWithChildren {
  selected: boolean;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
}

export function OptionChip({
  selected,
  onPress,
  style,
  children,
}: Readonly<OptionChipProps>) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.chip, selected && styles.chipSelected, style]}
    >
      {children}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: Spacing["space-md"],
    paddingVertical: Spacing["space-sm"],
    borderRadius: Rounded.full,
    backgroundColor: Colors["surface-variant"],
  },
  chipSelected: {
    backgroundColor: Colors["secondary-container"],
  },
});
