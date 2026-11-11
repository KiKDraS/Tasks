import { router } from "expo-router";

import { ROUTES, TASK_FORM_PARAMS } from "@/constants/routes";
import {
  closeTaskForm,
  openTaskFormPlaceholder,
} from "@/utils/task-form-navigation";

jest.mock("expo-router", () => ({
  router: { back: jest.fn(), navigate: jest.fn(), setParams: jest.fn() },
}));

const routerMock = jest.mocked(router);

describe("closeTaskForm", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("clears the task params and goes back", () => {
    closeTaskForm();

    expect(routerMock.setParams).toHaveBeenCalledWith({ id: "", mode: "" });
    expect(routerMock.back).toHaveBeenCalledTimes(1);
    expect(routerMock.setParams.mock.invocationCallOrder[0]).toBeLessThan(
      routerMock.back.mock.invocationCallOrder[0],
    );
  });
});

describe("openTaskFormPlaceholder", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("navigates to the task form with reset params", () => {
    openTaskFormPlaceholder();

    expect(routerMock.navigate).toHaveBeenCalledWith({
      pathname: ROUTES.taskForm,
      params: TASK_FORM_PARAMS.reset,
    });
  });
});
