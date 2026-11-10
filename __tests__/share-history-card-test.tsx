import { render } from "@testing-library/react-native";

import { ShareHistoryCard } from "@/components/ui/task-form/share-history-card";
import type { TaskShare } from "@/context/tasks/types/Task";

jest.mock("@/components/icons/ShareIcon", () => ({
  __esModule: true,
  default: () => null,
}));

const OLD_SHARE: TaskShare = {
  method: "share",
  sharedAt: "2026-11-08T10:00:00",
};

const NEW_SHARE: TaskShare = {
  method: "contact",
  recipientName: "Ana Pérez",
  activityType: "net.whatsapp.WhatsApp",
  sharedAt: "2026-11-09T14:30:00",
};

describe("<ShareHistoryCard />", () => {
  test("renders nothing when there are no shares", async () => {
    const { toJSON } = await render(<ShareHistoryCard shares={[]} />);

    expect(toJSON()).toBeNull();
  });

  test("lists the newest share first with its date", async () => {
    const { getAllByText, getByText } = await render(
      <ShareHistoryCard shares={[OLD_SHARE, NEW_SHARE]} />,
    );

    const labels = getAllByText(/Compartida/);

    expect(getByText("Historial de envíos")).toBeTruthy();
    expect(labels).toHaveLength(2);
    expect(labels[0]).toHaveTextContent("Compartida con Ana Pérez · WhatsApp");
    expect(labels[1]).toHaveTextContent("Compartida");
    expect(getByText("9 nov 2026, 14:30")).toBeTruthy();
    expect(getByText("8 nov 2026, 10:00")).toBeTruthy();
  });
});
