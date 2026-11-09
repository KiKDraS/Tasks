import { render } from "@testing-library/react-native";

import { ReminderOptions } from "@/components/ui/task-form/reminder-options";
import type { TimeReminder } from "@/context/tasks/types/Reminder";

interface JsonNode {
  props: Record<string, unknown>;
  children: (JsonNode | string)[] | null;
}

const REMINDER: TimeReminder = { type: "time", seconds: 15 * 60 };

function renderOptions(disabled?: boolean) {
  return render(
    <ReminderOptions
      visible
      reminder={REMINDER}
      onSelect={jest.fn()}
      disabled={disabled}
    />,
  );
}

function findByProp(
  node: JsonNode | string | null,
  prop: string,
  value: unknown,
): JsonNode | null {
  if (!node || typeof node === "string") {
    return null;
  }

  if (node.props[prop] === value) {
    return node;
  }

  return (
    node.children
      ?.map((child) => findByProp(child, prop, value))
      .find(Boolean) ?? null
  );
}

describe("<ReminderOptions /> accessibility", () => {
  test("hides the disabled subtree from screen readers", async () => {
    const { toJSON, queryByRole } = await renderOptions(true);
    const tree = toJSON() as unknown as JsonNode;

    const container = findByProp(
      tree,
      "importantForAccessibility",
      "no-hide-descendants",
    );

    expect(container?.props.accessibilityElementsHidden).toBe(true);
    expect(container?.props.pointerEvents).toBe("none");
    expect(queryByRole("button", { name: "15m" })).toBeNull();
  });

  test("keeps the subtree accessible when enabled", async () => {
    const { toJSON, getByRole } = await renderOptions();
    const tree = toJSON() as unknown as JsonNode;

    expect(
      findByProp(tree, "importantForAccessibility", "no-hide-descendants"),
    ).toBeNull();
    expect(getByRole("button", { name: "15m" })).toBeSelected();
  });
});
