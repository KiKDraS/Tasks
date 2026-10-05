import * as Notifications from "expo-notifications";
import { useEffect } from "react";

export function useClearSentNotification(
  clearByNotificationId: (notificationId: string) => void,
) {
  useEffect(() => {
    const subscription = Notifications.addNotificationReceivedListener(
      (notification) => {
        clearByNotificationId(notification.request.identifier);
      },
    );

    return () => subscription.remove();
  }, [clearByNotificationId]);
}
