export type TaskNotification = {
  id: string;
  scheduledAt: string;
};

export interface TaskLocation {
  latitude: number;
  longitude: number;
  address?: string;
}

export interface TaskContact {
  id: string;
  name: string;
  phoneNumber?: string;
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
  contact?: TaskContact | null;
  calendarEventId?: string | null;
};
