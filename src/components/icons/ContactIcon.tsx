import BaseIcon, { IconProps } from "./base/BaseIcon";

export default function ContactIcon(props: IconProps) {
  return (
    <BaseIcon
      {...props}
      name={{
        ios: "person.crop.circle",
        android: "person",
      }}
    />
  );
}
