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
jest.mock("@/components/icons/LocationIcon", () => ({
  __esModule: true,
  default: () => null,
}));

jest.mock("expo-image", () => {
  const { createElement } = jest.requireActual("react");
  const { View } = jest.requireActual("react-native");

  return {
    Image: ({
      accessibilityLabel,
      style,
    }: {
      accessibilityLabel?: string;
      style?: unknown;
    }) =>
      createElement(View, {
        accessible: true,
        accessibilityRole: "image",
        accessibilityLabel,
        style,
      }),
  };
});

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

  test("renders the photo, address, contact, and calendar attachments", async () => {
    const task = buildTask({
      photoUri: "file:///photo.jpg",
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

    const { getByLabelText, getByText } = await render(
      <TaskAttachments task={task} isComplete={false} />,
    );

    expect(getByLabelText("Foto de la tarea")).toBeTruthy();
    expect(getByText("Av. Corrientes 1234")).toBeTruthy();
    expect(getByText("Ana Pérez · 11 5555-1111")).toBeTruthy();
    expect(getByText("Evento")).toBeTruthy();
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

  test("applies the completed treatment to the photo and text", async () => {
    const task = buildTask({
      photoUri: "file:///photo.jpg",
      contact: {
        id: "contact-1",
        name: "Ana Pérez",
        phoneNumber: "11 5555-1111",
      },
    });

    const { getByLabelText, getByText } = await render(
      <TaskAttachments task={task} isComplete />,
    );

    expect(getByText("Ana Pérez · 11 5555-1111")).toHaveStyle({
      textDecorationLine: "line-through",
    });
    expect(getByLabelText("Foto de la tarea")).toHaveStyle({ opacity: 0.6 });
  });
});
