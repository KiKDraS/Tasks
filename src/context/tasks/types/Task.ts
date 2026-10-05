export type TaskNotification = {
  id: string;
  scheduledAt: string;
};

export type Task = {
  id?: string;
  title: string;
  description: string;
  isComplete?: boolean;
  notification: TaskNotification | null;
};
