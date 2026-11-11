import type { Task } from "@/context/tasks/types/Task";

export function getTaskPhotoUris(task?: Task): string[] {
  const photoUris = task?.photoUris ?? [];
  const legacyPhotoUri = task?.photoUri ? [task.photoUri] : [];

  return [...new Set([...photoUris, ...legacyPhotoUri])];
}

export function getPhotosToDelete(
  task: Task | undefined,
  nextPhotoUris: string[],
): string[] {
  const nextUris = new Set(nextPhotoUris);

  return getTaskPhotoUris(task).filter((uri) => !nextUris.has(uri));
}
