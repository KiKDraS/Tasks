import { View, type ViewProps } from "react-native";

import { useTheme } from "@/hooks/use-theme";

export function ThemedView({
  style,
  children,
  ...otherProps
}: Readonly<ViewProps>) {
  const { Colors } = useTheme();

  return (
    <View
      style={[{ backgroundColor: Colors.background }, style]}
      {...otherProps}
    >
      {children}
    </View>
  );
}
