import { Colors } from "@/constants/theme";
import { StyleSheet } from "react-native";

export const taskTextStyles = StyleSheet.create({
  completeText: {
    color: Colors.secondary,
    textDecorationLine: "line-through",
  },
});
