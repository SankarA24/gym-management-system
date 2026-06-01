export interface Payment {
  _id?: string;
  paidOn: string;
  period: string;
  amount?: number;
}

export interface Member {
  id: string;
  name: string;
  phone: string;
  joining: string;
  plan: 'monthly' | 'yearly';
  fee: number;
  photo: string | null;
  paused: boolean;
  paidUntil: string;
  payments: Payment[];
  notes: string;
  notifyVia?: 'whatsapp' | 'sms' | 'email';
  createdAt: string;
}

export interface Settings {
  defaultPlan: 'monthly' | 'yearly';
  defaultMonthlyFee: number;
  defaultYearlyFee: number;
  reminderWindowDays: number;
  notifyWhatsapp: boolean;
  notifySms: boolean;
  notifyEmail: boolean;
  reminderTime: string;
}

export interface AppState {
  ownerName: string;
  gymName: string;
  members: Member[];
  settings: Settings;
}

export type MemberStatus = 'active' | 'due-soon' | 'overdue' | 'paused';

export interface MemberWithStatus extends Member {
  _days: number;
  _status: MemberStatus;
}

export interface MemberFormPayload {
  name: string;
  phone: string;
  plan: 'monthly' | 'yearly';
  fee: number;
  joining: string;
  photo: string | null;
}
