import { AUTH_MESSAGES } from "@/context/auth/constants";
import { SIGN_UP_MESSAGES } from "@/hooks/sign-up/constants";
import { validateSignUpForm } from "@/hooks/sign-up/utils/validate-sign-up-form";

describe("validateSignUpForm", () => {
  test("requires user, password and confirmation", () => {
    const { errors, isValid } = validateSignUpForm({
      user: "",
      password: "",
      confirmPassword: "",
    });

    expect(errors.user).toBe(AUTH_MESSAGES.userRequired);
    expect(errors.password).toBe(AUTH_MESSAGES.passwordRequired);
    expect(errors.confirmPassword).toBe(
      SIGN_UP_MESSAGES.confirmPasswordRequired,
    );
    expect(isValid).toBe(false);
  });

  test("rejects mismatched passwords", () => {
    const { errors, isValid } = validateSignUpForm({
      user: "Ana",
      password: "1234",
      confirmPassword: "4321",
    });

    expect(errors.confirmPassword).toBe(SIGN_UP_MESSAGES.passwordsDoNotMatch);
    expect(isValid).toBe(false);
  });

  test("accepts a complete registration", () => {
    const { errors, isValid } = validateSignUpForm({
      user: "Ana",
      password: "1234",
      confirmPassword: "1234",
    });

    expect(errors).toEqual({});
    expect(isValid).toBe(true);
  });
});
