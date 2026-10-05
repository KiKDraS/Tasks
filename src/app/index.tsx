import { AuthRedirect } from "@/components/ui/auth/auth-redirect";
import { AuthScreen } from "@/components/ui/auth/auth-screen";
import { SignInForm } from "@/components/ui/sign-in/sign-in-form";
import { ROUTES } from "@/constants/routes";
import { router } from "expo-router";

export default function SignInScreen() {
  const navigateToSignUp = () => {
    router.push(ROUTES.signUp);
  };

  return (
    <AuthScreen
      title="Tasks"
      subtitle="Ingresar a tu lista de tareas"
      footer={
        <AuthRedirect
          question="¿No tenés cuenta?"
          linkLabel="Registrate"
          onPress={navigateToSignUp}
        />
      }
    >
      <SignInForm />
    </AuthScreen>
  );
}
