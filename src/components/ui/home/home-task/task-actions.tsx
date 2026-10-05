import DeleteIcon from "@/components/icons/DeleteIcon";
import EditIcon from "@/components/icons/EditIcon";
import { PressableOpacity } from "@/components/ui/pressable-opacity";
import { Colors, Spacing } from "@/constants/theme";
import { StyleSheet, View } from "react-native";

const ACTION_ICON_SIZE = 22;

interface TaskActionsProps {
  onEdit: () => void;
  onDelete: () => void;
}

export function TaskActions({ onEdit, onDelete }: Readonly<TaskActionsProps>) {
  return (
    <View style={styles.actions}>
      <PressableOpacity onPress={onEdit}>
        <EditIcon
          size={ACTION_ICON_SIZE}
          color={Colors["on-surface-variant"]}
        />
      </PressableOpacity>
      <PressableOpacity onPress={onDelete}>
        <DeleteIcon size={ACTION_ICON_SIZE} color={Colors.error} />
      </PressableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  actions: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing["space-md"],
  },
});
