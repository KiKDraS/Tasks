import { Text, type TextProps } from "react-native";

import {
  Colors,
  Typography,
  type ThemeColor,
  type TypographyType,
} from "@/constants/theme";

export function ThemedText({
  type = "body-md",
  color = "primary",
  style,
  ...rest
}: Readonly<TextProps & { color?: ThemeColor; type?: TypographyType }>) {
  return (
    <Text
      style={[{ color: Colors[color] }, Typography[type], style]}
      {...rest}
    />
  );
}
