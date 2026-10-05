import { AppIcon } from "@/components/icons/AppIcon";
import { PressableOpacity } from "@/components/ui/pressable-opacity";
import { Colors, Rounded } from "@/constants/theme";
import { StyleSheet, View } from "react-native";

const CHECKBOX_SIZE = 24;

interface TaskCheckboxProps {
  isComplete: boolean;
  onToggle: () => void;
}

export function TaskCheckbox({
  isComplete,
  onToggle,
}: Readonly<TaskCheckboxProps>) {
  return (
    <PressableOpacity onPress={onToggle}>
      {isComplete ? (
        <AppIcon style={styles.completeCheckTask} />
      ) : (
        <View style={styles.incompleteCheckTask} />
      )}
    </PressableOpacity>
  );
}

const styles = StyleSheet.create({
  incompleteCheckTask: {
    width: CHECKBOX_SIZE,
    height: CHECKBOX_SIZE,
    backgroundColor: Colors["surface-variant"],
    borderRadius: Rounded.md,
  },
  completeCheckTask: {
    width: CHECKBOX_SIZE,
    height: CHECKBOX_SIZE,
  },
});
