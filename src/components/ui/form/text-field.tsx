import { ThemedText } from "@/components/themed-text";
import { Colors, Rounded, Spacing, Typography } from "@/constants/theme";
import { type ReactNode } from "react";
import {
  StyleSheet,
  TextInput,
  type TextInputProps,
  View,
} from "react-native";

const TRAILING_SLOT_WIDTH = 24;

interface TextFieldProps extends TextInputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  error?: string | null;
  trailing?: ReactNode;
}

export function TextField({
  label,
  value,
  onChangeText,
  placeholder,
  multiline,
  error,
  trailing,
  style,
  ...rest
}: Readonly<TextFieldProps>) {
  return (
    <View style={styles.container}>
      <ThemedText type="label-md" color="on-surface-variant">
        {label}
      </ThemedText>
      <View style={styles.inputWrapper}>
        <TextInput
          {...rest}
          style={[
            styles.input,
            Typography["body-lg"],
            multiline && styles.multiline,
            !!trailing && styles.inputWithTrailing,
            style,
          ]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={Colors["on-surface-variant"]}
          multiline={multiline}
          textAlignVertical={multiline ? "top" : "center"}
        />
        {!!trailing && <View style={styles.trailing}>{trailing}</View>}
      </View>
      {!!error && (
        <ThemedText type="label-sm" color="error">
          {error}
        </ThemedText>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing["space-sm"],
  },
  inputWrapper: {
    position: "relative",
  },
  input: {
    backgroundColor: Colors["surface-variant"],
    borderRadius: Rounded.md,
    paddingHorizontal: Spacing.gutter,
    paddingVertical: Spacing["space-md"],
    color: Colors["on-surface"],
  },
  inputWithTrailing: {
    paddingRight: Spacing.gutter + TRAILING_SLOT_WIDTH,
  },
  trailing: {
    position: "absolute",
    top: 0,
    bottom: 0,
    right: Spacing.gutter,
    justifyContent: "center",
  },
  multiline: {
    minHeight: 96,
  },
});
