import { AuthFormDispatch } from "@/context/auth/types/AuthForm";

export type AuthFormValidator<Values, Errors> = (values: Values) => {
  errors: Errors;
  isValid: boolean;
};

export type AuthFormSubmitter<Values> = (values: Values) => Promise<boolean>;

export interface AuthFormConfig<
  Values extends Record<string, string>,
  Errors extends Record<string, string | undefined>,
> {
  initialValues: Values;
  validate: AuthFormValidator<Values, Errors>;
  submit: AuthFormSubmitter<Values>;
  failureError: Errors;
}

export interface AuthFormSubmission<
  Values extends Record<string, string>,
  Errors extends Record<string, string | undefined>,
> extends Omit<AuthFormConfig<Values, Errors>, "initialValues"> {
  values: Values;
  dispatch: AuthFormDispatch<Values, Errors>;
}
