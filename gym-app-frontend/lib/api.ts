const BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8001/api';

async function req<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token =
    typeof window !== 'undefined' ? localStorage.getItem('irondesk:token') : null;
  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers: {
      ...(options.body !== undefined ? { 'Content-Type': 'application/json' } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers ?? {}),
    },
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message ?? 'Request failed');
  return json.data !== undefined ? json.data : json;
}

// ─── Auth ────────────────────────────────────────────────────
export interface AuthUser {
  _id: string;
  name: string;
  email: string;
  phone: string;
  gymName: string;
}

export interface LoginResponse {
  token: string;
  user: AuthUser;
}

export interface RegisterPayload {
  name: string;
  email: string;
  phone: string;
  password: string;
  gymName: string;
}

// ─── Members ─────────────────────────────────────────────────
export interface ApiMember {
  _id: string;
  name: string;
  phone: string;
  photo: string | null;
  joining: string;
  plan: 'monthly' | 'yearly';
  fee: number;
  paidUntil: string;
  paused: boolean;
  notes: string;
  notifyVia: 'whatsapp' | 'sms' | 'email';
  createdAt: string;
}

// paidUntil and paused are computed server-side on create
export interface CreateMemberPayload {
  name: string;
  phone: string;
  plan: 'monthly' | 'yearly';
  fee: number;
  joining: string;
  photo?: string | null;
  notes?: string;
  notifyVia?: 'whatsapp' | 'sms' | 'email';
}

export interface UpdateMemberPayload {
  name?: string;
  phone?: string;
  plan?: 'monthly' | 'yearly';
  fee?: number;
  joining?: string;
  paidUntil?: string;
  paused?: boolean;
  photo?: string | null;
  notes?: string;
  notifyVia?: 'whatsapp' | 'sms' | 'email';
}

// ─── Payments ────────────────────────────────────────────────
export interface ApiPayment {
  _id: string;
  memberId: string;
  paidOn: string;
  period: string;
  amount: number;
  createdAt: string;
}

// Backend computes period and amount from the member — only memberId + optional date needed
export interface CreatePaymentPayload {
  memberId: string;
  paidOn?: string;
}

export interface CreatePaymentResponse {
  payment: ApiPayment;
  newPaidUntil: string;
}

export const api = {
  auth: {
    register: (body: RegisterPayload) =>
      req<AuthUser>('/auth/register', { method: 'POST', body: JSON.stringify(body) }),
    login: (body: { email: string; password: string }) =>
      req<LoginResponse>('/auth/login', { method: 'POST', body: JSON.stringify(body) }),
  },
  members: {
    list: () => req<ApiMember[]>('/members'),
    get: (id: string) => req<ApiMember>(`/members/${id}`),
    create: (body: CreateMemberPayload) =>
      req<ApiMember>('/members', { method: 'POST', body: JSON.stringify(body) }),
    update: (id: string, body: UpdateMemberPayload) =>
      req<ApiMember>(`/members/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
    remove: (id: string) => req<void>(`/members/${id}`, { method: 'DELETE' }),
    togglePause: (id: string) =>
      req<ApiMember>(`/members/${id}/pause`, { method: 'PATCH' }),
  },
  payments: {
    list: (memberId: string) => req<ApiPayment[]>(`/payments?memberId=${memberId}`),
    listAll: () => req<ApiPayment[]>('/payments'),
    create: (body: CreatePaymentPayload) =>
      req<CreatePaymentResponse>('/payments', { method: 'POST', body: JSON.stringify(body) }),
    remove: (id: string) => req<void>(`/payments/${id}`, { method: 'DELETE' }),
  },
};
