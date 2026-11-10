import { fireEvent, render } from "@testing-library/react-native";

import { PERMISSION_NOTICE_COPY } from "@/components/ui/permissions/constants";
import { TaskFormContent } from "@/components/ui/task-form/task-form-content";
import type { Task } from "@/context/tasks/types/Task";
import { TASK_FORM_ACTION_TYPES } from "@/hooks/task-form/constants";
import { initialTaskFormState } from "@/hooks/task-form/task-form-reducer";
import type { TaskFormState } from "@/hooks/task-form/types/TaskForm";
import { useSchedulePermission } from "@/hooks/task-form/use-schedule-permission";
import { useTaskForm } from "@/hooks/task-form/use-task-form";

jest.mock("@/components/icons/ReminderIcon", () => ({
  __esModule: true,
  default: () => null,
}));

jest.mock("@/components/icons/ShareIcon", () => ({
  __esModule: true,
  default: () => null,
}));

jest.mock("@/components/ui/task-form/task-attachment-cards", () => ({
  TaskAttachmentCards: () => null,
}));

jest.mock("@/services/permissions", () => ({
  openAppSettings: jest.fn(),
}));

jest.mock("expo-router", () => ({
  router: { back: jest.fn(), setParams: jest.fn() },
}));

jest.mock("@/hooks/task-form/use-task-form", () => ({
  useTaskForm: jest.fn(),
}));

jest.mock("@/hooks/task-form/use-schedule-permission", () => ({
  useSchedulePermission: jest.fn(),
}));

const handleSubmit = jest.fn();
const dispatch = jest.fn();
const requestPermission = jest.fn().mockResolvedValue(undefined);

function mockFormState(
  overrides: Partial<TaskFormState> = {},
  isEditing = false,
) {
  jest.mocked(useTaskForm).mockReturnValue({
    state: {
      ...initialTaskFormState,
      title: "Comprar pan",
      ...overrides,
    },
    dispatch,
    handleSubmit,
    isEditing,
    reminderLabel: "En 15 minutos",
  });
  jest.mocked(useSchedulePermission).mockReturnValue({ requestPermission });
}

async function pressSwitch() {
  const { getByRole } = await render(<TaskFormContent />);

  await fireEvent.press(getByRole("switch", { name: "Recordatorio" }));
}

async function pressRetry() {
  const { getByRole } = await render(<TaskFormContent />);

  await fireEvent.press(
    getByRole("button", { name: PERMISSION_NOTICE_COPY.retry }),
  );
}

describe("<TaskFormContent /> reminder and calendar permission", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("toggles the reminder off without requesting permission", async () => {
    mockFormState({ reminderEnabled: true });

    await pressSwitch();

    expect(dispatch).toHaveBeenNthCalledWith(1, {
      type: TASK_FORM_ACTION_TYPES.TOGGLE_REMINDER,
    });
    expect(dispatch).toHaveBeenNthCalledWith(2, {
      type: TASK_FORM_ACTION_TYPES.SET_CALENDAR_STATE,
      payload: { status: "idle" },
    });
    expect(requestPermission).not.toHaveBeenCalled();
  });

  test("requests the calendar permission when the reminder is turned on", async () => {
    mockFormState({ reminderEnabled: false });

    await pressSwitch();

    expect(dispatch).toHaveBeenCalledWith({
      type: TASK_FORM_ACTION_TYPES.TOGGLE_REMINDER,
    });
    expect(requestPermission).toHaveBeenCalledTimes(1);
  });

  test("retries the permission request from the notice", async () => {
    mockFormState({
      reminderEnabled: true,
      calendarState: { status: "denied", canAskAgain: true },
    });

    await pressRetry();

    expect(requestPermission).toHaveBeenCalledTimes(1);
    expect(handleSubmit).not.toHaveBeenCalled();
  });

  test("keeps retry enabled when only the title has an error", async () => {
    mockFormState({
      reminderEnabled: true,
      titleError: "El título es obligatorio",
      calendarState: { status: "denied", canAskAgain: true },
    });

    const { getByRole } = await render(<TaskFormContent />);

    expect(
      getByRole("button", { name: PERMISSION_NOTICE_COPY.retry }),
    ).not.toBeDisabled();
  });

  test("disables retry while the form is submitting", async () => {
    mockFormState({
      reminderEnabled: true,
      isSubmitting: true,
      calendarState: { status: "denied", canAskAgain: true },
    });

    const { getByRole } = await render(<TaskFormContent />);

    expect(
      getByRole("button", { name: PERMISSION_NOTICE_COPY.retry }),
    ).toBeDisabled();
  });
});

describe("<TaskFormContent /> share history", () => {
  const SHARED_TASK: Task = {
    id: "task-1",
    title: "Comprar pan",
    description: "Ir al almacén",
    notification: null,
    shares: [
      {
        method: "contact",
        recipientName: "Ana Pérez",
        activityType: "net.whatsapp.WhatsApp",
        sharedAt: "2026-11-09T14:30:00",
      },
    ],
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders the share history in edit mode", async () => {
    mockFormState({}, true);

    const { getByText } = await render(<TaskFormContent task={SHARED_TASK} />);

    expect(getByText("Historial de envíos")).toBeTruthy();
    expect(getByText("Compartida con Ana Pérez · WhatsApp")).toBeTruthy();
  });

  test("does not render the share history in create mode", async () => {
    mockFormState();

    const { queryByText } = await render(<TaskFormContent />);

    expect(queryByText("Historial de envíos")).toBeNull();
  });
});
