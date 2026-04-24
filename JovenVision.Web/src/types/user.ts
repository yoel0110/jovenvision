export interface User {
  id: number;
  username: string;
  active: boolean;
  roleId: number;
  memberId: number | null;
  memberName?: string;
}

export interface UserPayload {
  username: string;
  password?: string;
  roleId: number;
  memberId: number;
  active?: boolean;
}

export interface UserFilterParams {
  roleId?: number;
  active?: boolean;
  search?: string;
}
