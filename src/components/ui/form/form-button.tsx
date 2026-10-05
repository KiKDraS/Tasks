import { ThemedText } from "@/components/themed-text";
import { Colors, Rounded, setShadow, Spacing } from "@/constants/theme";
import {
  ActivityIndicator,
  Pressable,
  PressableProps,
  StyleSheet,
} from "react-native";

interface FormButtonProps extends PressableProps {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
}

export function FormButton({
  label,
  onPress,
  disabled,
  loading,
  ...rest
}: Readonly<FormButtonProps>) {
  const isDisabled = Boolean(disabled || loading);

  return (
    <Pressable
      {...rest}
      onPress={onPress}
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.button,
        isDisabled && styles.disabled,
        pressed && styles.pressed,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={Colors["on-primary"]} />
      ) : (
        <ThemedText type="label-md" color="on-primary">
          {label}
        </ThemedText>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: Colors["primary-container"],
    borderRadius: Rounded.lg,
    paddingVertical: Spacing["space-md"] + 2,
    alignItems: "center",
    justifyContent: "center",
    ...setShadow("primary-container"),
  },
  pressed: {
    opacity: 0.85,
  },
  disabled: {
    opacity: 0.5,
  },
});
