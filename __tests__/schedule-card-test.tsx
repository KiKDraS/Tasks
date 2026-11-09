import { fireEvent, render } from "@testing-library/react-native";
import type { ComponentProps } from "react";

import { ScheduleCard } from "@/components/ui/task-form/schedule-card";
import {
  REMINDER_TYPES,
  type ReminderSelection,
} from "@/context/tasks/types/Reminder";
import { TASK_FORM_MESSAGES } from "@/hooks/task-form/constants";
import type { DeviceActionState } from "@/utils/permission-state";

jest.mock("@/components/icons/ReminderIcon", () => ({
  __esModule: true,
  default: () => null,
}));

const REMINDER: ReminderSelection = {
  type: REMINDER_TYPES.TIME,
  seconds: 15 * 60,
};

const renderCard = async (
  overrides: Partial<ComponentProps<typeof ScheduleCard>> = {},
) => {
  const handlers = {
    onToggleReminder: jest.fn(),
    onToggleCalendar: jest.fn(),
    onSelect: jest.fn(),
    onRetryCalendar: jest.fn(),
    onOpenSettings: jest.fn(),
  };
  const utils = await render(
    <ScheduleCard
      reminderEnabled={false}
      calendarEnabled={false}
      reminder={REMINDER}
      reminderLabel="En 15 minutos"
      error={null}
      disabled={false}
      calendarEventId={null}
      calendarState={{ status: "idle" }}
      {...handlers}
      {...overrides}
    />,
  );

  return { ...utils, ...handlers };
};

