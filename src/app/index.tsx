import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { router } from "expo-router";
import { useEffect } from "react";

export default function SignInScreen() {
  useEffect(() => {
    router.replace("/(tabs)");
  }, []);

  return (
    <ThemedView>
      <ThemedText
        type="headline-md"
        onPress={() => {
          router.replace("/login");
        }}
      >
        Ya tienes una cuenta? Inicia sesión
      </ThemedText>
    </ThemedView>
  );
}
