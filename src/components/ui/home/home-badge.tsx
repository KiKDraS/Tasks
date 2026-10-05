import { Colors, Rounded, Spacing } from "@/constants/theme";
import { PropsWithChildren } from "react";
import { StyleSheet, View } from "react-native";

export function HomeBadge({ children }: Readonly<PropsWithChildren>) {
  return <View style={styles.container}>{children}</View>;
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
  },
});
