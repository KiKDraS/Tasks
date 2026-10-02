import BaseIcon, { IconProps } from "./base/BaseIcon";

export default function ReminderNotificationIcon(props: IconProps) {
  return (
    <BaseIcon
      {...props}
      name={{
        ios: "bell.and.waveform",
        android: "notifications_active",
      }}
    />
  );
}