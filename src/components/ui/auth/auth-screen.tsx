import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Spacing } from "@/constants/theme";
import { type ReactNode } from "react";
import { StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const VERTICAL_PADDING = 24;

interface AuthScreenProps {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer: ReactNode;
}

export function AuthScreen({
  title,
  subtitle,
  children,
  footer,
}: Readonly<AuthScreenProps>) {
  const insets = useSafeAreaInsets();

  return (
    <ThemedView
      style={[
        styles.container,
        {
          paddingTop: insets.top + VERTICAL_PADDING,
          paddingBottom: insets.bottom + VERTICAL_PADDING,
        },
      ]}
    >
      <View style={styles.header}>
        <ThemedText type="display" style={styles.title}>
          {title}
        </ThemedText>
        <ThemedText type="headline-md" color="secondary" style={styles.subtitle}>
          {subtitle}
        </ThemedText>
      </View>
      <View style={styles.content}>{children}</View>
      {footer}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: Spacing.gutter,
    gap: Spacing["space-lg"],
  },
  content: {
    flex: 1,
    gap: Spacing.gutter,
    paddingTop: Spacing.margin,
  },
  header: {
    gap: Spacing["space-lg"],
  },
  title: {
    textAlign: "center",
  },
  subtitle: {
    textAlign: "center",
    fontWeight: 400,
  },
});
