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
    onSelect: jest.fn(),
    onRetryCalendar: jest.fn(),
    onOpenSettings: jest.fn(),
  };
  const utils = await render(
    <ScheduleCard
      reminderEnabled={false}
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
  test("renders a single Recordatorio switch", async () => {
    const { getByRole, getByText, queryByRole } = await renderCard();

    expect(getByText("Recordatorio")).toBeTruthy();
    expect(getByRole("switch", { name: "Recordatorio" })).toBeTruthy();
    expect(queryByRole("switch", { name: "Notificación en la app" })).toBeNull();
    expect(
      queryByRole("switch", { name: "Evento en el calendario" }),
    ).toBeNull();
  });

  test("calls the reminder toggle handler", async () => {
    const { getByRole, onToggleReminder } = await renderCard();

    await fireEvent.press(getByRole("switch", { name: "Recordatorio" }));

    expect(onToggleReminder).toHaveBeenCalledTimes(1);
  });

  test("hides the reminder options, hints, and error when the reminder is off", async () => {
    const error = TASK_FORM_MESSAGES.invalidReminderTime;
    const { queryByText } = await renderCard({ error });

    expect(queryByText("Tiempo")).toBeNull();
    expect(queryByText("Fecha y hora")).toBeNull();
    expect(queryByText("La notificación se enviará en 15 minutos")).toBeNull();
    expect(
      queryByText(
        "La notificación se enviará y el evento se agregará al calendario en 15 minutos",
      ),
    ).toBeNull();
    expect(queryByText("Se agregará al calendario al guardar")).toBeNull();
    expect(queryByText(error)).toBeNull();
  });

  test("shows the combined hint and permission label while the calendar permission is idle", async () => {
    const { getByText, queryByText } = await renderCard({
      reminderEnabled: true,
    });

    expect(
      getByText(
        "La notificación se enviará y el evento se agregará al calendario en 15 minutos",
      ),
    ).toBeTruthy();
    expect(getByText("Se pedirá permiso al guardar")).toBeTruthy();
    expect(
      queryByText("La notificación se enviará en 15 minutos"),
    ).toBeNull();
    expect(queryByText("Se agregará al calendario al guardar")).toBeNull();
  });

  test("shows the combined hint and calendar label when the permission is granted", async () => {
    const { getByText, queryByText } = await renderCard({
      reminderEnabled: true,
      calendarState: { status: "granted" },
    });

    expect(
      getByText(
        "La notificación se enviará y el evento se agregará al calendario en 15 minutos",
      ),
    ).toBeTruthy();
    expect(getByText("Se agregará al calendario al guardar")).toBeTruthy();
    expect(
      queryByText("La notificación se enviará en 15 minutos"),
    ).toBeNull();
  });

  test("shows only the notification hint when the event already exists", async () => {
    const { getByText, queryByText } = await renderCard({
      reminderEnabled: true,
      calendarEventId: "event-1",
      calendarState: { status: "granted" },
    });

    expect(
      getByText("La notificación se enviará en 15 minutos"),
    ).toBeTruthy();
    expect(getByText("Evento agregado")).toBeTruthy();
    expect(
      queryByText(
        "La notificación se enviará y el evento se agregará al calendario en 15 minutos",
      ),
    ).toBeNull();
    expect(queryByText("Se agregará al calendario al guardar")).toBeNull();
  });

  test("hides the hint for a completed task with the reminder on", async () => {
    const { queryByText } = await renderCard({
      reminderEnabled: true,
      isComplete: true,
      calendarState: { status: "granted" },
    });

    expect(
      queryByText(
        "La notificación se enviará y el evento se agregará al calendario en 15 minutos",
      ),
    ).toBeNull();
    expect(
      queryByText("La notificación se enviará en 15 minutos"),
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

  test("renders the pending permission label and disables the switch", async () => {
    const state: DeviceActionState = { status: "pending" };
    const { getByText, getByRole } = await renderCard({
      reminderEnabled: true,
      calendarState: state,
    });

    expect(getByText("Verificando permiso...")).toBeTruthy();
    expect(
      getByRole("switch", { name: "Recordatorio" }).props.accessibilityState
        .disabled,
    ).toBe(true);
  });

  test("renders the denied label and retries the permission request", async () => {
    const state: DeviceActionState = { status: "denied", canAskAgain: true };
    const { getByText, getByRole, onRetryCalendar } = await renderCard({
      reminderEnabled: true,
      calendarState: state,
    });

    expect(getByText("No se agregará al calendario")).toBeTruthy();
    expect(
      getByText("Permiso denegado. Podés volver a intentarlo."),
    ).toBeTruthy();
    await fireEvent.press(getByRole("button", { name: "Reintentar" }));

    expect(onRetryCalendar).toHaveBeenCalledTimes(1);
  });

  test("renders the blocked label and the settings action", async () => {
    const state: DeviceActionState = { status: "blocked" };
    const { getByText, getByRole, onOpenSettings } = await renderCard({
      reminderEnabled: true,
      calendarState: state,
    });

    expect(getByText("No se agregará al calendario")).toBeTruthy();
    expect(getByText("Permiso denegado. Habilitalo en Ajustes.")).toBeTruthy();
    await fireEvent.press(getByRole("button", { name: "Abrir ajustes" }));

    expect(onOpenSettings).toHaveBeenCalledTimes(1);
  });

  test("renders the error label and message", async () => {
    const message = "No pudimos acceder a tu calendario. Intentá de nuevo.";
    const state: DeviceActionState = { status: "error", message };
    const { getByText } = await renderCard({
      reminderEnabled: true,
      calendarState: state,
    });

    expect(getByText("No se agregará al calendario")).toBeTruthy();
    expect(getByText(message)).toBeTruthy();
  });

  test("warns the event will be removed when disabled with an event id", async () => {
    const { getByText } = await renderCard({ calendarEventId: "event-1" });

    expect(getByText("Se quitará al guardar")).toBeTruthy();
  });

  test("disables the switch when the card is disabled", async () => {
    const { getByRole } = await renderCard({ disabled: true });

    expect(
      getByRole("switch", { name: "Recordatorio" }).props.accessibilityState
        .disabled,
    ).toBe(true);
  });

  test("disables the retry action when requested", async () => {
    const { getByRole } = await renderCard({
      reminderEnabled: true,
      calendarState: { status: "denied", canAskAgain: true },
      retryDisabled: true,
    });

    expect(getByRole("button", { name: "Reintentar" })).toBeDisabled();
  });
});
