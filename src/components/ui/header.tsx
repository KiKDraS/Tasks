import { Colors, setShadow } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { Image } from "expo-image";
import { BottomTabHeaderProps } from "expo-router/build/react-navigation/bottom-tabs/types";
import { StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import UserIcon from "../icons/UserIcon";
import { ThemedText } from "../themed-text";

export const Header = (props: BottomTabHeaderProps) => {
  const insets = useSafeAreaInsets();
  const { Colors } = useTheme();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: Colors["background"],
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
          <UserIcon size={24} color={Colors["on-primary"]} />
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
    height: 56,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  iconContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  image: {
    width: 32,
    height: 32,
  },
  userIconContainer: {
    backgroundColor: Colors["primary-container"],
    width: 36,
    height: 36,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
});
