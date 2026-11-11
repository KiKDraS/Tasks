export const ROUTES = {
  signUp: "/sign-up",
  taskForm: "/(tabs)/task-form",
} as const;

export const TASK_FORM_PARAMS = {
  create: { id: "", mode: "create" },
  reset: { id: "", mode: "" },
} as const;
