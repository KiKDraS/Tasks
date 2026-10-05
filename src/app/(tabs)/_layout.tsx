import HomeIcon from "@/components/icons/HomeIcon";
import SchedulingIcon from "@/components/icons/SchedulingIcon";
import { Header } from "@/components/ui/header";
import { setShadow } from "@/constants/theme";
import { TasksProvider } from "@/context/tasks/tasks-context";
import { useTheme } from "@/hooks/use-theme";
import { Tabs } from "expo-router";
import { type ComponentProps } from "react";
import { type ViewStyle } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const TAB_ICON_SIZE = 42;
const TAB_BAR_HEIGHT = 48;
const TAB_BAR_BOTTOM_PADDING = 24;

type TabScreenOptions = ComponentProps<typeof Tabs>["screenOptions"];

export default function TabLayout() {
  const { Colors, Spacing } = useTheme();
  const insets = useSafeAreaInsets();

  const tabBarStyle: ViewStyle = {
    height: TAB_BAR_HEIGHT,
    backgroundColor: Colors["surface"],
    justifyContent: "center",
    alignItems: "center",
    paddingTop: Spacing.gutter,
    paddingBottom: insets.bottom + TAB_BAR_BOTTOM_PADDING,
    ...setShadow("on-primary-container"),
  };

  const screenOptions: TabScreenOptions = {
    header: (props) => <Header {...props} />,
    tabBarShowLabel: false,
    tabBarActiveTintColor: Colors["secondary"],
    tabBarStyle,
  };

  return (
    <TasksProvider>
      <Tabs screenOptions={screenOptions}>
        <Tabs.Screen
          name="index"
          options={{
            title: "Home",
            tabBarIcon: ({ color }) => (
              <HomeIcon size={TAB_ICON_SIZE} color={color as string} />
            ),
          }}
        />
        <Tabs.Screen
          name="task-form"
          options={{
            title: "Create Task",
            tabBarIcon: ({ color }) => (
              <SchedulingIcon size={TAB_ICON_SIZE} color={color as string} />
            ),
          }}
        />
      </Tabs>
    </TasksProvider>
  );
}
