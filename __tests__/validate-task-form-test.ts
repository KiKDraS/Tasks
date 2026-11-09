import { REMINDER_TYPES } from "@/context/tasks/types/Reminder";
import { TASK_FORM_MESSAGES } from "@/hooks/task-form/constants";
import { initialTaskFormState } from "@/hooks/task-form/task-form-reducer";
import { TaskFormState } from "@/hooks/task-form/types/TaskForm";
import { validateTaskForm } from "@/hooks/task-form/utils/validate-task-form";

const buildFormState = (
  overrides: Partial<TaskFormState> = {},
): TaskFormState => ({
  ...initialTaskFormState,
  ...overrides,
});

describe("validateTaskForm", () => {
  test("requires a title", () => {
    const { titleError, isValid } = validateTaskForm(
      buildFormState({ title: "   " }),
    );

    expect(titleError).toBe(TASK_FORM_MESSAGES.titleRequired);
    expect(isValid).toBe(false);
  });

  test("blocks submission when the reminder is invalid", () => {
    const { isValid } = validateTaskForm(
      buildFormState({
        title: "Comprar leche",
        reminderEnabled: true,
        reminder: { type: REMINDER_TYPES.TIME, seconds: 0 },
        reminderError: TASK_FORM_MESSAGES.invalidReminderTime,
      }),
    );

    expect(isValid).toBe(false);
  });

  test("blocks submission when the calendar is enabled and the reminder is invalid", () => {
    const { isValid } = validateTaskForm(
      buildFormState({
        title: "Comprar leche",
        reminderEnabled: false,
        calendarEnabled: true,
        reminderError: TASK_FORM_MESSAGES.invalidReminderTime,
      }),
    );

    expect(isValid).toBe(false);
  });

  test("accepts a calendar-only form with an existing event despite a stale reminder error", () => {
    const { isValid } = validateTaskForm(
      buildFormState({
        title: "Comprar leche",
        reminderEnabled: false,
        calendarEnabled: true,
        calendarEventId: "event-1",
        reminderError: TASK_FORM_MESSAGES.invalidReminderTime,
      }),
    );

    expect(isValid).toBe(true);
  });

  test("accepts a complete form", () => {
    const { isValid } = validateTaskForm(
      buildFormState({ title: "Comprar leche" }),
    );

    expect(isValid).toBe(true);
  });
});
