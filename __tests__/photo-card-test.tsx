import { fireEvent, render } from "@testing-library/react-native";
import type { ComponentProps } from "react";

import { PhotoCard } from "@/components/ui/task-form/photo-card";
import type { DeviceActionState } from "@/utils/permission-state";

jest.mock("@/components/icons/CameraIcon", () => ({
  __esModule: true,
  default: () => null,
}));

jest.mock("@/components/icons/CloseIcon", () => ({
  __esModule: true,
  default: () => null,
}));

jest.mock("expo-image", () => {
  const { createElement } = jest.requireActual("react");
  const { View } = jest.requireActual("react-native");

  return {
    Image: ({
      accessibilityLabel,
      style,
    }: {
      accessibilityLabel?: string;
      style?: unknown;
    }) =>
      createElement(View, {
        accessible: true,
        accessibilityRole: "image",
        accessibilityLabel,
        style,
      }),
  };
});

const PHOTOS = ["file:///photo-1.jpg", "file:///photo-2.jpg"];

const renderCard = async (
  overrides: Partial<ComponentProps<typeof PhotoCard>> = {},
) => {
  const handlers = {
    onTakePhoto: jest.fn(),
    onPickPhotos: jest.fn(),
    onRemovePhoto: jest.fn(),
    onRetry: jest.fn(),
    onOpenSettings: jest.fn(),
  };
  const utils = await render(
    <PhotoCard
      photoUris={[]}
      state={{ status: "idle" }}
      {...handlers}
      {...overrides}
    />,
  );

  return { ...utils, ...handlers };
};

describe("<PhotoCard />", () => {
  test("renders the Fotos title, the empty state, and both photo actions", async () => {
    const { getByRole, getByText } = await renderCard();

    expect(getByText("Fotos")).toBeTruthy();
    expect(getByText("Sin fotos")).toBeTruthy();
    expect(getByRole("button", { name: "Tomar foto" })).toBeTruthy();
    expect(getByRole("button", { name: "Elegir de galería" })).toBeTruthy();
  });

  test("calls the take and pick handlers", async () => {
    const { getByRole, onTakePhoto, onPickPhotos } = await renderCard();

    await fireEvent.press(getByRole("button", { name: "Tomar foto" }));
    await fireEvent.press(getByRole("button", { name: "Elegir de galería" }));

    expect(onTakePhoto).toHaveBeenCalledTimes(1);
    expect(onPickPhotos).toHaveBeenCalledTimes(1);
  });

  test("renders one thumbnail per photo and hides the empty state", async () => {
    const { getAllByRole, getByLabelText, queryByText } = await renderCard({
      photoUris: PHOTOS,
    });

    expect(queryByText("Sin fotos")).toBeNull();
    expect(getByLabelText("Foto 1 de la tarea")).toBeTruthy();
    expect(getByLabelText("Foto 2 de la tarea")).toBeTruthy();
    expect(getAllByRole("image")).toHaveLength(2);
  });

  test("remove buttons pass their own photo uri", async () => {
    const { getByRole, onRemovePhoto } = await renderCard({
      photoUris: PHOTOS,
    });

    await fireEvent.press(getByRole("button", { name: "Quitar foto 1" }));
    await fireEvent.press(getByRole("button", { name: "Quitar foto 2" }));

    expect(onRemovePhoto).toHaveBeenNthCalledWith(1, PHOTOS[0]);
    expect(onRemovePhoto).toHaveBeenNthCalledWith(2, PHOTOS[1]);
  });

  test("disables the actions and shows a loading indicator while pending", async () => {
    const { getByLabelText, getByRole } = await renderCard({
      photoUris: [PHOTOS[0]],
      state: { status: "pending" },
    });

    expect(getByRole("button", { name: "Tomar foto" })).toBeDisabled();
    expect(getByRole("button", { name: "Elegir de galería" })).toBeDisabled();
    expect(getByRole("button", { name: "Quitar foto 1" })).toBeDisabled();
    expect(getByLabelText("Cargando fotos")).toBeTruthy();
  });

  test("disables every action when the form is locked", async () => {
    const { getByRole } = await renderCard({
      photoUris: [PHOTOS[0]],
      disabled: true,
    });

    expect(getByRole("button", { name: "Tomar foto" })).toBeDisabled();
    expect(getByRole("button", { name: "Elegir de galería" })).toBeDisabled();
    expect(getByRole("button", { name: "Quitar foto 1" })).toBeDisabled();
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
