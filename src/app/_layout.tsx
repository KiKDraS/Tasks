import { Stack, ThemeProvider } from "expo-router";
import { StyleSheet } from "react-native";
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

import { ThemedView } from "@/components/themed-view";
import { SplashScreenController } from "@/components/ui/splash-screen-controller";
import { MaxContentWidth, NavigationTheme, Spacing } from "@/constants/theme";
import { SessionProvider, useSession } from "@/context/auth/auth-context";

export default function RootLayout() {
  return (
    <SessionProvider>
      <ThemeProvider value={NavigationTheme}>
        <SafeAreaProvider>
          <SplashScreenController />
          <RootNavigator />
        </SafeAreaProvider>
      </ThemeProvider>
    </SessionProvider>
  );
}

function RootNavigator() {
  const { session } = useSession();
  const insets = useSafeAreaInsets();

  return (
    <ThemedView
      style={{
        ...styles.container,
        paddingBottom: insets.bottom,
        paddingTop: insets.top,
      }}
    >
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Protected guard={!!session}>
          <Stack.Screen name="(app)" />
        </Stack.Protected>

        <Stack.Protected guard={!session}>
          <Stack.Screen name="index" />
          <Stack.Screen name="(login)" />
        </Stack.Protected>
      </Stack>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    flexDirection: "row",
    paddingHorizontal: Spacing["space-lg"],
    gap: Spacing.gutter,
    maxWidth: MaxContentWidth,
  },
});
