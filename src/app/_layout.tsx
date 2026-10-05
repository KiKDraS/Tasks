import { Stack, ThemeProvider } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { SplashScreenController } from "@/components/splash-screen-controller";
import { NavigationTheme } from "@/constants/theme";
import { SessionProvider } from "@/context/auth/auth-context";

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
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
}
