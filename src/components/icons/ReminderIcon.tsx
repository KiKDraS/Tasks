import BaseIcon, { IconProps } from "./base/BaseIcon";

export default function ReminderIcon(props: IconProps) {
  return (
    <BaseIcon
      {...props}
      name={{
        ios: "bell",
        android: "notifications",
      }}
    />
  );
}