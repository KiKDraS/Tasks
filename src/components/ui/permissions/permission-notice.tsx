import { ThemedText } from "@/components/themed-text";
import { FormButton } from "@/components/ui/form/form-button";
import { PERMISSION_NOTICE_COPY } from "@/constants/permission-notice-copy";
import { Spacing } from "@/constants/theme";
import type { DeviceActionState } from "@/utils/permission-state";
import { useEffect } from "react";
import { AccessibilityInfo, Platform, StyleSheet, View } from "react-native";

interface PermissionNoticeProps {
  state: DeviceActionState;
  onRetry?: () => void;
  onOpenSettings?: () => void;
  disabled?: boolean;
}

interface NoticeContent {
  message: string;
  actionLabel: string;
  onPress?: () => void;
}

function getNoticeContent(
  state: DeviceActionState,
  onRetry?: () => void,
  onOpenSettings?: () => void,
): NoticeContent | null {
  if (state.status === "denied") {
    return {
      message: PERMISSION_NOTICE_COPY.denied,
      actionLabel: PERMISSION_NOTICE_COPY.retry,
      onPress: onRetry,
    };
  }

  if (state.status === "blocked") {
    return {
      message: PERMISSION_NOTICE_COPY.blocked,
      actionLabel: PERMISSION_NOTICE_COPY.openSettings,
      onPress: onOpenSettings,
    };
  }

  if (state.status === "error") {
    return {
      message: state.message,
      actionLabel: PERMISSION_NOTICE_COPY.retry,
      onPress: onRetry,
    };
  }

  return null;
}

export function PermissionNotice({
  state,
  onRetry,
  onOpenSettings,
  disabled,
}: Readonly<PermissionNoticeProps>) {
  const content = getNoticeContent(state, onRetry, onOpenSettings);
  const message = content?.message;

  useEffect(() => {
    if (message && Platform.OS === "ios") {
      AccessibilityInfo.announceForAccessibility(message);
    }
  }, [message]);

  if (!content) {
    return null;
  }

  return (
    <View style={styles.container}>
      <ThemedText
        type="label-sm"
        color="error"
        accessibilityLiveRegion="polite"
      >
        {content.message}
      </ThemedText>
      <FormButton
        variant="surface"
        onPress={content.onPress}
        disabled={disabled}
        style={styles.action}
      >
        {content.actionLabel}
      </FormButton>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing["space-sm"],
  },
  action: {
    alignSelf: "flex-start",
    paddingHorizontal: Spacing.gutter,
  },
});
