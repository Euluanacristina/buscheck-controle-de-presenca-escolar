
export type AttendanceStatus = 'pending' | 'present' | 'absent';

export type Period = 'Manhã' | 'Tarde' | 'Noite';

export interface Student {
  id: string;
  name: string;
  school: string;
  period: Period;
  status: AttendanceStatus;
  isPendingPayment?: boolean;
  pendingSince?: string;
}

export interface AttendanceStats {
  total: number;
  present: number;
  absent: number;
  pendingPayment: number;
}

export interface FilterOptions {
  search: string;
  school: string | string[];
  period: string;
  status: string;
  onlyPendingPayment?: boolean;
}
