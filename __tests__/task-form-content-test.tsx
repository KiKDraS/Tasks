import { fireEvent, render } from "@testing-library/react-native";

import { PERMISSION_NOTICE_COPY } from "@/components/ui/permissions/constants";
import { TaskFormContent } from "@/components/ui/task-form/task-form-content";
import { useCalendarAttachment } from "@/hooks/task-form/use-calendar-attachment";
import { useTaskForm } from "@/hooks/task-form/use-task-form";
import { initialTaskFormState } from "@/hooks/task-form/task-form-reducer";

jest.mock("@/components/icons/ReminderIcon", () => ({
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
  router: { back: jest.fn() },
}));

jest.mock("@/hooks/task-form/use-task-form", () => ({
  useTaskForm: jest.fn(),
}));

jest.mock("@/hooks/task-form/use-calendar-attachment", () => ({
  useCalendarAttachment: jest.fn(),
}));

const handleSubmit = jest.fn();
const retryCalendar = jest.fn();

function mockCalendarRetryState(
  calendarEnabled: boolean,
  titleError: string | null = null,
) {
  jest.mocked(useTaskForm).mockReturnValue({
    state: {
      ...initialTaskFormState,
      title: "Comprar pan",
      titleError,
      reminderEnabled: false,
      calendarEnabled,
      calendarState: { status: "denied", canAskAgain: true },
    },
    dispatch: jest.fn(),
    handleSubmit,
    isEditing: false,
    reminderLabel: "En 15 minutos",
  });
  jest.mocked(useCalendarAttachment).mockReturnValue({
    toggleCalendar: jest.fn(),
    retryCalendar,
  });
}

async function pressRetry() {
  const { getByRole } = await render(<TaskFormContent />);

  await fireEvent.press(
    getByRole("button", { name: PERMISSION_NOTICE_COPY.retry }),
  );
}

describe("<TaskFormContent /> calendar retry", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("submits again when the calendar is enabled and the event is missing", async () => {
    mockCalendarRetryState(true);

    await pressRetry();

    expect(handleSubmit).toHaveBeenCalledTimes(1);
    expect(retryCalendar).not.toHaveBeenCalled();
  });

  test("retries the permission request when the calendar is off", async () => {
    mockCalendarRetryState(false);

    await pressRetry();

    expect(retryCalendar).toHaveBeenCalledTimes(1);
    expect(handleSubmit).not.toHaveBeenCalled();
  });

  test("disables retry while the title has an error", async () => {
    mockCalendarRetryState(true, "El título es obligatorio");

    const { getByRole } = await render(<TaskFormContent />);

    expect(
      getByRole("button", { name: PERMISSION_NOTICE_COPY.retry }),
    ).toBeDisabled();
  });
});
