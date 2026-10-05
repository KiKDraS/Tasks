import UserIcon from "@/components/icons/UserIcon";
import { Colors, Rounded } from "@/constants/theme";
import { useSession } from "@/context/auth/auth-context";
import {
  AUTH_MENU_ACTION_IDS,
  AUTH_MESSAGES,
} from "@/context/auth/constants";
import {
  MenuView,
  type MenuAction,
  type NativeActionEvent,
} from "@expo/ui/community/menu";
import { StyleSheet, View } from "react-native";

const USER_BADGE_SIZE = 36;
const USER_ICON_SIZE = 24;

const buildUserMenuActions = (user?: string): MenuAction[] => [
  ...(user
    ? [
        {
          id: AUTH_MENU_ACTION_IDS.account,
          title: user,
          attributes: { disabled: true },
        },
      ]
    : []),
  {
    id: AUTH_MENU_ACTION_IDS.signOut,
    title: AUTH_MESSAGES.signOut,
    attributes: { destructive: true },
  },
];

export function UserMenu() {
  const { signOut, session } = useSession();
  const actions = buildUserMenuActions(session?.user);

  const handlePressAction = (event: NativeActionEvent) => {
    if (event.nativeEvent.event === AUTH_MENU_ACTION_IDS.signOut) {
      signOut();
    }
  };

  return (
    <MenuView
      actions={actions}
      onPressAction={handlePressAction}
      style={styles.trigger}
    >
      <View style={styles.badge} accessibilityLabel={AUTH_MESSAGES.userMenu}>
        <UserIcon size={USER_ICON_SIZE} color={Colors["on-primary"]} />
      </View>
    </MenuView>
  );
}

const styles = StyleSheet.create({
  trigger: {
    borderRadius: Rounded.lg,
  },
  badge: {
    backgroundColor: Colors["primary-container"],
    width: USER_BADGE_SIZE,
    height: USER_BADGE_SIZE,
    borderRadius: Rounded.lg,
    alignItems: "center",
    justifyContent: "center",
  },
});
