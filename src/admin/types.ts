import type { Timestamp } from 'firebase/firestore';

export type AppointmentStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';

export interface Appointment {
  id: string;
  code: string;
  departmentId: string;
  doctorId: string;
  date: string;
  time: string;
  slotId: string;
  status: AppointmentStatus;
  createdAt: Timestamp | null;
  patient: { fullName: string; tc: string; phone: string; email: string; notes: string };
}

export interface Message {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  read: boolean;
  createdAt: Timestamp | null;
}

export interface Subscriber {
  id: string;
  email: string;
  createdAt: Timestamp | null;
}

export interface LiveCollection<T> {
  items: T[];
  loading: boolean;
  error: string | null;
}
