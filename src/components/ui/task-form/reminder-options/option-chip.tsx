import { AppTouchableOpacity } from "@/components/ui/app-touchable-opacity";
import { Colors, Rounded, Spacing } from "@/constants/theme";
import { PropsWithChildren } from "react";
import { StyleSheet, type TouchableOpacityProps } from "react-native";

interface OptionChipProps extends PropsWithChildren {
  selected: boolean;
  onPress: () => void;
  style?: TouchableOpacityProps["style"];
}

export function OptionChip({
  selected,
  onPress,
  style,
  children,
}: Readonly<OptionChipProps>) {
  return (
    <AppTouchableOpacity
      onPress={onPress}
      style={[styles.chip, selected && styles.chipSelected, style]}
    >
      {children}
    </AppTouchableOpacity>
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
