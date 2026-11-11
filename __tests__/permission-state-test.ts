import { getPermissionUiState } from "@/utils/permission-state";

describe("getPermissionUiState", () => {
  test("returns granted when permission is granted", () => {
    expect(getPermissionUiState({ status: "granted", canAskAgain: true })).toBe("granted");
  });

  test("returns denied when denied but still askable", () => {
    expect(getPermissionUiState({ status: "denied", canAskAgain: true })).toBe("denied");
  });

  test("returns blocked when denied and no longer askable", () => {
    expect(getPermissionUiState({ status: "denied", canAskAgain: false })).toBe("blocked");
  });

  test("returns undetermined when permission is undetermined", () => {
    expect(getPermissionUiState({ status: "undetermined", canAskAgain: true })).toBe("undetermined");
  });
});
