import { StyleSheet, View, type ViewProps } from "react-native";

import { Colors } from "@/constants/theme";

export function ThemedView({ style, children, ...rest }: Readonly<ViewProps>) {
  return (
    <View style={[styles.container, style]} {...rest}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.surface,
  },
});
