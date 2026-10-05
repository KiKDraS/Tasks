import { PressableOpacity } from "@/components/ui/pressable-opacity";
import { Colors, Rounded, Spacing } from "@/constants/theme";
import { PropsWithChildren } from "react";
import { StyleSheet, type PressableProps } from "react-native";

interface OptionChipProps extends PropsWithChildren {
  selected: boolean;
  onPress: () => void;
  style?: PressableProps["style"];
}

export function OptionChip({
  selected,
  onPress,
  style,
  children,
}: Readonly<OptionChipProps>) {
  return (
    <PressableOpacity
      onPress={onPress}
      style={(state) => [
        styles.chip,
        selected && styles.chipSelected,
        typeof style === "function" ? style(state) : style,
      ]}
    >
      {children}
    </PressableOpacity>
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
