import { ThemedView } from "@/components/themed-view";
import { HomeAddButton } from "@/components/ui/home/home-add-button";
import { HomeTasksList } from "@/components/ui/home/home-tasks-list";

export default function HomeScreen() {
  return (
    <ThemedView>
      <HomeTasksList />
      <HomeAddButton />
    </ThemedView>
  );
}
