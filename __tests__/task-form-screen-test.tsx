import { render } from "@testing-library/react-native";
import { useLocalSearchParams } from "expo-router";

import TaskFormScreen from "@/app/(tabs)/task-form/index";

const mockTaskForm = jest.fn((_props: { taskId?: string }) => null);

jest.mock("@/components/ui/task-form/task-form", () => ({
  TaskForm: (props: { taskId?: string }) => mockTaskForm(props),
}));

jest.mock("expo-router", () => ({
  router: { setParams: jest.fn() },
  useLocalSearchParams: jest.fn(),
}));

const paramsMock = useLocalSearchParams as unknown as jest.Mock;

describe("<TaskFormScreen />", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders the placeholder when there is no task and no create mode", async () => {
    paramsMock.mockReturnValue({});

    const { getByText, queryByText } = await render(<TaskFormScreen />);

    expect(getByText("Ninguna tarea seleccionada")).toBeTruthy();
    expect(queryByText("Nueva tarea")).toBeNull();
    expect(queryByText("Editar tarea")).toBeNull();
  });

  test("renders the create form when mode is create", async () => {
    paramsMock.mockReturnValue({ id: "", mode: "create" });

    const { getByText, queryByText } = await render(<TaskFormScreen />);

    expect(getByText("Nueva tarea")).toBeTruthy();
    expect(
      getByText("Completá los datos para crear tu tarea"),
    ).toBeTruthy();
    expect(queryByText("Ninguna tarea seleccionada")).toBeNull();
    expect(mockTaskForm).toHaveBeenCalledWith({ taskId: undefined });
  });

  test("renders the edit form when there is a task id", async () => {
    paramsMock.mockReturnValue({ id: "task-1", mode: "" });

    const { getByText, queryByText } = await render(<TaskFormScreen />);

    expect(getByText("Editar tarea")).toBeTruthy();
    expect(getByText("Modificá los datos de tu tarea")).toBeTruthy();
    expect(queryByText("Ninguna tarea seleccionada")).toBeNull();
    expect(mockTaskForm).toHaveBeenCalledWith({ taskId: "task-1" });
  });
});
