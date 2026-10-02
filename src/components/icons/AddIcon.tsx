import BaseIcon, { IconProps } from "./base/BaseIcon";

export default function AddIcon(props: IconProps) {
  return (
    <BaseIcon
      {...props}
      name={{
        ios: "plus.circle",
        android: "add_circle",
      }}
    />
  );
}