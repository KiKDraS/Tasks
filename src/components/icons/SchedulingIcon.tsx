import BaseIcon, { IconProps } from "./base/BaseIcon";

export default function SchedulingIcon(props: IconProps) {
  return (
    <BaseIcon
      {...props}
      name={{
        ios: "calendar",
        android: "calendar_month",
      }}
    />
  );
}