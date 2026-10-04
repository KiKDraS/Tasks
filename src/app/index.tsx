import { useSession } from "@/context/auth/auth-context";
import { router } from "expo-router";
import { Text, View } from "react-native";

export default function SignInScreen() {
  const { signIn } = useSession();
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text
        onPress={() => {
          // signIn();
          // Navigate after signing in. You may want to tweak this to ensure sign-in is
          // successful before navigating.
          router.replace("/(login)");
        }}
      >
        Ya tienes una cuenta? Inicia sesión
      </Text>
    </View>
  );
}
