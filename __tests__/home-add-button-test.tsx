import { fireEvent, render } from "@testing-library/react-native";
import { router } from "expo-router";

import { HomeAddButton } from "@/components/ui/home/home-add-button";
import { ROUTES, TASK_FORM_PARAMS } from "@/constants/routes";

jest.mock("expo-router", () => ({
  router: { push: jest.fn() },
}));

const routerMock = jest.mocked(router);

describe("<HomeAddButton />", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("pushes the task form in create mode when pressed", async () => {
    const { getByRole } = await render(<HomeAddButton />);

    await fireEvent.press(getByRole("button", { name: "Crear tarea" }));

    expect(routerMock.push).toHaveBeenCalledWith({
      pathname: ROUTES.taskForm,
      params: TASK_FORM_PARAMS.create,
    });
  });
});
