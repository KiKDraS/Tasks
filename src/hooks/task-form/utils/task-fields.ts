import type { TaskLocation } from "@/context/tasks/types/Task";
import type { TaskFormState } from "@/hooks/task-form/types/TaskForm";

export type TaskFields = {
  title: string;
  description: string;
  photoUris: string[];
  photoUri: null;
  location: TaskLocation | null;
  calendarEventId: string | null;
};

export const buildTaskFields = (state: TaskFormState): TaskFields => ({
  title: state.title.trim(),
  description: state.description.trim(),
  photoUris: state.photoUris,
  photoUri: null,
  location: state.location,
  calendarEventId: state.calendarEventId,
});
