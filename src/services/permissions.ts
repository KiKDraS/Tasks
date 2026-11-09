import { Linking } from "react-native";

export type DeviceResult<T> =
  | { status: "granted"; value: T }
  | { status: "cancelled" }
  | { status: "denied"; canAskAgain: boolean }
  | { status: "error"; message: string };

export function openAppSettings(): Promise<void> {
  return Linking.openSettings();
}
