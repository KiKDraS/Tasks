import { Colors, Rounded, setShadow, Spacing } from "@/constants/theme";
import { PropsWithChildren } from "react";
import { StyleSheet, View } from "react-native";

interface TaskCardProps extends PropsWithChildren {
  isComplete: boolean;
}

export function TaskCard({ isComplete, children }: Readonly<TaskCardProps>) {
  return (
    <View style={[styles.container, isComplete && styles.completeContainer]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: Spacing.gutter,
    borderRadius: Rounded.md,
    backgroundColor: Colors.surface,
    gap: Spacing["space-lg"],
    ...setShadow("on-primary-container"),
  },
  completeContainer: {
    shadowColor: "transparent",
    borderColor: Colors["surface-variant"],
    borderWidth: 1,
    backgroundColor: Colors["surface-variant"],
  },
});
