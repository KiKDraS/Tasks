import { useEffect } from "react";

import { useTasksStore } from "@/stores/tasks/tasks-store";

export function useHydrateTasks(): void {
  useEffect(() => {
    void useTasksStore.getState().hydrate();
  }, []);
}
