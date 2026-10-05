import HidePasswordIcon from "@/components/icons/HidePasswordIcon";
import ShowPasswordIcon from "@/components/icons/ShowPasswordIcon";
import { PressableOpacity } from "@/components/ui/pressable-opacity";
import { Colors } from "@/constants/theme";
import { AUTH_MESSAGES } from "@/context/auth/constants";

const PASSWORD_ICON_SIZE = 20;

interface PasswordVisibilityToggleProps {
  isVisible: boolean;
  onToggle: () => void;
}

export function PasswordVisibilityToggle({
  isVisible,
  onToggle,
}: Readonly<PasswordVisibilityToggleProps>) {
  return (
    <PressableOpacity
      onPress={onToggle}
      accessibilityRole="button"
      accessibilityLabel={
        isVisible ? AUTH_MESSAGES.hidePassword : AUTH_MESSAGES.showPassword
      }
    >
      {isVisible ? (
        <HidePasswordIcon
          size={PASSWORD_ICON_SIZE}
          color={Colors["on-surface-variant"]}
        />
      ) : (
        <ShowPasswordIcon
          size={PASSWORD_ICON_SIZE}
          color={Colors["on-surface-variant"]}
        />
      )}
    </PressableOpacity>
  );
}
