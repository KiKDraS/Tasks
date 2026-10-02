import { Text, type TextProps } from "react-native";

import { ThemeColor, Typography, TypographyType } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";

export function ThemedText({
  type = "body-md",
  color = "primary",
  style,
  ...rest
}: Readonly<TextProps & { color?: ThemeColor; type?: TypographyType }>) {
  const { Colors } = useTheme();

  return (
    <Text
      style={[{ color: Colors[color] }, Typography[type], style]}
      {...rest}
    />
  );
}
