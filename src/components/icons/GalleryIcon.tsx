import BaseIcon, { IconProps } from "./base/BaseIcon";

export default function GalleryIcon(props: IconProps) {
  return (
    <BaseIcon
      {...props}
      name={{
        ios: "photo.on.rectangle",
        android: "photo_library",
      }}
    />
  );
}
