import BaseIcon, { IconProps } from "./base/BaseIcon";

export default function LocationIcon(props: IconProps) {
  return (
    <BaseIcon
      {...props}
      name={{
        ios: "mappin.and.ellipse",
        android: "location_on",
      }}
    />
  );
}
