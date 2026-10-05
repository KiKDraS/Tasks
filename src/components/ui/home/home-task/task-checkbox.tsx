import { AppIcon } from "@/components/icons/AppIcon";
import { AppTouchableOpacity } from "@/components/ui/app-touchable-opacity";
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
    <AppTouchableOpacity onPress={onToggle}>
      {isComplete ? (
        <AppIcon style={styles.completeCheckTask} />
      ) : (
        <View style={styles.incompleteCheckTask} />
      )}
    </AppTouchableOpacity>
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
