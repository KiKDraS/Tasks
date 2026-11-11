import BaseIcon, { IconProps } from "./base/BaseIcon";

export default function CloseIcon(props: IconProps) {
  return (
    <BaseIcon
      {...props}
      name={{
        ios: "xmark",
        android: "close",
      }}
    />
  );
}
