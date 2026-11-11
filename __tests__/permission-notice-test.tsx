import { fireEvent, render } from "@testing-library/react-native";

import { PERMISSION_NOTICE_COPY } from "@/constants/permission-notice-copy";
import { PermissionNotice } from "@/components/ui/permissions/permission-notice";
import type { DeviceActionState } from "@/utils/permission-state";

const hiddenStates: DeviceActionState[] = [
  { status: "idle" },
  { status: "pending" },
  { status: "granted" },
];

describe("<PermissionNotice />", () => {
  test("renders the denied message and retries", async () => {
    const onRetry = jest.fn();
    const { getByRole, getByText } = await render(
      <PermissionNotice
        state={{ status: "denied", canAskAgain: true }}
        onRetry={onRetry}
      />,
    );

    expect(getByText(PERMISSION_NOTICE_COPY.denied)).toBeTruthy();
    await fireEvent.press(
      getByRole("button", { name: PERMISSION_NOTICE_COPY.retry }),
    );

    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  test("renders the blocked message and opens settings", async () => {
    const onOpenSettings = jest.fn();
    const { getByRole, getByText } = await render(
      <PermissionNotice
        state={{ status: "blocked" }}
        onOpenSettings={onOpenSettings}
      />,
    );

    expect(getByText(PERMISSION_NOTICE_COPY.blocked)).toBeTruthy();
    await fireEvent.press(
      getByRole("button", { name: PERMISSION_NOTICE_COPY.openSettings }),
    );

    expect(onOpenSettings).toHaveBeenCalledTimes(1);
  });

  test("renders the service error message and retries", async () => {
    const onRetry = jest.fn();
    const message = "No pudimos usar la cámara o la galería. Intentá de nuevo.";
    const { getByRole, getByText } = await render(
      <PermissionNotice state={{ status: "error", message }} onRetry={onRetry} />,
    );

    expect(getByText(message)).toBeTruthy();
    await fireEvent.press(
      getByRole("button", { name: PERMISSION_NOTICE_COPY.retry }),
    );

    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  test.each(hiddenStates)("renders nothing for $status", async (state) => {
    const { toJSON } = await render(<PermissionNotice state={state} />);

    expect(toJSON()).toBeNull();
  });
});
