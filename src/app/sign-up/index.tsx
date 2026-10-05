import { AuthRedirect } from "@/components/ui/auth/auth-redirect";
import { AuthScreen } from "@/components/ui/auth/auth-screen";
import { SignUpForm } from "@/components/ui/sign-up/sign-up-form";
import { router } from "expo-router";

export default function SignUpScreen() {
  const navigateToSignIn = () => {
    router.back();
  };

  return (
    <AuthScreen
      title="Tasks"
      subtitle="Creá tu cuenta"
      footer={
        <AuthRedirect
          question="¿Ya tenés cuenta?"
          linkLabel="Iniciá sesión"
          onPress={navigateToSignIn}
        />
      }
    >
      <SignUpForm />
    </AuthScreen>
  );
}
