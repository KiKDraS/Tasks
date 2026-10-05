import {
  authFormReducer,
  createInitialAuthFormState,
} from "@/context/auth/utils/auth-form-reducer";
import {
  SignInFormErrors,
  SignInFormValues,
} from "@/hooks/sign-in/types/SignInForm";

const reducer = authFormReducer<SignInFormValues, SignInFormErrors>;
const initialState = createInitialAuthFormState<
  SignInFormValues,
  SignInFormErrors
>({
  user: "",
  password: "",
});

describe("authFormReducer", () => {
  test("SET_FIELD updates the typed value", () => {
    const state = reducer(initialState, {
      type: "SET_FIELD",
      payload: { field: "user", value: "Ana" },
    });

    expect(state.values.user).toBe("Ana");
  });

  test("SET_FIELD clears the field error and the form error", () => {
    const stateWithErrors = {
      ...initialState,
      errors: {
        user: "Ingresá tu usuario",
        form: "Usuario o contraseña incorrectos",
      },
    };

    const state = reducer(stateWithErrors, {
      type: "SET_FIELD",
      payload: { field: "user", value: "Ana" },
    });

    expect(state.errors.user).toBeUndefined();
    expect(state.errors.form).toBeUndefined();
  });

  test("TOGGLE_PASSWORD_VISIBILITY flips the flag", () => {
    const state = reducer(initialState, {
      type: "TOGGLE_PASSWORD_VISIBILITY",
    });

    expect(state.isPasswordVisible).toBe(true);
  });
});
