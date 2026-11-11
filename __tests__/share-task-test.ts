import type { Task } from "@/context/tasks/types/Task";
import { buildTaskShareMessage } from "@/utils/share-task";

const buildTask = (overrides: Partial<Task> = {}): Task => ({
  id: "task-1",
  title: "Comprar pan",
  description: "Ir al almacén",
  notification: null,
  ...overrides,
});

describe("buildTaskShareMessage", () => {
  test("includes the title, description, status, location, and photo count", () => {
    const task = buildTask({
      location: {
        latitude: -34.6037,
        longitude: -58.3816,
        address: "Av. Corrientes 1234",
      },
      photoUris: ["file:///photo-1.jpg", "file:///photo-2.jpg"],
    });

    expect(buildTaskShareMessage(task)).toBe(
      [
        "Tarea: Comprar pan",
        "Descripción: Ir al almacén",
        "Estado: Pendiente",
        "Ubicación: Av. Corrientes 1234",
        "Fotos: 2",
      ].join("\n"),
    );
  });

  test("marks a completed task and omits the empty optional lines", () => {
    const task = buildTask({
      title: "Pagar la luz",
      description: "   ",
      isComplete: true,
    });

    expect(buildTaskShareMessage(task)).toBe(
      "Tarea: Pagar la luz\nEstado: Completada",
    );
  });

  test("counts a legacy single photo", () => {
    const task = buildTask({ photoUri: "file:///legacy.jpg" });

    expect(buildTaskShareMessage(task)).toContain("Fotos: 1");
  });

  test("prefixes the message with the recipient name", () => {
    expect(buildTaskShareMessage(buildTask(), "Ana Pérez")).toBe(
      [
        "Para Ana Pérez:",
        "",
        "Tarea: Comprar pan",
        "Descripción: Ir al almacén",
        "Estado: Pendiente",
      ].join("\n"),
    );
  });
});
