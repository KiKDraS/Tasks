import { useSession } from "@/context/auth/auth-context";
import { SplashScreen } from "expo-router";

SplashScreen.preventAutoHideAsync();

export function SplashScreenController() {
  const { isLoading, session } = useSession();

  console.log("[SplashScreenController] isLoading:", isLoading, "session:", session);

  if (!isLoading) {
    console.log("[SplashScreenController] hiding splash");
    SplashScreen.hide();
  }

  return null;
}
