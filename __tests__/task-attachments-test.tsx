import { render } from "@testing-library/react-native";

import { TaskAttachments } from "@/components/ui/home/home-task/task-attachments";
import type { Task } from "@/context/tasks/types/Task";

jest.mock("@/components/icons/CalendarIcon", () => ({
  __esModule: true,
  default: () => null,
}));
jest.mock("@/components/icons/ContactIcon", () => ({
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

  test("renders the photo count with the address, contact, and calendar meta", async () => {
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
      contact: {
        id: "contact-1",
        name: "Ana Pérez",
        phoneNumber: "11 5555-1111",
      },
      calendarEventId: "event-1",
    });

    const { getByText, queryByRole } = await render(
      <TaskAttachments task={task} isComplete={false} />,
    );

    expect(getByText("3 fotos")).toBeTruthy();
    expect(getByText("Av. Corrientes 1234")).toBeTruthy();
    expect(getByText("Ana Pérez · 11 5555-1111")).toBeTruthy();
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

  test("renders a contact without a phone number", async () => {
    const task = buildTask({
      contact: { id: "contact-1", name: "Ana Pérez" },
    });

    const { getByText } = await render(
      <TaskAttachments task={task} isComplete={false} />,
    );

    expect(getByText("Ana Pérez")).toBeTruthy();
  });

  test("applies the completed treatment to the meta labels", async () => {
    const task = buildTask({
      photoUri: "file:///photo.jpg",
      contact: {
        id: "contact-1",
        name: "Ana Pérez",
        phoneNumber: "11 5555-1111",
      },
    });

    const { getByText } = await render(
      <TaskAttachments task={task} isComplete />,
    );

    expect(getByText("1 foto")).toHaveStyle({
      textDecorationLine: "line-through",
    });
    expect(getByText("Ana Pérez · 11 5555-1111")).toHaveStyle({
      textDecorationLine: "line-through",
    });
  });
});
