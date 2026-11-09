import { ThemedText } from "@/components/themed-text";
import { Colors, Rounded, Spacing } from "@/constants/theme";
import type { ReactNode } from "react";
import { StyleSheet, View } from "react-native";

interface AttachmentCardProps {
  icon: ReactNode;
  title: string;
  children: ReactNode;
}

export function AttachmentCard({
  icon,
  title,
  children,
}: Readonly<AttachmentCardProps>) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View
          style={styles.icon}
          accessibilityElementsHidden
          importantForAccessibility="no"
        >
          {icon}
        </View>
        <ThemedText type="label-md">{title}</ThemedText>
      </View>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors["surface-container"],
    borderRadius: Rounded.lg,
    padding: Spacing.gutter,
    gap: Spacing["space-md"],
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing["space-sm"],
  },
  icon: {
    width: 20,
    height: 20,
    alignItems: "center",
    justifyContent: "center",
  },
});
