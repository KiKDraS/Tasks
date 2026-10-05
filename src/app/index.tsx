import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { ROUTES } from "@/constants/routes";
import { router } from "expo-router";
import { useEffect } from "react";

export default function SignInScreen() {
  useEffect(() => {
    router.replace(ROUTES.tabs);
  }, []);

  return (
    <ThemedView>
      <ThemedText
        type="headline-md"
        onPress={() => {
          router.replace(ROUTES.login);
        }}
      >
        Ya tienes una cuenta? Inicia sesión
      </ThemedText>
    </ThemedView>
  );
}
