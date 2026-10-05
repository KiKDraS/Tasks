import { ThemedText } from "@/components/themed-text";
import { PasswordVisibilityToggle } from "@/components/ui/auth/password-visibility-toggle";
import { FormButton } from "@/components/ui/form/form-button";
import { TextField } from "@/components/ui/form/text-field";
import { useSignInForm } from "@/hooks/sign-in/use-sign-in-form";

export function SignInForm() {
  const {
    values,
    errors,
    isSubmitting,
    isPasswordVisible,
    setField,
    togglePasswordVisibility,
    handleSubmit,
  } = useSignInForm();

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

      {!!errors.form && (
        <ThemedText type="label-sm" color="error">
          {errors.form}
        </ThemedText>
      )}

      <FormButton onPress={handleSubmit} loading={isSubmitting}>
        Ingresar
      </FormButton>
    </>
  );
}
