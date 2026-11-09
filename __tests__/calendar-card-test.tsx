import { fireEvent, render } from "@testing-library/react-native";
import type { ComponentProps } from "react";

import { CalendarCard } from "@/components/ui/task-form/calendar-card";
import type { DeviceActionState } from "@/utils/permission-state";

jest.mock("@/components/icons/CalendarIcon", () => ({
  __esModule: true,
  default: () => null,
}));

const renderCard = async (
  overrides: Partial<ComponentProps<typeof CalendarCard>> = {},
) => {
  const handlers = {
    onToggle: jest.fn(),
    onRetry: jest.fn(),
    onOpenSettings: jest.fn(),
  };
  const utils = await render(
    <CalendarCard
      enabled={false}
      eventId={null}
      state={{ status: "idle" }}
      {...handlers}
      {...overrides}
    />,
  );

  return { ...utils, ...handlers };
};

describe("<CalendarCard />", () => {
  test("renders the disabled state and calls the toggle handler", async () => {
    const { getByText, getByRole, onToggle } = await renderCard();

    expect(getByText("Sin evento")).toBeTruthy();
    fireEvent(
      getByRole("switch", { name: "Evento en el calendario" }),
      "valueChange",
      true,
    );

    expect(onToggle).toHaveBeenCalledTimes(1);
  });

  test("renders the enabled state", async () => {
    const { getByText, getByRole } = await renderCard({ enabled: true });

    expect(getByText("Evento en el calendario")).toBeTruthy();
    expect(
      getByRole("switch", { name: "Evento en el calendario" }),
    ).toBeTruthy();
  });

  test("renders the created label when there is an event id", async () => {
    const { getByText } = await renderCard({
      enabled: true,
      eventId: "event-1",
    });

    expect(getByText("Evento creado")).toBeTruthy();
  });

  test("warns the event will be removed when disabled with an event id", async () => {
    const { getByText } = await renderCard({ eventId: "event-1" });

    expect(getByText("Se quitará al guardar la tarea")).toBeTruthy();
  });

  test("does not render the create helper when disabled without an event", async () => {
    const { getByText, queryByText } = await renderCard();

    expect(getByText("Sin evento")).toBeTruthy();
    expect(queryByText("Se crea al guardar la tarea")).toBeNull();
  });

  test("renders the pending permission label", async () => {
    const state: DeviceActionState = { status: "pending" };
    const { getByText } = await renderCard({ state });

    expect(getByText("Verificando permiso...")).toBeTruthy();
  });

  test("renders the permission notice when calendar access is denied", async () => {
    const state: DeviceActionState = { status: "denied", canAskAgain: true };
    const { getByText, getByRole, onRetry } = await renderCard({ state });

    expect(
      getByText("Permiso denegado. Podés volver a intentarlo."),
    ).toBeTruthy();
    await fireEvent.press(getByRole("button", { name: "Reintentar" }));

    expect(onRetry).toHaveBeenCalledTimes(1);
  });
});
