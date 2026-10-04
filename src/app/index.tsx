import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useSession } from "@/context/auth/auth-context";
import { router } from "expo-router";
import { useEffect } from "react";

export default function SignInScreen() {
  const { signIn } = useSession();

  useEffect(() => {
    router.replace("/(tabs)");
  }, []);

  return (
    <ThemedView>
      <ThemedText
        type="headline-md"
        onPress={() => {
          // signIn();
          router.replace("/login");
        }}
      >
        Ya tienes una cuenta? Inicia sesión
      </ThemedText>
    </ThemedView>
  );
}
