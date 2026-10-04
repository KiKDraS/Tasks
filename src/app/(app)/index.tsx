import ClockIcon from "@/components/icons/ClockIcon";
import HomeIcon from "@/components/icons/HomeIcon";
import { ThemedText } from "@/components/themed-text";
import { Colors } from "@/constants/theme";
import { View } from "react-native";

export default function HomeScreen() {
  return (
    <View style={{ backgroundColor: Colors["primary-container"] }}>
      <ThemedText>Welcome to the app!</ThemedText>
      <HomeIcon color={Colors.error} />
      <ClockIcon color={Colors.secondary} />
    </View>
  );
}
