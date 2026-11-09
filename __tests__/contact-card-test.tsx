import { fireEvent, render } from "@testing-library/react-native";
import type { ComponentProps } from "react";

import { ContactCard } from "@/components/ui/task-form/contact-card";
import type { TaskContact } from "@/context/tasks/types/Task";
import type { DeviceActionState } from "@/utils/permission-state";

jest.mock("@/components/icons/ContactIcon", () => ({
  __esModule: true,
  default: () => null,
}));

const CONTACT: TaskContact = {
  id: "contact-1",
  name: "Ana Pérez",
  phoneNumber: "11 5555-1111",
};

const renderCard = async (
  overrides: Partial<ComponentProps<typeof ContactCard>> = {},
) => {
  const handlers = {
    onPickContact: jest.fn(),
    onRemoveContact: jest.fn(),
    onRetry: jest.fn(),
    onOpenSettings: jest.fn(),
  };
  const utils = await render(
    <ContactCard
      contact={null}
      state={{ status: "idle" }}
      {...handlers}
      {...overrides}
    />,
  );

  return { ...utils, ...handlers };
};

describe("<ContactCard />", () => {
  test("renders the empty state and calls the pick handler", async () => {
    const { getByText, getByRole, onPickContact } = await renderCard();

    expect(getByText("Sin contacto")).toBeTruthy();
    await fireEvent.press(getByRole("button", { name: "Elegir contacto" }));

    expect(onPickContact).toHaveBeenCalledTimes(1);
  });

  test("renders the contact name and phone and calls the remove handler", async () => {
    const { getByText, getByRole, onRemoveContact } = await renderCard({
      contact: CONTACT,
    });

    expect(getByText("Ana Pérez · 11 5555-1111")).toBeTruthy();
    await fireEvent.press(getByRole("button", { name: "Quitar contacto" }));

    expect(onRemoveContact).toHaveBeenCalledTimes(1);
  });

  test("renders the permission notice when contact access is denied", async () => {
    const state: DeviceActionState = { status: "denied", canAskAgain: true };
    const { getByText, getByRole, onRetry } = await renderCard({ state });

    expect(
      getByText("Permiso denegado. Podés volver a intentarlo."),
    ).toBeTruthy();
    await fireEvent.press(getByRole("button", { name: "Reintentar" }));

    expect(onRetry).toHaveBeenCalledTimes(1);
  });
});
