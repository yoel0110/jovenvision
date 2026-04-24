export type EventType = 'MEETING' | 'ACTIVITY' | 'TRAINING' | 'OTHER';
export type EventStatus = 'ACTIVE' | 'CANCELLED' | 'PENDING';

export interface JovenEvent {
  id: number;
  title: string;
  type: EventType;
  description?: string;
  date: string; // ISO string
  location?: string;
  capacity: number;
  responsibleId?: number;
  groupId?: number;
  group?: { id: number; name: string };
  status: EventStatus;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}

export interface EventPayload {
  title: string;
  type: EventType;
  description?: string;
  date: string;
  location?: string;
  capacity: number;
  responsibleId?: number;
  groupId?: number;
  status: EventStatus;
}

export interface EventFilters {
  title?: string;
  type?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  pageSize?: number;
}

export interface EventListResponse {
  data: JovenEvent[];
  totalCount: number;
  page: number;
  pageSize: number;
}
