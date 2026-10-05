import { AppIcon } from "@/components/icons/AppIcon";
import { ThemedText } from "@/components/themed-text";
import { setShadow, Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { UserMenu } from "./user-menu";

const HEADER_HEIGHT = 56;
const LOGO_SIZE = 32;

export const Header = () => {
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
        <View style={styles.brand}>
          <AppIcon style={styles.image} />
          <ThemedText type="headline-md">Tasks</ThemedText>
        </View>

        <UserMenu />
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
  brand: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing["space-sm"],
  },
  image: {
    width: LOGO_SIZE,
    height: LOGO_SIZE,
  },
});
