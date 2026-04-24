export type GroupStatus = 'ACTIVE' | 'INACTIVE';

export interface Group {
  id: number;
  name: string;
  description?: string;
  capacity: number;
  status: GroupStatus;
  createdAt: string;
  updatedAt?: string;
  deletedAt?: string;
}

export interface GroupPayload {
  name: string;
  description?: string;
  capacity: number;
  status: GroupStatus;
}

export interface GroupFilters {
  search?: string;
  status?: string;
  page?: number;
  pageSize?: number;
}

export interface GroupListResponse {
  data: Group[];
  totalCount: number;
  page: number;
  pageSize: number;
}
