import AddIcon from "@/components/icons/AddIcon";
import { Colors, Rounded, setShadow } from "@/constants/theme";
import { Pressable, StyleSheet } from "react-native";

interface HomeButtonProps {
  onPress: () => void;
}

export function HomeButton({ onPress }: Readonly<HomeButtonProps>) {
  return (
    <Pressable onPress={onPress} style={styles.button}>
      <AddIcon size={42} color={Colors["on-primary"]} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 42,
    height: 42,
    backgroundColor: Colors["primary-container"],
    borderRadius: Rounded.full,
    position: "absolute",
    bottom: 24,
    right: 24,
    zIndex: 1000,
    elevation: 5,
    ...setShadow("primary-container"),
  },
});
