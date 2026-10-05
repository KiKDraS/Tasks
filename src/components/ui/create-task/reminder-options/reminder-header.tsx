import ReminderIcon from "@/components/icons/ReminderIcon";
import { ThemedText } from "@/components/themed-text";
import { Colors, Spacing } from "@/constants/theme";
import { StyleSheet, Switch, View } from "react-native";

interface ReminderHeaderProps {
  enabled: boolean;
  onToggle: (enabled: boolean) => void;
}

export function ReminderHeader({
  enabled,
  onToggle,
}: Readonly<ReminderHeaderProps>) {
  return (
    <View style={styles.header}>
      <View style={styles.titleContainer}>
        <ReminderIcon size={20} color={Colors["on-surface"]} />
        <ThemedText type="label-md">Recordatorio</ThemedText>
      </View>
      <Switch
        value={enabled}
        onValueChange={onToggle}
        trackColor={{
          true: Colors["secondary-container"],
          false: Colors["surface-variant"],
        }}
        thumbColor={enabled ? Colors.secondary : Colors["on-surface-variant"]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing["space-sm"],
  },
});