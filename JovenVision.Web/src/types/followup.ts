export type FollowUpType = 'CALL' | 'MESSAGE' | 'VISIT' | 'OTHER';
export type FollowUpStatus = 'PENDING' | 'COMPLETED';

export interface FollowUp {
  id: number;
  memberId: number;
  responsibleId?: number;
  responsibleName?: string;
  type: FollowUpType;
  notes: string;
  status: FollowUpStatus;
  date: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface FollowUpPayload {
  memberId: number;
  responsibleId?: number;
  type: FollowUpType;
  description: string; // Map to Description in backend
  status: FollowUpStatus;
  date: string;
}
