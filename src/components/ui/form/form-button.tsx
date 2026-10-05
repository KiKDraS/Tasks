import { ThemedText } from "@/components/themed-text";
import { PressableOpacity } from "@/components/ui/pressable-opacity";
import {
  Colors,
  Rounded,
  setShadow,
  Spacing,
  type ThemeColor,
} from "@/constants/theme";
import { type ReactNode } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  type TouchableOpacityProps,
  type ViewStyle,
} from "react-native";

export type FormButtonVariant = "primary" | "surface";

type VariantConfig = {
  container: ViewStyle;
  textColor: ThemeColor;
  indicatorColor: string;
};

const VARIANTS: Record<FormButtonVariant, VariantConfig> = {
  primary: {
    container: {
      backgroundColor: Colors["primary-container"],
      ...setShadow("primary-container"),
    },
    textColor: "on-primary",
    indicatorColor: Colors["on-primary"],
  },
  surface: {
    container: {
      backgroundColor: Colors["surface-variant"],
    },
    textColor: "on-surface",
    indicatorColor: Colors["on-surface"],
  },
};

interface FormButtonProps extends TouchableOpacityProps {
  variant?: FormButtonVariant;
  loading?: boolean;
  children: ReactNode;
}

export function FormButton({
  variant = "primary",
  loading,
  disabled,
  style,
  children,
  ...rest
}: Readonly<FormButtonProps>) {
  const isDisabled = !!(disabled || loading);
  const { container, textColor, indicatorColor } = VARIANTS[variant];

  return (
    <PressableOpacity
      {...rest}
      disabled={isDisabled}
      style={[styles.base, container, isDisabled && styles.disabled, style]}
    >
      {loading ? (
        <ActivityIndicator color={indicatorColor} />
      ) : (
        <ThemedText type="label-md" color={textColor}>
          {children}
        </ThemedText>
      )}
    </PressableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: Rounded.lg,
    paddingVertical: Spacing["space-md"] + 2,
    alignItems: "center",
    justifyContent: "center",
  },
  disabled: {
    opacity: 0.5,
  },
});
