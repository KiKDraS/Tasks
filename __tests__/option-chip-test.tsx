import { fireEvent, render } from "@testing-library/react-native";
import { Text } from "react-native";

import { OptionChip } from "@/components/ui/task-form/reminder-options/option-chip";

function renderChip(selected: boolean, onPress = jest.fn()) {
  return render(
    <OptionChip selected={selected} onPress={onPress}>
      <Text>Tiempo</Text>
    </OptionChip>,
  );
}

describe("<OptionChip />", () => {
  test("exposes a button role with the selected state", async () => {
    const { getByRole } = await renderChip(true);

    const chip = getByRole("button", { name: "Tiempo", selected: true });

    expect(chip).toBeSelected();
  });

  test("reports an unselected chip as not selected", async () => {
    const { getByRole } = await renderChip(false);

    const chip = getByRole("button", { name: "Tiempo", selected: false });

    expect(chip).not.toBeSelected();
  });

  test("calls onPress when pressed", async () => {
    const onPress = jest.fn();
    const { getByRole } = await renderChip(false, onPress);

    await fireEvent.press(getByRole("button", { name: "Tiempo" }));

    expect(onPress).toHaveBeenCalledTimes(1);
  });
});
