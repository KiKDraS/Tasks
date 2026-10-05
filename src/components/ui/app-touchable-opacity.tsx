import { TouchableOpacity, type TouchableOpacityProps } from "react-native";

interface AppTouchableOpacityProps extends TouchableOpacityProps {
  activeOpacity?: number;
}

export function AppTouchableOpacity({
  activeOpacity = 0.85,
  ...props
}: Readonly<AppTouchableOpacityProps>) {
  return <TouchableOpacity {...props} activeOpacity={activeOpacity} />;
}
