import {
  setAuthFormErrors,
  setAuthFormSubmitting,
} from "@/context/auth/utils/auth-form-reducer";
import { AuthFormSubmission } from "@/hooks/auth/types/AuthForm";

type ValidationStep<
  Values extends Record<string, string>,
  Errors extends Record<string, string | undefined>,
> = Pick<AuthFormSubmission<Values, Errors>, "dispatch" | "validate" | "values">;

type SubmissionStep<
  Values extends Record<string, string>,
  Errors extends Record<string, string | undefined>,
> = Pick<AuthFormSubmission<Values, Errors>, "dispatch" | "submit" | "values">;

function applyValidation<
  Values extends Record<string, string>,
  Errors extends Record<string, string | undefined>,
>({ dispatch, validate, values }: ValidationStep<Values, Errors>): boolean {
  const { errors, isValid } = validate(values);
  setAuthFormErrors(dispatch, errors);

  return isValid;
}

async function runSubmission<
  Values extends Record<string, string>,
  Errors extends Record<string, string | undefined>,
>({
  dispatch,
  submit,
  values,
}: SubmissionStep<Values, Errors>): Promise<boolean> {
  setAuthFormSubmitting(dispatch, true);
  const isSuccess = await submit(values);
  setAuthFormSubmitting(dispatch, false);

  return isSuccess;
}

export async function submitAuthForm<
  Values extends Record<string, string>,
  Errors extends Record<string, string | undefined>,
>({
  values,
  validate,
  submit,
  failureError,
  dispatch,
}: AuthFormSubmission<Values, Errors>): Promise<void> {
  if (!applyValidation({ dispatch, validate, values })) {
    return;
  }

  const isSuccess = await runSubmission({ dispatch, submit, values });
  if (!isSuccess) {
    setAuthFormErrors(dispatch, failureError);
  }
}
