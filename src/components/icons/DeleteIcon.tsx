import BaseIcon, { IconProps } from "./base/BaseIcon";

export default function DeleteIcon(props: IconProps) {
  return (
    <BaseIcon
      {...props}
      name={{
        ios: "trash",
        android: "delete",
      }}
    />
  );
}