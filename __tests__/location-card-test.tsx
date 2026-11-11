import { fireEvent, render } from "@testing-library/react-native";
import type { ComponentProps } from "react";

import { LocationCard } from "@/components/ui/task-form/location-card";
import type { TaskLocation } from "@/context/tasks/types/Task";
import type { DeviceActionState } from "@/utils/permission-state";

jest.mock("@/components/icons/LocationIcon", () => ({
  __esModule: true,
  default: () => null,
}));

const LOCATION: TaskLocation = {
  latitude: -34.603712,
  longitude: -58.381569,
};

const renderCard = async (
  overrides: Partial<ComponentProps<typeof LocationCard>> = {},
) => {
  const handlers = {
    onGetLocation: jest.fn(),
    onRemoveLocation: jest.fn(),
    onRetry: jest.fn(),
    onOpenSettings: jest.fn(),
  };
  const utils = await render(
    <LocationCard
      location={null}
      state={{ status: "idle" }}
      {...handlers}
      {...overrides}
    />,
  );

  return { ...utils, ...handlers };
};

describe("<LocationCard />", () => {
  test("renders the empty state", async () => {
    const { getByText } = await renderCard();

    expect(getByText("Sin ubicación")).toBeTruthy();
  });

  test("renders the address when present", async () => {
    const { getByRole, getByText, queryByText, onGetLocation } = await renderCard({
      location: { ...LOCATION, address: "Av. Corrientes 1234" },
    });

    expect(getByText("Av. Corrientes 1234")).toBeTruthy();
    expect(queryByText("Sin ubicación")).toBeNull();
    await fireEvent.press(
      getByRole("button", { name: "Usar mi ubicación" }),
    );

    expect(onGetLocation).toHaveBeenCalledTimes(1);
  });

  test("renders coordinates with four decimals without an address", async () => {
    const { getByText } = await renderCard({ location: LOCATION });

    expect(getByText("-34.6037, -58.3816")).toBeTruthy();
  });

  test("renders the loading label while the location is pending", async () => {
    const state: DeviceActionState = { status: "pending" };
    const { getByText } = await renderCard({ state });

    expect(getByText("Obteniendo ubicación...")).toBeTruthy();
  });

  test("calls the remove handler for an attached location", async () => {
    const { getByRole, onRemoveLocation } = await renderCard({
      location: LOCATION,
    });

    await fireEvent.press(getByRole("button", { name: "Quitar ubicación" }));

    expect(onRemoveLocation).toHaveBeenCalledTimes(1);
  });
});
