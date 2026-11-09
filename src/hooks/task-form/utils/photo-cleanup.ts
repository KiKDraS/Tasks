import type { Task } from "@/context/tasks/types/Task";

export function getPhotoToDelete(
  task: Task | undefined,
  nextPhotoUri: string | null,
): string | null {
  const previousPhotoUri = task?.photoUri;

  if (!previousPhotoUri || previousPhotoUri === nextPhotoUri) {
    return null;
  }

  return previousPhotoUri;
}
