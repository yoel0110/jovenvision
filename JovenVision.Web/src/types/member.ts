export type MemberStatus = 'Active' | 'Inactive' | 'Pending' | 'Banned';

export interface Member {
  id: number;
  name: string;
  email: string | null;
  phone: string | null;
  status: MemberStatus;
  role?: string;
  createdAt: string;
}

export interface MemberPayload {
  name: string;
  email?: string;
  phone?: string;
  status: MemberStatus;
}

export interface MemberFilters {
  search?: string;
  status?: string;
  page?: number;
  pageSize?: number;
  onlyWithoutUser?: boolean;
  includeMemberId?: number;
}

export interface MemberListResponse {
  data: Member[];
  totalCount: number;
  page: number;
  pageSize: number;
}
