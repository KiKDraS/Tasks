import { Stack, ThemeProvider } from "expo-router";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ThemedView } from "@/components/themed-view";
import { SplashScreenController } from "@/components/ui/splash-screen-controller";
import {
  BottomTabInset,
  MaxContentWidth,
  NavigationTheme,
  Spacing,
} from "@/constants/theme";
import { SessionProvider, useSession } from "@/context/auth/auth-context";

export default function RootLayout() {
  return (
    <SessionProvider>
      <ThemeProvider value={NavigationTheme}>
        <SplashScreenController />
        <RootNavigator />
      </ThemeProvider>
    </SessionProvider>
  );
}

function RootNavigator() {
  const { session } = useSession();
  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <Stack>
          <Stack.Protected guard={!!session}>
            <Stack.Screen name="(app)" />
          </Stack.Protected>

          <Stack.Protected guard={!session}>
            <Stack.Screen name="sign-in" />
          </Stack.Protected>
        </Stack>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    flexDirection: "row",
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: Spacing["space-lg"],
    alignItems: "center",
    gap: Spacing.gutter,
    paddingBottom: BottomTabInset + Spacing.gutter,
    maxWidth: MaxContentWidth,
  },
});
