import { ThemedText } from "@/components/themed-text";
import { PasswordVisibilityToggle } from "@/components/ui/auth/password-visibility-toggle";
import { FormButton } from "@/components/ui/form/form-button";
import { TextField } from "@/components/ui/form/text-field";
import { useSignUpForm } from "@/hooks/sign-up/use-sign-up-form";

export function SignUpForm() {
  const {
    values,
    errors,
    isSubmitting,
    isPasswordVisible,
    setField,
    togglePasswordVisibility,
    handleSubmit,
  } = useSignUpForm();

  return (
    <>
      <TextField
        label="Usuario"
        value={values.user}
        onChangeText={(value) => setField("user", value)}
        placeholder="Ana"
        error={errors.user}
        autoCapitalize="none"
        autoCorrect={false}
      />
      <TextField
        label="Contraseña"
        value={values.password}
        onChangeText={(value) => setField("password", value)}
        placeholder="****"
        error={errors.password}
        secureTextEntry={!isPasswordVisible}
        trailing={
          <PasswordVisibilityToggle
            isVisible={isPasswordVisible}
            onToggle={togglePasswordVisibility}
          />
        }
      />
      <TextField
        label="Confirmar contraseña"
        value={values.confirmPassword}
        onChangeText={(value) => setField("confirmPassword", value)}
        placeholder="****"
        error={errors.confirmPassword}
        secureTextEntry={!isPasswordVisible}
        trailing={
          <PasswordVisibilityToggle
            isVisible={isPasswordVisible}
            onToggle={togglePasswordVisibility}
          />
        }
      />

      {!!errors.form && (
        <ThemedText type="label-sm" color="error">
          {errors.form}
        </ThemedText>
      )}

      <FormButton onPress={handleSubmit} loading={isSubmitting}>
        Crear cuenta
      </FormButton>
    </>
  );
}
