import { fireEvent, render } from "@testing-library/react-native";
import { router } from "expo-router";

import { NoTaskSelected } from "@/components/ui/task-form/no-task-selected";

jest.mock("expo-router", () => ({
  router: { setParams: jest.fn() },
}));

const routerMock = jest.mocked(router);

describe("<NoTaskSelected />", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders the placeholder copy", async () => {
    const { getByText } = await render(<NoTaskSelected />);

    expect(getByText("Ninguna tarea seleccionada")).toBeTruthy();
    expect(
      getByText("Elegí una tarea de la lista o creá una nueva."),
    ).toBeTruthy();
  });

  test("starts a new task when Crear tarea is pressed", async () => {
    const { getByRole } = await render(<NoTaskSelected />);

    await fireEvent.press(getByRole("button", { name: "Crear tarea" }));

    expect(routerMock.setParams).toHaveBeenCalledWith({
      id: "",
      mode: "create",
    });
  });
});
