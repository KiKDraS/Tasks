import BaseIcon, { IconProps } from "./base/BaseIcon";

export default function SearchIcon(props: IconProps) {
  return (
    <BaseIcon
      {...props}
      name={{
        ios: "magnifyingglass",
        android: "search",
      }}
    />
  );
}