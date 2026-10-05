import { useSession } from "@/context/auth/auth-context";
import { useAuthForm } from "@/hooks/auth/use-auth-form";
import { SIGN_IN_MESSAGES } from "@/hooks/sign-in/constants";
import {
  SignInFormErrors,
  SignInFormValues,
} from "@/hooks/sign-in/types/SignInForm";
import { validateSignInForm } from "@/hooks/sign-in/utils/validate-sign-in-form";
import { useCallback } from "react";

const initialValues: SignInFormValues = {
  user: "",
  password: "",
};

const failureError: SignInFormErrors = {
  form: SIGN_IN_MESSAGES.invalidCredentials,
};

export function useSignInForm() {
  const { signIn } = useSession();

  const submit = useCallback(
    (values: SignInFormValues) =>
      signIn({ user: values.user.trim(), password: values.password }),
    [signIn],
  );

  return useAuthForm({
    initialValues,
    validate: validateSignInForm,
    submit,
    failureError,
  });
}
