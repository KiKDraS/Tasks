import AddIcon from "@/components/icons/AddIcon";
import { Colors } from "@/constants/theme";
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
    borderRadius: 50,
    position: "absolute",
    bottom: 24,
    right: 24,
    zIndex: 1000,
    elevation: 5,
    shadowColor: Colors["primary-container"],
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});
