import { fireEvent, render } from "@testing-library/react-native";

import { TaskFormActions } from "@/components/ui/task-form/task-form-actions";

jest.mock("@/components/icons/ShareIcon", () => ({
  __esModule: true,
  default: () => null,
}));

const baseProps = {
  isSubmitting: false,
  submitDisabled: false,
  onCancel: jest.fn(),
  onSubmit: jest.fn(),
};

describe("<TaskFormActions />", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders the share button while editing and calls the handler", async () => {
    const onShare = jest.fn();
    const { getByRole } = await render(
      <TaskFormActions isEditing {...baseProps} onShare={onShare} />,
    );

    await fireEvent.press(getByRole("button", { name: "Compartir tarea" }));

    expect(onShare).toHaveBeenCalledTimes(1);
  });

  test("hides the share button when creating a task", async () => {
    const { queryByRole } = await render(
      <TaskFormActions isEditing={false} {...baseProps} onShare={jest.fn()} />,
    );

    expect(queryByRole("button", { name: "Compartir tarea" })).toBeNull();
  });

  test("hides the share button when there is no share handler", async () => {
    const { queryByRole } = await render(
      <TaskFormActions isEditing {...baseProps} />,
    );

    expect(queryByRole("button", { name: "Compartir tarea" })).toBeNull();
  });
});
