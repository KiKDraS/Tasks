import { validateCredentials } from "@/context/auth/utils/validate-credentials";
import { SIGN_UP_MESSAGES } from "@/hooks/sign-up/constants";
import {
  SignUpFormErrors,
  SignUpFormValues,
} from "@/hooks/sign-up/types/SignUpForm";

export function validateSignUpForm(values: SignUpFormValues) {
  const errors: SignUpFormErrors = validateCredentials(values);

  if (!values.confirmPassword) {
    errors.confirmPassword = SIGN_UP_MESSAGES.confirmPasswordRequired;
  } else if (values.confirmPassword !== values.password) {
    errors.confirmPassword = SIGN_UP_MESSAGES.passwordsDoNotMatch;
  }

  return { errors, isValid: Object.keys(errors).length === 0 };
}
