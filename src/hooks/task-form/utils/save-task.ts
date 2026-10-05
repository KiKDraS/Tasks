import { Task, TaskNotification } from "@/context/tasks/types/Task";
import { TaskFields } from "@/hooks/task-form/utils/task-fields";

export async function saveTask(options: {
  task?: Task;
  fields: TaskFields;
  notification: TaskNotification | null;
  addTask: (task: Task) => Promise<void>;
  updateTask: (updatedTask: Task) => Promise<void>;
}): Promise<void> {
  const { task, fields, notification, addTask, updateTask } = options;

  if (task) {
    await updateTask({ ...task, ...fields, notification });
    return;
  }

  await addTask({ ...fields, isComplete: false, notification });
}
