import BaseIcon, { IconProps } from "./base/BaseIcon";

export default function HomeIcon(props: IconProps) {
  return (
    <BaseIcon
      {...props}
      name={{
        ios: "house",
        android: "home",
      }}
    />
  );
}
