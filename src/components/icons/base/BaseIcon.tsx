import { SymbolView, type AndroidSymbol, type SFSymbol } from "expo-symbols";

import { Colors } from "@/constants/theme";

export type IconProps = Readonly<{
  size?: number;
  color?: string;
}>;

type IconName = Readonly<{
  ios: SFSymbol;
  android: AndroidSymbol;
}>;

type BaseIconProps = IconProps &
  Readonly<{
    name: IconName;
  }>;

export default function BaseIcon({
  name,
  size = 32,
  color = Colors.primary,
}: BaseIconProps) {
  return <SymbolView name={name} size={size} tintColor={color} />;
}
