import { Pressable, type PressableProps } from "react-native";

interface PressableOpacityProps extends PressableProps {
  activeOpacity?: number;
}

export function PressableOpacity({
  activeOpacity = 0.85,
  style,
  children,
  ...rest
}: Readonly<PressableOpacityProps>) {
  return (
    <Pressable
      {...rest}
      style={(state) => [
        typeof style === "function" ? style(state) : style,
        state.pressed && { opacity: activeOpacity },
      ]}
    >
      {children}
    </Pressable>
  );
}
