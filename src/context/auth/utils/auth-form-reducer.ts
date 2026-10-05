import { AUTH_FORM_ACTION_TYPES } from "@/context/auth/constants";
import {
  AuthFormAction,
  AuthFormDispatch,
  AuthFormState,
} from "@/context/auth/types/AuthForm";

function updateField<Values extends Record<string, string>>(
  values: Values,
  field: keyof Values,
  value: string,
): Values {
  return { ...values, [field]: value } as Values;
}

function clearFieldError<Errors extends Record<string, string | undefined>>(
  errors: Errors,
  field: string,
): Errors {
  return { ...errors, [field]: undefined, form: undefined } as Errors;
}

export function createInitialAuthFormState<
  Values,
  Errors extends Record<string, string | undefined>,
>(values: Values): AuthFormState<Values, Errors> {
  return {
    values,
    errors: {} as Errors,
    isSubmitting: false,
    isPasswordVisible: false,
  };
}

export function authFormReducer<
  Values extends Record<string, string>,
  Errors extends Record<string, string | undefined>,
>(
  state: AuthFormState<Values, Errors>,
  action: AuthFormAction<Values, Errors>,
): AuthFormState<Values, Errors> {
  switch (action.type) {
    case AUTH_FORM_ACTION_TYPES.SET_FIELD:
      return {
        ...state,
        values: updateField(
          state.values,
          action.payload.field,
          action.payload.value,
        ),
        errors: clearFieldError(
          state.errors,
          String(action.payload.field),
        ),
      };
    case AUTH_FORM_ACTION_TYPES.SET_ERRORS:
      return { ...state, errors: action.payload };
    case AUTH_FORM_ACTION_TYPES.SET_SUBMITTING:
      return { ...state, isSubmitting: action.payload };
    case AUTH_FORM_ACTION_TYPES.TOGGLE_PASSWORD_VISIBILITY:
      return { ...state, isPasswordVisible: !state.isPasswordVisible };
    default:
      return state;
  }
}

export const setAuthFormField = <
  Values extends Record<string, string>,
  Errors extends Record<string, string | undefined>,
>(
  dispatch: AuthFormDispatch<Values, Errors>,
  field: keyof Values,
  value: string,
): void => {
  dispatch({
    type: AUTH_FORM_ACTION_TYPES.SET_FIELD,
    payload: { field, value },
  });
};

export const setAuthFormErrors = <
  Values extends Record<string, string>,
  Errors extends Record<string, string | undefined>,
>(
  dispatch: AuthFormDispatch<Values, Errors>,
  errors: Errors,
): void => {
  dispatch({ type: AUTH_FORM_ACTION_TYPES.SET_ERRORS, payload: errors });
};

export const setAuthFormSubmitting = <
  Values extends Record<string, string>,
  Errors extends Record<string, string | undefined>,
>(
  dispatch: AuthFormDispatch<Values, Errors>,
  isSubmitting: boolean,
): void => {
  dispatch({
    type: AUTH_FORM_ACTION_TYPES.SET_SUBMITTING,
    payload: isSubmitting,
  });
};

export const toggleAuthFormPasswordVisibility = <
  Values extends Record<string, string>,
  Errors extends Record<string, string | undefined>,
>(
  dispatch: AuthFormDispatch<Values, Errors>,
): void => {
  dispatch({ type: AUTH_FORM_ACTION_TYPES.TOGGLE_PASSWORD_VISIBILITY });
};
