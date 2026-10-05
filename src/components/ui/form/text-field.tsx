import { ThemedText } from "@/components/themed-text";
import { Colors, Rounded, Spacing, Typography } from "@/constants/theme";
import {
  StyleSheet,
  TextInput,
  type TextInputProps,
  View,
} from "react-native";

interface TextFieldProps extends TextInputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  error?: string | null;
}

export function TextField({
  label,
  value,
  onChangeText,
  placeholder,
  multiline,
  error,
  style,
  ...rest
}: Readonly<TextFieldProps>) {
  return (
    <View style={styles.container}>
      <ThemedText type="label-md" color="on-surface-variant">
        {label}
      </ThemedText>
      <TextInput
        {...rest}
        style={[
          styles.input,
          Typography["body-lg"],
          multiline && styles.multiline,
          style,
        ]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={Colors["on-surface-variant"]}
        multiline={multiline}
        textAlignVertical={multiline ? "top" : "center"}
      />
      {Boolean(error) && (
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
  input: {
    backgroundColor: Colors["surface-variant"],
    borderRadius: Rounded.md,
    paddingHorizontal: Spacing.gutter,
    paddingVertical: Spacing["space-md"],
    color: Colors["on-surface"],
  },
  multiline: {
    minHeight: 96,
  },
});
