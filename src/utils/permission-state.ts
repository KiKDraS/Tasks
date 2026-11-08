export interface PermissionStatusLike {
  status: string;
  canAskAgain: boolean;
}

export type PermissionUiState = "granted" | "denied" | "blocked" | "undetermined";

export function getPermissionUiState(response: PermissionStatusLike): PermissionUiState {
  if (response.status === "granted") {
    return "granted";
  }

  const isDenied = response.status === "denied";
  if (!isDenied) {
    return "undetermined";
  }

  return response.canAskAgain ? "denied" : "blocked";
}
