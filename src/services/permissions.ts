import { Linking } from "react-native";

export type DeviceResult<T> =
  | { status: "granted"; value: T }
  | { status: "cancelled" }
  | { status: "denied"; canAskAgain: boolean }
  | { status: "error"; message: string };

export interface PermissionLike {
  status: string;
  canAskAgain: boolean;
}

export function isPermissionGranted(permission: PermissionLike): boolean {
  return permission.status === "granted";
}

export function openAppSettings(): Promise<void> {
  return Linking.openSettings();
}
