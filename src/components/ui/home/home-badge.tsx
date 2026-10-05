import { ThemedText } from "@/components/themed-text";
import { Colors, Rounded, Spacing } from "@/constants/theme";
import { PropsWithChildren } from "react";
import { StyleSheet, View } from "react-native";

interface HomeBadgeProps extends PropsWithChildren {
  isComplete?: boolean;
}

export function HomeBadge({ children, isComplete }: Readonly<HomeBadgeProps>) {
  return (
    <View style={styles.container}>
      {isComplete ? (
        <ThemedText type="label-sm">Completed</ThemedText>
      ) : (
        children
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing["space-xs"],
    padding: Spacing["space-xs"],
    borderRadius: Rounded.md,
    backgroundColor: Colors["secondary-container"],
    color: Colors["on-secondary-container"],
  },
});
