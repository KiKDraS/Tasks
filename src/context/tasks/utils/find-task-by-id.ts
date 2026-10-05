import { Task } from "../types/Task";

export const findTaskById = (tasks: Task[], id?: string) =>
  tasks.find((item) => item.id === id);
