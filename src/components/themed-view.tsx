import { StyleSheet, View, type ViewProps } from "react-native";

import { Colors } from "@/constants/theme";

export function ThemedView({
  style,
  children,
  ...otherProps
}: Readonly<ViewProps>) {
  return (
    <View style={[styles.container, style]} {...otherProps}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
});
