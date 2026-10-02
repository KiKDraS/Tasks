import BaseIcon, { IconProps } from "./base/BaseIcon";

export default function UserIcon(props: IconProps) {
  return (
    <BaseIcon
      {...props}
      name={{
        ios: "person",
        android: "person",
      }}
    />
  );
}