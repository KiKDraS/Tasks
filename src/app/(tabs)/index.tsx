import { ThemedView } from "@/components/themed-view";
import { HomeButton } from "@/components/ui/home/home-button";
import { router } from "expo-router";

export default function HomeScreen() {
  const navigateToCreateTask = () => {
    router.push("/(tabs)/create-task");
  };

  return (
    <ThemedView>
      <HomeButton onPress={navigateToCreateTask} />
    </ThemedView>
  );
}
