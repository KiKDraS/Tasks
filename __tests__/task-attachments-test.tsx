import { render } from "@testing-library/react-native";

import { TaskAttachments } from "@/components/ui/home/home-task/task-attachments";
import type { Task, TaskShare } from "@/context/tasks/types/Task";

jest.mock("@/components/icons/CalendarIcon", () => ({
  __esModule: true,
  default: () => null,
}));
jest.mock("@/components/icons/GalleryIcon", () => ({
  __esModule: true,
  default: () => null,
}));
jest.mock("@/components/icons/LocationIcon", () => ({
  __esModule: true,
  default: () => null,
}));
jest.mock("@/components/icons/ShareIcon", () => ({
  __esModule: true,
  default: () => null,
}));

const OLD_SHARE: TaskShare = {
  method: "share",
  activityType: "com.apple.UIKit.activity.Mail",
  sharedAt: "2026-11-08T10:00:00",
};

const NEW_SHARE: TaskShare = {
  method: "contact",
  recipientName: "Ana Pérez",
  activityType: "net.whatsapp.WhatsApp",
  sharedAt: "2026-11-09T14:30:00",
};

const buildTask = (overrides: Partial<Task> = {}): Task => ({
  id: "task-1",
  title: "Comprar pan",
  description: "Ir al almacén",
  isComplete: false,
  notification: null,
  ...overrides,
});

describe("<TaskAttachments />", () => {
  test("renders nothing when the task has no attachments", async () => {
    const { toJSON } = await render(
      <TaskAttachments task={buildTask()} isComplete={false} />,
    );

    expect(toJSON()).toBeNull();
  });

  test("renders the photo count with the address and calendar meta", async () => {
    const task = buildTask({
      photoUris: [
        "file:///photo-1.jpg",
        "file:///photo-2.jpg",
        "file:///photo-3.jpg",
      ],
      location: {
        latitude: -34.6037,
        longitude: -58.3816,
        address: "Av. Corrientes 1234",
      },
      calendarEventId: "event-1",
    });

    const { getByText, queryByRole } = await render(
      <TaskAttachments task={task} isComplete={false} />,
    );

    expect(getByText("3 fotos")).toBeTruthy();
    expect(getByText("Av. Corrientes 1234")).toBeTruthy();
    expect(getByText("Evento")).toBeTruthy();
    expect(queryByRole("image")).toBeNull();
  });

  test("uses the singular count for one photo", async () => {
    const task = buildTask({ photoUris: ["file:///photo-1.jpg"] });

    const { getByText } = await render(
      <TaskAttachments task={task} isComplete={false} />,
    );

    expect(getByText("1 foto")).toBeTruthy();
  });

  test("counts a legacy photoUri as one photo", async () => {
    const task = buildTask({ photoUri: "file:///legacy.jpg" });

    const { getByText, queryByRole } = await render(
      <TaskAttachments task={task} isComplete={false} />,
    );

    expect(getByText("1 foto")).toBeTruthy();
    expect(queryByRole("image")).toBeNull();
  });

  test("renders only the count row when the task has photos and no other meta", async () => {
    const task = buildTask({
      photoUris: ["file:///photo-1.jpg", "file:///photo-2.jpg"],
    });

    const { getByText, queryByRole, queryByText } = await render(
      <TaskAttachments task={task} isComplete={false} />,
    );

    expect(getByText("2 fotos")).toBeTruthy();
    expect(queryByText("Evento")).toBeNull();
    expect(queryByRole("image")).toBeNull();
  });

  test("falls back to coordinates when the location has no address", async () => {
    const task = buildTask({
      location: { latitude: -34.6037, longitude: -58.3816 },
    });

    const { getByText } = await render(
      <TaskAttachments task={task} isComplete={false} />,
    );

    expect(getByText("-34.6037, -58.3816")).toBeTruthy();
  });

  test("applies the completed treatment to the meta labels", async () => {
    const task = buildTask({
      photoUri: "file:///photo.jpg",
    });

    const { getByText } = await render(
      <TaskAttachments task={task} isComplete />,
    );

    expect(getByText("1 foto")).toHaveStyle({
      textDecorationLine: "line-through",
    });
  });

  test("shows only the newest share when the history has two", async () => {
    const task = buildTask({ shares: [OLD_SHARE, NEW_SHARE] });

    const { getByText, queryByText } = await render(
      <TaskAttachments task={task} isComplete={false} />,
    );

    expect(getByText("Compartida con Ana Pérez · WhatsApp")).toBeTruthy();
    expect(queryByText("Compartida · Mail")).toBeNull();
  });

  test("labels a contact share with the recipient", async () => {
    const task = buildTask({
      shares: [
        {
          method: "contact",
          recipientName: "Ana Pérez",
          sharedAt: OLD_SHARE.sharedAt,
        },
      ],
    });

    const { getByText } = await render(
      <TaskAttachments task={task} isComplete={false} />,
    );

    expect(getByText("Compartida con Ana Pérez · Contacto")).toBeTruthy();
  });

  test("labels a generic share without a target", async () => {
    const task = buildTask({
      location: { latitude: -34.6037, longitude: -58.3816 },
      shares: [{ method: "share", sharedAt: OLD_SHARE.sharedAt }],
    });

    const { getByText } = await render(
      <TaskAttachments task={task} isComplete={false} />,
    );

    expect(getByText("Compartida")).toBeTruthy();
  });

  test("renders the share row for a task with only shares", async () => {
    const task = buildTask({
      shares: [NEW_SHARE],
    });

    const { getByText, toJSON } = await render(
      <TaskAttachments task={task} isComplete={false} />,
    );

    expect(toJSON()).not.toBeNull();
    expect(getByText("Compartida con Ana Pérez · WhatsApp")).toBeTruthy();
  });
});
