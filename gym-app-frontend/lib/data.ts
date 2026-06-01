import type { Member, AppState, Settings, MemberStatus, MemberWithStatus } from './types';

export const STORAGE_KEY = 'irondesk:v1';

export const DEFAULT_SETTINGS: Settings = {
  defaultPlan: 'monthly',
  defaultMonthlyFee: 1800,
  defaultYearlyFee: 18000,
  reminderWindowDays: 7,
  notifyWhatsapp: true,
  notifySms: false,
  notifyEmail: false,
  reminderTime: '09:00',
};

/* ── Date utils ─────────────────────────────────────────── */
export function todayISO(): string {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d.toISOString().slice(0, 10);
}
export function parseISO(s: string): Date {
  return new Date(s + 'T00:00:00');
}
export function addPeriod(isoDate: string, plan: 'monthly' | 'yearly', n = 1): string {
  const d = parseISO(isoDate);
  if (plan === 'monthly') d.setMonth(d.getMonth() + n);
  else d.setFullYear(d.getFullYear() + n);
  return d.toISOString().slice(0, 10);
}
export function daysUntil(isoDate: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.round((parseISO(isoDate).getTime() - today.getTime()) / 86400000);
}
export function daysBetween(a: string, b: string): number {
  return Math.round((parseISO(b).getTime() - parseISO(a).getTime()) / 86400000);
}
export function fmtDate(isoDate: string | null | undefined, opt: 'short' | 'mono' | 'long' = 'short'): string {
  if (!isoDate) return '—';
  const d = parseISO(isoDate);
  if (opt === 'short') return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  if (opt === 'mono') return d.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '.');
  if (opt === 'long') return d.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric' });
  return isoDate;
}
export function fmtRelative(isoDate: string): string {
  const days = daysUntil(isoDate);
  if (days === 0) return 'TODAY';
  if (days === 1) return 'TOMORROW';
  if (days === -1) return 'YESTERDAY';
  if (days > 0 && days <= 30) return `IN ${days}D`;
  if (days < 0 && days >= -30) return `${Math.abs(days)}D AGO`;
  if (days > 30) return `IN ${Math.round(days / 30)}MO`;
  return `${Math.round(Math.abs(days) / 30)}MO AGO`;
}
export function fmtMoney(n: number | null | undefined, opts: { symbol?: boolean } = {}): string {
  if (n == null) return '—';
  const s = Number(n).toLocaleString('en-IN');
  return (opts.symbol === false ? '' : '₹') + s;
}

/* ── Status ──────────────────────────────────────────────── */
export function memberStatus(m: Member): MemberStatus {
  if (m.paused) return 'paused';
  const d = daysUntil(m.paidUntil);
  if (d < 0) return 'overdue';
  if (d <= 7) return 'due-soon';
  return 'active';
}
export function statusLabel(s: MemberStatus): string {
  return ({ active: 'ACTIVE', 'due-soon': 'DUE SOON', overdue: 'OVERDUE', paused: 'PAUSED' } as Record<string, string>)[s] || s.toUpperCase();
}
export function statusVariant(s: MemberStatus): '' | 'warn' | 'danger' | 'muted' {
  return ({ active: '', 'due-soon': 'warn', overdue: 'danger', paused: 'muted' } as Record<string, '' | 'warn' | 'danger' | 'muted'>)[s] ?? '';
}

