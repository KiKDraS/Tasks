import { Image, type ImageProps } from "expo-image";

const APP_ICON_SOURCE = require("@/assets/images/icon.png");

type AppIconProps = Omit<ImageProps, "source">;

export function AppIcon(props: Readonly<AppIconProps>) {
  return <Image source={APP_ICON_SOURCE} contentFit="contain" {...props} />;
}
