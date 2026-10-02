import BaseIcon, { IconProps } from "./base/BaseIcon";

export default function ShowPasswordIcon(props: IconProps) {
  return (
    <BaseIcon
      {...props}
      name={{
        ios: "eye",
        android: "visibility",
      }}
    />
  );
}