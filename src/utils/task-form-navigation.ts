import { ROUTES, TASK_FORM_PARAMS } from "@/constants/routes";
import { router } from "expo-router";

export function openTaskFormPlaceholder(): void {
  router.navigate({
    pathname: ROUTES.taskForm,
    params: TASK_FORM_PARAMS.reset,
  });
}

export function closeTaskForm(): void {
  router.setParams(TASK_FORM_PARAMS.reset);
  router.back();
}
