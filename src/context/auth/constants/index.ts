import type { AuthFormAction } from "@/context/auth/types/AuthForm";

export const AUTH_MESSAGES = {
  signOut: "Cerrar sesión",
  userMenu: "Menú de usuario",
  userRequired: "Ingresá tu usuario",
  passwordRequired: "Ingresá tu contraseña",
  showPassword: "Mostrar contraseña",
  hidePassword: "Ocultar contraseña",
} as const;

export const AUTH_MENU_ACTION_IDS = {
  account: "account",
  signOut: "sign-out",
} as const;

type AuthFormActionType = AuthFormAction<Record<string, string>, never>["type"];

export const AUTH_FORM_ACTION_TYPES = {
  SET_FIELD: "SET_FIELD",
  SET_ERRORS: "SET_ERRORS",
  SET_SUBMITTING: "SET_SUBMITTING",
  TOGGLE_PASSWORD_VISIBILITY: "TOGGLE_PASSWORD_VISIBILITY",
} as const satisfies Record<AuthFormActionType, AuthFormActionType>;
