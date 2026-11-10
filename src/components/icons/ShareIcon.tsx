import BaseIcon, { IconProps } from "./base/BaseIcon";

export default function ShareIcon(props: IconProps) {
  return (
    <BaseIcon
      {...props}
      name={{
        ios: "square.and.arrow.up",
        android: "share",
      }}
    />
  );
}
