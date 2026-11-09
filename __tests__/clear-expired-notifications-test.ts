import { Task } from "@/context/tasks/types/Task";
import { clearExpiredTaskNotifications } from "@/context/tasks/utils/clear-expired-notifications";

const NOW = new Date("2026-01-01T12:00:00.000Z");

const buildTask = (overrides: Partial<Task> = {}): Task => ({
  id: "task-1",
  title: "Comprar pan",
  description: "Ir al almacén",
  notification: null,
  ...overrides,
});

describe("clearExpiredTaskNotifications", () => {
  test("clears a past notification and reports the change", () => {
    const task = buildTask({
      notification: {
        id: "notification-past",
        scheduledAt: "2026-01-01T11:59:59.000Z",
      },
    });

    const result = clearExpiredTaskNotifications([task], NOW);

    expect(result.changed).toBe(true);
    expect(result.tasks).toEqual([{ ...task, notification: null }]);
  });

  test("leaves future and null notifications untouched", () => {
    const tasks = [
      buildTask({
        id: "task-future",
        notification: {
          id: "notification-future",
          scheduledAt: "2026-01-01T12:00:01.000Z",
        },
      }),
      buildTask({ id: "task-none" }),
    ];

    const result = clearExpiredTaskNotifications(tasks, NOW);

    expect(result.changed).toBe(false);
    expect(result.tasks).toBe(tasks);
  });
});
