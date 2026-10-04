import ClockIcon from "@/components/icons/ClockIcon";
import HomeIcon from "@/components/icons/HomeIcon";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Colors } from "@/constants/theme";

export default function HomeScreen() {
  return (
    <ThemedView>
      <ThemedText>Welcome to the app!</ThemedText>
      <HomeIcon color={Colors.error} />
      <ClockIcon color={Colors.secondary} />
    </ThemedView>
  );
}
