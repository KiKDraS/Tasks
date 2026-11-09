import { fireEvent, render } from "@testing-library/react-native";
import type { ComponentProps } from "react";

import { PhotoCard } from "@/components/ui/task-form/photo-card";
import type { DeviceActionState } from "@/utils/permission-state";

jest.mock("@/components/icons/CameraIcon", () => ({
  __esModule: true,
  default: () => null,
}));

jest.mock("expo-image", () => ({
  Image: () => null,
}));

const renderCard = async (
  overrides: Partial<ComponentProps<typeof PhotoCard>> = {},
) => {
  const handlers = {
    onTakePhoto: jest.fn(),
    onPickPhoto: jest.fn(),
    onRemovePhoto: jest.fn(),
    onRetry: jest.fn(),
    onOpenSettings: jest.fn(),
  };
  const utils = await render(
    <PhotoCard
      photoUri={null}
      state={{ status: "idle" }}
      {...handlers}
      {...overrides}
    />,
  );

  return { ...utils, ...handlers };
};

describe("<PhotoCard />", () => {
  test("renders the empty state and both photo actions", async () => {
    const { getByRole, getByText } = await renderCard();

    expect(getByText("Sin foto")).toBeTruthy();
    expect(getByRole("button", { name: "Tomar foto" })).toBeTruthy();
    expect(getByRole("button", { name: "Elegir de galería" })).toBeTruthy();
  });

  test("calls the take and pick handlers", async () => {
    const { getByRole, onTakePhoto, onPickPhoto } = await renderCard();

    await fireEvent.press(getByRole("button", { name: "Tomar foto" }));
    await fireEvent.press(getByRole("button", { name: "Elegir de galería" }));

    expect(onTakePhoto).toHaveBeenCalledTimes(1);
    expect(onPickPhoto).toHaveBeenCalledTimes(1);
  });

  test("renders the remove action for an attached photo", async () => {
    const { getByRole, queryByText, onRemovePhoto } = await renderCard({
      photoUri: "file:///photo.jpg",
    });

    expect(queryByText("Sin foto")).toBeNull();
    await fireEvent.press(getByRole("button", { name: "Quitar foto" }));

    expect(onRemovePhoto).toHaveBeenCalledTimes(1);
  });

  test("renders the permission notice when photo access is denied", async () => {
    const state: DeviceActionState = { status: "denied", canAskAgain: true };
    const { getByText } = await renderCard({ state });

    expect(
      getByText("Permiso denegado. Podés volver a intentarlo."),
    ).toBeTruthy();
    expect(getByText("Reintentar")).toBeTruthy();
  });
});
