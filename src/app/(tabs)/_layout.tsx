import HomeIcon from "@/components/icons/HomeIcon";
import SchedulingIcon from "@/components/icons/SchedulingIcon";
import { Header } from "@/components/ui/header";
import { setShadow } from "@/constants/theme";
import { TasksProvider } from "@/context/users/tasks-context";
import { useTheme } from "@/hooks/use-theme";
import { Tabs } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function TabLayout() {
  const { Colors, Spacing } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <TasksProvider>
      <Tabs
        screenOptions={{
          header: (props) => <Header {...props} />,
          tabBarShowLabel: false,
          tabBarActiveTintColor: Colors["secondary"],
          tabBarStyle: {
            height: 48,
            backgroundColor: Colors["surface"],
            justifyContent: "center",
            alignItems: "center",
            paddingTop: Spacing.gutter,
            paddingBottom: insets.bottom + 24,
            ...setShadow("on-primary-container"),
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Home",
            tabBarIcon: ({ color }) => (
              <HomeIcon size={42} color={color as string} />
            ),
          }}
        />
        <Tabs.Screen
          name="create-task"
          options={{
            title: "Create Task",
            tabBarIcon: ({ color }) => (
              <SchedulingIcon size={42} color={color as string} />
            ),
          }}
        />
      </Tabs>
    </TasksProvider>
  );
}
