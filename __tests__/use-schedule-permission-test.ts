import { act, renderHook } from "@testing-library/react-native";

import { TASK_FORM_ACTION_TYPES } from "@/hooks/task-form/constants";
import { useSchedulePermission } from "@/hooks/task-form/use-schedule-permission";
import { requestCalendarPermission } from "@/services/calendar";

jest.mock("@/services/calendar", () => ({
  requestCalendarPermission: jest.fn(),
}));

const requestCalendarPermissionMock = jest.mocked(requestCalendarPermission);

async function requestWith(dispatch: jest.Mock) {
  const { result } = await renderHook(() =>
    useSchedulePermission({ dispatch }),
  );

  await act(async () => {
    await result.current.requestPermission();
  });
}

describe("useSchedulePermission", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("stores the granted calendar state", async () => {
    requestCalendarPermissionMock.mockResolvedValue({
      status: "granted",
      value: true,
    });
    const dispatch = jest.fn();

    await requestWith(dispatch);

    expect(dispatch).toHaveBeenNthCalledWith(1, {
      type: TASK_FORM_ACTION_TYPES.SET_CALENDAR_STATE,
      payload: { status: "pending" },
    });
    expect(dispatch).toHaveBeenNthCalledWith(2, {
      type: TASK_FORM_ACTION_TYPES.SET_CALENDAR_STATE,
      payload: { status: "granted" },
    });
  });

  test("stores the denied state when the permission can be asked again", async () => {
    requestCalendarPermissionMock.mockResolvedValue({
      status: "denied",
      canAskAgain: true,
    });
    const dispatch = jest.fn();

    await requestWith(dispatch);

    expect(dispatch).toHaveBeenNthCalledWith(2, {
      type: TASK_FORM_ACTION_TYPES.SET_CALENDAR_STATE,
      payload: { status: "denied", canAskAgain: true },
    });
  });

  test("stores the blocked state when the permission cannot be asked again", async () => {
    requestCalendarPermissionMock.mockResolvedValue({
      status: "denied",
      canAskAgain: false,
    });
    const dispatch = jest.fn();

    await requestWith(dispatch);

    expect(dispatch).toHaveBeenNthCalledWith(2, {
      type: TASK_FORM_ACTION_TYPES.SET_CALENDAR_STATE,
      payload: { status: "blocked" },
    });
  });

  test("stores the error state with its message", async () => {
    const message = "No pudimos acceder a tu calendario. Intentá de nuevo.";
    requestCalendarPermissionMock.mockResolvedValue({
      status: "error",
      message,
    });
    const dispatch = jest.fn();

    await requestWith(dispatch);

    expect(dispatch).toHaveBeenNthCalledWith(2, {
      type: TASK_FORM_ACTION_TYPES.SET_CALENDAR_STATE,
      payload: { status: "error", message },
    });
  });
});
