import BaseIcon, { IconProps } from "./base/BaseIcon";

export default function ClockIcon(props: IconProps) {
  return (
    <BaseIcon
      {...props}
      name={{
        ios: "clock",
        android: "schedule",
      }}
    />
  );
}