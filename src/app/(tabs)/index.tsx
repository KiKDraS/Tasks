import { ThemedView } from "@/components/themed-view";
import { HomeButton } from "@/components/ui/home/home-button";
import { HomeTasksList } from "@/components/ui/home/home-tasks-list";
import { ROUTES } from "@/constants/routes";
import { router } from "expo-router";

export default function HomeScreen() {
  const navigateToCreateTask = () => {
    router.push(ROUTES.createTask);
  };

  return (
    <ThemedView>
      <HomeTasksList />
      <HomeButton onPress={navigateToCreateTask} />
    </ThemedView>
  );
}
