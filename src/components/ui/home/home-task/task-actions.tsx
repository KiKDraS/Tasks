import DeleteIcon from "@/components/icons/DeleteIcon";
import EditIcon from "@/components/icons/EditIcon";
import { AppTouchableOpacity } from "@/components/ui/app-touchable-opacity";
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
      <AppTouchableOpacity onPress={onEdit}>
        <EditIcon
          size={ACTION_ICON_SIZE}
          color={Colors["on-surface-variant"]}
        />
      </AppTouchableOpacity>
      <AppTouchableOpacity onPress={onDelete}>
        <DeleteIcon size={ACTION_ICON_SIZE} color={Colors.error} />
      </AppTouchableOpacity>
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
