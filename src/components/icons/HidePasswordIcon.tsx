import BaseIcon, { IconProps } from "./base/BaseIcon";

export default function HidePasswordIcon(props: IconProps) {
  return (
    <BaseIcon
      {...props}
      name={{
        ios: "eye.slash",
        android: "visibility_off",
      }}
    />
  );
}