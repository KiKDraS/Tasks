import BaseIcon, { IconProps } from "./base/BaseIcon";

export default function CameraIcon(props: IconProps) {
  return (
    <BaseIcon
      {...props}
      name={{
        ios: "camera",
        android: "photo_camera",
      }}
    />
  );
}
