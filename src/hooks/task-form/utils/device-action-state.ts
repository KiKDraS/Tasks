import type { DeviceResult } from "@/services/permissions";
import {
  getPermissionUiState,
  type DeviceActionState,
} from "@/utils/permission-state";

type DeviceFailure = Exclude<DeviceResult<unknown>, { status: "granted" }>;

export function getFailureState(result: DeviceFailure): DeviceActionState {
  if (result.status === "cancelled") {
    return { status: "idle" };
  }

  if (result.status === "denied") {
    const permissionUiState = getPermissionUiState(result);
    return permissionUiState === "blocked"
      ? { status: "blocked" }
      : { status: "denied", canAskAgain: true };
  }

  return { status: "error", message: result.message };
}
