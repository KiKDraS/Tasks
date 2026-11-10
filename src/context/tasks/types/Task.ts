export type TaskNotification = {
  id: string;
  scheduledAt: string;
};

export interface TaskLocation {
  latitude: number;
  longitude: number;
  address?: string;
}

export type TaskShareMethod = "contact" | "share";

export interface TaskShare {
  method: TaskShareMethod;
  recipientName?: string;
  activityType?: string;
  sharedAt: string;
}

export type Task = {
  id?: string;
  title: string;
  description: string;
  isComplete?: boolean;
  notification: TaskNotification | null;
  photoUris?: string[];
  photoUri?: string | null;
  location?: TaskLocation | null;
  calendarEventId?: string | null;
  shares?: TaskShare[];
};
