import { fireEvent, render } from "@testing-library/react-native";

import { FormButton } from "@/components/ui/form/form-button";

describe("<FormButton />", () => {
  test("renders its children", async () => {
    const { getByText } = await render(
      <FormButton onPress={() => {}}>Crear tarea</FormButton>,
    );

    expect(getByText("Crear tarea")).toBeTruthy();
  });

  test("calls onPress when pressed", async () => {
    const onPress = jest.fn();
    const { getByText } = await render(
      <FormButton onPress={onPress}>Ingresar</FormButton>,
    );

    await fireEvent.press(getByText("Ingresar"));

    expect(onPress).toHaveBeenCalledTimes(1);
  });

  test("replaces the label with a loading indicator", async () => {
    const { queryByText } = await render(
      <FormButton onPress={() => {}} loading>
        Ingresar
      </FormButton>,
    );

    expect(queryByText("Ingresar")).toBeNull();
  });

  test("exposes a button role and label", async () => {
    const { getByRole } = await render(
      <FormButton onPress={() => {}}>Crear tarea</FormButton>,
    );

    expect(getByRole("button", { name: "Crear tarea" })).toBeTruthy();
  });

  test("exposes busy and disabled state while loading", async () => {
    const { getByRole } = await render(
      <FormButton onPress={() => {}} loading>
        Ingresar
      </FormButton>,
    );

    const button = getByRole("button", { name: "Ingresar" });

    expect(button).toBeBusy();
    expect(button).toBeDisabled();
  });
});
