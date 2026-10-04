import HomeIcon from "@/components/icons/HomeIcon";
import SchedulingIcon from "@/components/icons/SchedulingIcon";
import { Header } from "@/components/ui/header";
import { useTheme } from "@/hooks/use-theme";
import { Tabs } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function TabLayout() {
  const { Colors } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        header: (props) => <Header {...props} />,
        tabBarShowLabel: false,
        tabBarActiveTintColor: Colors["secondary"],
        tabBarStyle: {
          height: 48,
          backgroundColor: Colors["background"],
          justifyContent: "center",
          alignItems: "center",
          paddingBottom: insets.bottom + 24,
        },
        tabBarIconStyle: {
          marginTop: 4,
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
  );
}
