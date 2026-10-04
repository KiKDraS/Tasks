import { useSession } from "@/context/auth/auth-context";
import { SplashScreen } from "expo-router";
import { useEffect } from "react";

void SplashScreen.preventAutoHideAsync();

export function SplashScreenController() {
  const { isLoading } = useSession();

  useEffect(() => {
    if (!isLoading) {
      void SplashScreen.hideAsync();
    }
  }, [isLoading]);

  return null;
}
