import type { TaskContact, TaskLocation } from "@/context/tasks/types/Task";
import type { TaskFormState } from "@/hooks/task-form/types/TaskForm";

export type TaskFields = {
  title: string;
  description: string;
  photoUri: string | null;
  location: TaskLocation | null;
  contact: TaskContact | null;
  calendarEventId: string | null;
};

export const buildTaskFields = (state: TaskFormState): TaskFields => ({
  title: state.title.trim(),
  description: state.description.trim(),
  photoUri: state.photoUri,
  location: state.location,
  contact: state.contact,
  calendarEventId: state.calendarEventId,
});