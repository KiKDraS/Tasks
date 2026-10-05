import { ThemedText } from "@/components/themed-text";
import { PressableOpacity } from "@/components/ui/pressable-opacity";
import { StyleSheet, View } from "react-native";

interface AuthRedirectProps {
  question: string;
  linkLabel: string;
  onPress: () => void;
}

export function AuthRedirect({
  question,
  linkLabel,
  onPress,
}: Readonly<AuthRedirectProps>) {
  return (
    <View style={styles.container}>
      <ThemedText type="body-md" style={styles.question}>
        {question} -{" "}
      </ThemedText>
      <PressableOpacity onPress={onPress}>
        <ThemedText type="body-md" style={styles.link}>
          {linkLabel}
        </ThemedText>
      </PressableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  question: {
    textAlign: "center",
  },
  link: {
    fontWeight: 700,
  },
});
