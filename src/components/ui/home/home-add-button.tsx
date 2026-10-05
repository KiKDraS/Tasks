import AddIcon from "@/components/icons/AddIcon";
import { PressableOpacity } from "@/components/ui/pressable-opacity";
import { ROUTES } from "@/constants/routes";
import { Colors, Rounded, setShadow } from "@/constants/theme";
import { router } from "expo-router";
import { StyleSheet } from "react-native";

const FAB_SIZE = 42;
const FAB_OFFSET = 24;

export function HomeAddButton() {
  const navigateToTaskForm = () => {
    router.push(ROUTES.taskForm);
  };

  return (
    <PressableOpacity onPress={navigateToTaskForm} style={styles.button}>
      <AddIcon size={FAB_SIZE} color={Colors["on-primary"]} />
    </PressableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    width: FAB_SIZE,
    height: FAB_SIZE,
    backgroundColor: Colors["primary-container"],
    borderRadius: Rounded.full,
    position: "absolute",
    bottom: FAB_OFFSET,
    right: FAB_OFFSET,
    zIndex: 1000,
    elevation: 5,
    ...setShadow("primary-container"),
  },
});
