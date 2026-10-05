import { AUTH_MESSAGES } from "@/context/auth/constants";

export type CredentialValues = {
  user: string;
  password: string;
};

export type CredentialErrors = {
  user?: string;
  password?: string;
};

export function validateCredentials({
  user,
  password,
}: CredentialValues): CredentialErrors {
  const errors: CredentialErrors = {};

  if (!user.trim()) {
    errors.user = AUTH_MESSAGES.userRequired;
  }
  if (!password) {
    errors.password = AUTH_MESSAGES.passwordRequired;
  }

  return errors;
}
