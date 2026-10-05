import { type Dispatch } from "react";

export type AuthFormState<Values, Errors> = {
  values: Values;
  errors: Errors;
  isSubmitting: boolean;
  isPasswordVisible: boolean;
};

export type AuthFormAction<
  Values extends Record<string, string>,
  Errors,
> =
  | {
      type: "SET_FIELD";
      payload: { field: keyof Values; value: string };
    }
  | { type: "SET_ERRORS"; payload: Errors }
  | { type: "SET_SUBMITTING"; payload: boolean }
  | { type: "TOGGLE_PASSWORD_VISIBILITY" };

export type AuthFormDispatch<
  Values extends Record<string, string>,
  Errors,
> = Dispatch<AuthFormAction<Values, Errors>>;
