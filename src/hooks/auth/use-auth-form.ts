import { AuthFormDispatch } from "@/context/auth/types/AuthForm";
import {
  authFormReducer,
  createInitialAuthFormState,
  setAuthFormField,
  toggleAuthFormPasswordVisibility,
} from "@/context/auth/utils/auth-form-reducer";
import { AuthFormConfig } from "@/hooks/auth/types/AuthForm";
import { submitAuthForm } from "@/hooks/auth/utils/submit-auth-form";
import { useCallback, useReducer } from "react";

function useAuthFormHandlers<
  Values extends Record<string, string>,
  Errors extends Record<string, string | undefined>,
>(dispatch: AuthFormDispatch<Values, Errors>) {
  const setField = (field: keyof Values, value: string) => {
    setAuthFormField(dispatch, field, value);
  };

  const togglePasswordVisibility = () => {
    toggleAuthFormPasswordVisibility(dispatch);
  };

  return { setField, togglePasswordVisibility };
}

export function useAuthForm<
  Values extends Record<string, string>,
  Errors extends Record<string, string | undefined>,
>({
  initialValues,
  validate,
  submit,
  failureError,
}: AuthFormConfig<Values, Errors>) {
  const [state, dispatch] = useReducer(
    authFormReducer<Values, Errors>,
    initialValues,
    createInitialAuthFormState<Values, Errors>,
  );
  const { setField, togglePasswordVisibility } = useAuthFormHandlers(dispatch);

  const handleSubmit = useCallback(
    () =>
      submitAuthForm({
        values: state.values,
        validate,
        submit,
        failureError,
        dispatch,
      }),
    [dispatch, failureError, state.values, submit, validate],
  );

  return {
    ...state,
    setField,
    togglePasswordVisibility,
    handleSubmit,
  };
}
