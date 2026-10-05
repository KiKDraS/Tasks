import { useSession } from "@/context/auth/auth-context";
import { useAuthForm } from "@/hooks/auth/use-auth-form";
import { SIGN_UP_MESSAGES } from "@/hooks/sign-up/constants";
import {
  SignUpFormErrors,
  SignUpFormValues,
} from "@/hooks/sign-up/types/SignUpForm";
import { validateSignUpForm } from "@/hooks/sign-up/utils/validate-sign-up-form";
import { useCallback } from "react";

const initialValues: SignUpFormValues = {
  user: "",
  password: "",
  confirmPassword: "",
};

const failureError: SignUpFormErrors = {
  form: SIGN_UP_MESSAGES.userAlreadyExists,
};

export function useSignUpForm() {
  const { registerUser } = useSession();

  const submit = useCallback(
    (values: SignUpFormValues) =>
      registerUser({ user: values.user.trim(), password: values.password }),
    [registerUser],
  );

  return useAuthForm({
    initialValues,
    validate: validateSignUpForm,
    submit,
    failureError,
  });
}
