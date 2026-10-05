import { Colors } from "@/constants/theme";
import { StyleSheet } from "react-native";

export const taskTextStyles = StyleSheet.create({
  completeText: {
    color: Colors["on-surface-variant"],
    textDecorationLine: "line-through",
  },
});
