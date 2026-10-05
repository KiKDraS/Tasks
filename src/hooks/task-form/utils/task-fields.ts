import { TaskFormState } from "@/hooks/task-form/types/TaskForm";

export type TaskFields = {
  title: string;
  description: string;
};

export const buildTaskFields = (state: TaskFormState): TaskFields => ({
  title: state.title.trim(),
  description: state.description.trim(),
});
