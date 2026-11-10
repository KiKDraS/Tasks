import { fireEvent, render } from "@testing-library/react-native";
import type { ComponentProps } from "react";

import { ReminderOptions } from "@/components/ui/task-form/reminder-options";
import {
  REMINDER_TYPES,
  type ReminderSelection,
} from "@/context/tasks/types/Reminder";

jest.mock("@expo/ui/community/datetime-picker", () => ({
  DateTimePicker: () => null,
}));

const DATE_REMINDER: ReminderSelection = {
  type: REMINDER_TYPES.DATE,
  date: new Date("2026-05-10T18:30:00.000Z"),
};

const renderOptions = async (
  overrides: Partial<ComponentProps<typeof ReminderOptions>> = {},
) => {
  const onSelect = jest.fn();
  const utils = await render(
    <ReminderOptions
      visible
      reminder={DATE_REMINDER}
      onSelect={onSelect}
      {...overrides}
    />,
  );

  return { ...utils, onSelect };
};

describe("<ReminderOptions /> date reminder", () => {
  test("opens the iOS picker sheet from the Fecha field", async () => {
    const { getByRole, queryByRole } = await renderOptions();

    expect(queryByRole("button", { name: "Listo" })).toBeNull();

    await fireEvent.press(getByRole("button", { name: "Fecha" }));

    expect(getByRole("button", { name: "Listo" })).toBeTruthy();
  });

  test("closes the iOS picker sheet with Listo", async () => {
    const { getByRole, queryByRole } = await renderOptions();

    await fireEvent.press(getByRole("button", { name: "Fecha" }));
    await fireEvent.press(getByRole("button", { name: "Listo" }));

    expect(queryByRole("button", { name: "Listo" })).toBeNull();
  });

  test("disables the field and keeps the sheet closed when disabled", async () => {
    const { getByRole, queryByRole } = await renderOptions({ disabled: true });

    const field = getByRole("button", { name: "Fecha" });
    expect(field.props.accessibilityState.disabled).toBe(true);

    await fireEvent.press(field);

    expect(queryByRole("button", { name: "Listo" })).toBeNull();
  });
});
