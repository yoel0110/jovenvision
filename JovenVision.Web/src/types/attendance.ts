import type { Member } from './member';
import type { JovenEvent } from './event';

export type AttendanceStatus = 'Present' | 'Absent' | 'Justified';

export interface Attendance {
  id: number;
  memberId: number;
  member?: Member;
  eventId: number;
  event?: JovenEvent;
  status: AttendanceStatus;
  registeredAt: string;
}

export interface AttendancePayload {
  memberId: number;
  eventId: number;
  status: AttendanceStatus;
}

export interface AttendanceSummary {
  total: number;
  present: number;
  absent: number;
  justified: number;
  percentage: number;
}
