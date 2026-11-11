import DeleteIcon from "@/components/icons/DeleteIcon";
import EditIcon from "@/components/icons/EditIcon";
import ShareIcon from "@/components/icons/ShareIcon";
import { AppTouchableOpacity } from "@/components/ui/app-touchable-opacity";
import { Colors } from "@/constants/theme";
import { StyleSheet, View } from "react-native";

const ACTION_ICON_SIZE = 22;
const ACTION_HIT_SIZE = 48;

interface TaskActionsProps {
  title: string;
  onEdit: () => void;
  onShare: () => void;
  onDelete: () => void;
}

export function TaskActions({
  title,
  onEdit,
  onShare,
  onDelete,
}: Readonly<TaskActionsProps>) {
  return (
    <View style={styles.actions}>
      <AppTouchableOpacity
        onPress={onEdit}
        accessibilityRole="button"
        accessibilityLabel={`Editar ${title}`}
        style={styles.action}
      >
        <EditIcon
          size={ACTION_ICON_SIZE}
          color={Colors["on-surface-variant"]}
        />
      </AppTouchableOpacity>
      <AppTouchableOpacity
        onPress={onShare}
        accessibilityRole="button"
        accessibilityLabel={`Compartir ${title}`}
        style={styles.action}
      >
        <ShareIcon
          size={ACTION_ICON_SIZE}
          color={Colors["on-surface-variant"]}
        />
      </AppTouchableOpacity>
      <AppTouchableOpacity
        onPress={onDelete}
        accessibilityRole="button"
        accessibilityLabel={`Eliminar ${title}`}
        style={styles.action}
      >
        <DeleteIcon size={ACTION_ICON_SIZE} color={Colors.error} />
      </AppTouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  actions: {
    flexDirection: "row",
    alignItems: "center",
  },
  action: {
    width: ACTION_HIT_SIZE,
    height: ACTION_HIT_SIZE,
    alignItems: "center",
    justifyContent: "center",
  },
});
