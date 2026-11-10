import { fireEvent, render } from "@testing-library/react-native";

import { TaskActions } from "@/components/ui/home/home-task/task-actions";

jest.mock("@/components/icons/DeleteIcon", () => ({
  __esModule: true,
  default: () => null,
}));
jest.mock("@/components/icons/EditIcon", () => ({
  __esModule: true,
  default: () => null,
}));
jest.mock("@/components/icons/ShareIcon", () => ({
  __esModule: true,
  default: () => null,
}));

describe("<TaskActions />", () => {
  test("renders the share button and calls the share handler", async () => {
    const onShare = jest.fn();
    const { getByRole } = await render(
      <TaskActions
        title="Comprar pan"
        onEdit={jest.fn()}
        onShare={onShare}
        onDelete={jest.fn()}
      />,
    );

    const shareButton = getByRole("button", {
      name: "Compartir Comprar pan",
    });

    await fireEvent.press(shareButton);

    expect(onShare).toHaveBeenCalledTimes(1);
  });
});
