import { Colors, Rounded, setShadow, Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { Image } from "expo-image";
import { BottomTabHeaderProps } from "expo-router/build/react-navigation/bottom-tabs/types";
import { StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import UserIcon from "../icons/UserIcon";
import { ThemedText } from "../themed-text";

const HEADER_HEIGHT = 56;
const LOGO_SIZE = 32;
const USER_BADGE_SIZE = 36;
const USER_ICON_SIZE = 24;

export const Header = (props: BottomTabHeaderProps) => {
  const insets = useSafeAreaInsets();
  const { Colors } = useTheme();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: Colors["surface"],
          paddingTop: insets.top,
        },
      ]}
    >
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Image
            source={require("@/assets/images/icon.png")}
            style={styles.image}
            contentFit="contain"
          />
          <ThemedText type="headline-md">Tasks</ThemedText>
        </View>

        <View style={styles.userIconContainer}>
          <UserIcon size={USER_ICON_SIZE} color={Colors["on-primary"]} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    ...setShadow("on-primary-container"),
  },
  content: {
    height: HEADER_HEIGHT,
    paddingHorizontal: Spacing.gutter,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  iconContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing["space-sm"],
  },
  image: {
    width: LOGO_SIZE,
    height: LOGO_SIZE,
  },
  userIconContainer: {
    backgroundColor: Colors["primary-container"],
    width: USER_BADGE_SIZE,
    height: USER_BADGE_SIZE,
    borderRadius: Rounded.lg,
    alignItems: "center",
    justifyContent: "center",
  },
});