/* ── Avatar ──────────────────────────────────────────────── */
export function avColor(name: string): number {
  const hues = [165, 175, 185, 195, 205, 220, 270, 320, 35, 18];
  let h = 0;
  for (let i = 0; i < (name || '').length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0;
  return hues[h % hues.length];
}
export function initials(name: string): string {
  return (name || '?').split(/\s+/).filter(Boolean).slice(0, 2).map(p => p[0]).join('').toUpperCase();
}

/* ── Seed ────────────────────────────────────────────────── */
export function buildSeed(): Member[] {
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const iso = (date: Date) => { const d = new Date(date); d.setHours(0, 0, 0, 0); return d.toISOString().slice(0, 10); };
  const dayOffset = (n: number) => iso(new Date(today.getTime() + n * 86400000));

  const raw = [
    { name: 'Arjun Mehta',     phone: '+91 98201 33421', joining: dayOffset(-420), plan: 'yearly'  as const, fee: 18000, paidShift: -45,  photo: null },
    { name: 'Priya Sharma',    phone: '+91 99300 11045', joining: dayOffset(-310), plan: 'monthly' as const, fee: 1800,  paidShift: 4,    photo: null },
    { name: 'Rohan Iyer',      phone: '+91 95553 89101', joining: dayOffset(-90),  plan: 'monthly' as const, fee: 1800,  paidShift: -3,   photo: null },
    { name: 'Anjali Verma',    phone: '+91 98760 21090', joining: dayOffset(-560), plan: 'yearly'  as const, fee: 18000, paidShift: 12,   photo: null },
    { name: 'Kabir Singh',     phone: '+91 98998 44210', joining: dayOffset(-180), plan: 'monthly' as const, fee: 2200,  paidShift: 21,   photo: null },
    { name: 'Sneha Reddy',     phone: '+91 90090 55321', joining: dayOffset(-45),  plan: 'monthly' as const, fee: 1500,  paidShift: -9,   photo: null },
    { name: 'Vikram Joshi',    phone: '+91 97651 23000', joining: dayOffset(-220), plan: 'monthly' as const, fee: 1800,  paidShift: 1,    photo: null },
    { name: 'Meera Pillai',    phone: '+91 98873 67432', joining: dayOffset(-700), plan: 'yearly'  as const, fee: 22000, paidShift: 80,   photo: null },
    { name: 'Aditya Khanna',   phone: '+91 99900 28391', joining: dayOffset(-75),  plan: 'monthly' as const, fee: 1800,  paidShift: 6,    photo: null, paused: true },
    { name: 'Riya Kapoor',     phone: '+91 95009 71820', joining: dayOffset(-12),  plan: 'monthly' as const, fee: 1500,  paidShift: 18,   photo: null },
    { name: 'Karan Bhatt',     phone: '+91 98302 90019', joining: dayOffset(-540), plan: 'yearly'  as const, fee: 18000, paidShift: 280,  photo: null },
    { name: 'Tanvi Nair',      phone: '+91 93210 11221', joining: dayOffset(-150), plan: 'monthly' as const, fee: 1800,  paidShift: 14,   photo: null },
    { name: 'Devansh Rao',     phone: '+91 99887 56120', joining: dayOffset(-260), plan: 'monthly' as const, fee: 2200,  paidShift: -22,  photo: null },
    { name: 'Ishita Banerjee', phone: '+91 91234 87654', joining: dayOffset(-330), plan: 'yearly'  as const, fee: 18000, paidShift: 60,   photo: null },
  ];

  return raw.map((m, i) => {
    const paidUntil = dayOffset(m.paidShift);
    const payments: { paidOn: string; period: string }[] = [];
    let cursor = m.joining;
    let safety = 0;
    while (cursor < paidUntil && safety++ < 30) {
      payments.push({ paidOn: cursor, period: cursor });
      cursor = addPeriod(cursor, m.plan, 1);
    }
    return {
      id: 'm_' + (Date.now() + i).toString(36) + Math.random().toString(36).slice(2, 6),
      name: m.name, phone: m.phone, joining: m.joining, plan: m.plan,
      fee: m.fee, photo: m.photo, paused: !!(m as { paused?: boolean }).paused,
      paidUntil, payments, notes: '', createdAt: m.joining,
    };
  });
}

/* ── Storage ─────────────────────────────────────────────── */
export function loadState(): AppState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as AppState;
    if (!parsed || !Array.isArray(parsed.members)) return null;
    return parsed;
  } catch { return null; }
}
export function saveState(state: AppState): void {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch { /* quota */ }
}
export function initialState(): AppState {
  const loaded = loadState();
  if (loaded) return { ...loaded, settings: { ...DEFAULT_SETTINGS, ...(loaded.settings || {}) } };
  return { ownerName: '', gymName: '', members: buildSeed(), settings: { ...DEFAULT_SETTINGS } };
}

/* ── Derived ─────────────────────────────────────────────── */
export function dueSoonList(members: Member[]): MemberWithStatus[] {
  return members
    .filter(m => !m.paused)
    .map(m => ({ ...m, _days: daysUntil(m.paidUntil), _status: memberStatus(m) }))
    .filter(m => m._status === 'overdue' || m._status === 'due-soon')
    .sort((a, b) => a._days - b._days);
}
export function monthRevenue(members: Member[]): number {
  const ym = new Date().toISOString().slice(0, 7);
  let total = 0;
  for (const m of members)
    for (const p of m.payments || [])
      if ((p.paidOn || '').startsWith(ym)) total += m.fee || 0;
  return total;
}
export function planBreakdown(members: Member[]): { monthly: number; yearly: number } {
  return {
    monthly: members.filter(m => m.plan === 'monthly').length,
    yearly: members.filter(m => m.plan === 'yearly').length,
  };
}
export function statusCounts(members: Member[]): Record<MemberStatus, number> {
  const c: Record<MemberStatus, number> = { active: 0, 'due-soon': 0, overdue: 0, paused: 0 };
  for (const m of members) c[memberStatus(m)]++;
  return c;
}