describe("<ScheduleCard />", () => {
  test("renders the title and both switches", async () => {
    const { getByRole, getByText } = await renderCard();

    expect(getByRole("header", { name: "Recordatorio" })).toBeTruthy();
    expect(getByText("Notificación en la app")).toBeTruthy();
    expect(getByText("Evento en el calendario")).toBeTruthy();
    expect(
      getByRole("switch", { name: "Notificación en la app" }),
    ).toBeTruthy();
    expect(
      getByRole("switch", { name: "Evento en el calendario" }),
    ).toBeTruthy();
  });

  test("calls the reminder toggle handler", async () => {
    const { getByRole, onToggleReminder } = await renderCard();

    await fireEvent.press(
      getByRole("switch", { name: "Notificación en la app" }),
    );

    expect(onToggleReminder).toHaveBeenCalledTimes(1);
  });

  test("calls the calendar toggle handler", async () => {
    const { getByRole, onToggleCalendar } = await renderCard();

    await fireEvent.press(
      getByRole("switch", { name: "Evento en el calendario" }),
    );

    expect(onToggleCalendar).toHaveBeenCalledTimes(1);
  });

  test("hides the reminder options, hint, and error when both are off", async () => {
    const error = TASK_FORM_MESSAGES.invalidReminderTime;
    const { queryByText } = await renderCard({ error });

    expect(queryByText("Tiempo")).toBeNull();
    expect(queryByText("Fecha y hora")).toBeNull();
    expect(queryByText("La notificación se enviará en 15 minutos")).toBeNull();
    expect(queryByText("El evento se creará en 15 minutos")).toBeNull();
    expect(queryByText("Se crea al guardar la tarea")).toBeNull();
    expect(queryByText(error)).toBeNull();
  });

  test("shows the notification hint when only the reminder is on", async () => {
    const { getByText } = await renderCard({ reminderEnabled: true });

    expect(
      getByText("La notificación se enviará en 15 minutos"),
    ).toBeTruthy();
  });

  test("shows the event hint when only the calendar is on", async () => {
    const { getByText } = await renderCard({ calendarEnabled: true });

    expect(getByText("El evento se creará en 15 minutos")).toBeTruthy();
  });

  test("shows the combined hint when both are on", async () => {
    const { getByText } = await renderCard({
      reminderEnabled: true,
      calendarEnabled: true,
    });

    expect(
      getByText(
        "La notificación se enviará y el evento se creará en 15 minutos",
      ),
    ).toBeTruthy();
  });

  test("shows only the notification hint when both are on with an existing event", async () => {
    const { getByText, queryByText } = await renderCard({
      reminderEnabled: true,
      calendarEnabled: true,
      calendarEventId: "event-1",
    });

    expect(
      getByText("La notificación se enviará en 15 minutos"),
    ).toBeTruthy();
    expect(queryByText("El evento se creará en 15 minutos")).toBeNull();
    expect(
      queryByText(
        "La notificación se enviará y el evento se creará en 15 minutos",
      ),
    ).toBeNull();
  });

  test("shows the schedule error instead of the hint when enabled", async () => {
    const error = TASK_FORM_MESSAGES.invalidReminderTime;
    const { getByText, queryByText } = await renderCard({
      reminderEnabled: true,
      error,
    });

    expect(getByText(error)).toBeTruthy();
    expect(queryByText("La notificación se enviará en 15 minutos")).toBeNull();
  });

  test("renders the pending permission label", async () => {
    const state: DeviceActionState = { status: "pending" };
    const { getByText, getByRole } = await renderCard({ calendarState: state });

    expect(getByText("Verificando permiso...")).toBeTruthy();
    expect(
      getByRole("switch", { name: "Evento en el calendario" }).props
        .accessibilityState.disabled,
    ).toBe(true);
  });

  test("renders the create helper when enabled without an event", async () => {
    const { getByText } = await renderCard({ calendarEnabled: true });

    expect(getByText("Se crea al guardar la tarea")).toBeTruthy();
  });

  test("renders the created label without the creation hint when an event exists", async () => {
    const { getByText, queryByText } = await renderCard({
      calendarEnabled: true,
      calendarEventId: "event-1",
    });

    expect(getByText("Evento creado")).toBeTruthy();
    expect(queryByText("El evento se creará en 15 minutos")).toBeNull();
  });

  test("hides the reminder options when only the calendar is on with an existing event", async () => {
    const { queryByText } = await renderCard({
      calendarEnabled: true,
      calendarEventId: "event-1",
    });

    expect(queryByText("Tiempo")).toBeNull();
    expect(queryByText("Fecha y hora")).toBeNull();
  });

  test("warns the event will be removed when disabled with an event id", async () => {
    const { getByText } = await renderCard({ calendarEventId: "event-1" });

    expect(getByText("Se quitará al guardar la tarea")).toBeTruthy();
  });

  test("renders the permission notice when calendar access is denied", async () => {
    const state: DeviceActionState = { status: "denied", canAskAgain: true };
    const { getByText, getByRole, onRetryCalendar } = await renderCard({
      calendarState: state,
    });

    expect(
      getByText("Permiso denegado. Podés volver a intentarlo."),
    ).toBeTruthy();
    await fireEvent.press(getByRole("button", { name: "Reintentar" }));

    expect(onRetryCalendar).toHaveBeenCalledTimes(1);
  });

  test("renders the settings action when calendar access is blocked", async () => {
    const state: DeviceActionState = { status: "blocked" };
    const { getByText, getByRole, onOpenSettings } = await renderCard({
      calendarState: state,
    });

    expect(getByText("Permiso denegado. Habilitalo en Ajustes.")).toBeTruthy();
    await fireEvent.press(getByRole("button", { name: "Abrir ajustes" }));

    expect(onOpenSettings).toHaveBeenCalledTimes(1);
  });

  test("disables both switches when the card is disabled", async () => {
    const { getByRole } = await renderCard({ disabled: true });

    expect(
      getByRole("switch", { name: "Notificación en la app" }).props
        .accessibilityState.disabled,
    ).toBe(true);
    expect(
      getByRole("switch", { name: "Evento en el calendario" }).props
        .accessibilityState.disabled,
    ).toBe(true);
  });
});
