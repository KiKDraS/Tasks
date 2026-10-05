import { PressableOpacity } from "@/components/ui/pressable-opacity";
import { Colors, Rounded } from "@/constants/theme";
import { Image } from "expo-image";
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
        <Image
          source={require("@/assets/images/icon.png")}
          style={styles.completeCheckTask}
          contentFit="contain"
        />
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
