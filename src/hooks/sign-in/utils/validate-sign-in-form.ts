import { validateCredentials } from "@/context/auth/utils/validate-credentials";
import {
  SignInFormErrors,
  SignInFormValues,
} from "@/hooks/sign-in/types/SignInForm";

export function validateSignInForm(values: SignInFormValues) {
  const errors: SignInFormErrors = validateCredentials(values);

  return { errors, isValid: Object.keys(errors).length === 0 };
}
