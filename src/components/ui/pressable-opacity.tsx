import { TouchableOpacity, type TouchableOpacityProps } from "react-native";

interface PressableOpacityProps extends TouchableOpacityProps {
  activeOpacity?: number;
}

export function PressableOpacity({
  activeOpacity = 0.85,
  ...props
}: Readonly<PressableOpacityProps>) {
  return <TouchableOpacity {...props} activeOpacity={activeOpacity} />;
}
