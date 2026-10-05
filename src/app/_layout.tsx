import { Stack, ThemeProvider } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { SplashScreenController } from "@/components/splash-screen-controller";
import { NavigationTheme } from "@/constants/theme";
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

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Protected guard={!!session}>
        <Stack.Screen name="(tabs)" />
      </Stack.Protected>

      <Stack.Protected guard={!session}>
        <Stack.Screen name="index" />
        <Stack.Screen name="sign-up" />
      </Stack.Protected>
    </Stack>
  );
}
