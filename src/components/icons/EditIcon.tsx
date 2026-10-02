import BaseIcon, { IconProps } from "./base/BaseIcon";

export default function EditIcon(props: IconProps) {
  return (
    <BaseIcon
      {...props}
      name={{
        ios: "pencil",
        android: "edit",
      }}
    />
  );
}