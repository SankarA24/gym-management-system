'use client';
import { statusLabel, statusVariant } from '@/lib/data';
import type { MemberStatus } from '@/lib/types';

const variantStyles: Record<string, string> = {
  '':       'bg-[var(--accent-soft)] text-[var(--accent)] border-[color-mix(in_srgb,var(--accent)_25%,transparent)]',
  warn:     'bg-[var(--warn-soft)] text-[var(--warn)] border-[color-mix(in_srgb,var(--warn)_25%,transparent)]',
  danger:   'bg-[var(--danger-soft)] text-[var(--danger)] border-[color-mix(in_srgb,var(--danger)_25%,transparent)]',
  muted:    'bg-[var(--bg-3)] text-[var(--text-dim)] border-[var(--border-strong)]',
  info:     'bg-[var(--info-soft)] text-[var(--info)] border-[color-mix(in_srgb,var(--info)_25%,transparent)]',
};

const base = 'inline-flex items-center px-2.5 py-[5px] rounded-full border text-[10px] font-semibold tracking-[0.14em] uppercase';
const monoFont = { fontFamily: "'JetBrains Mono', monospace" };

export function StatusPill({ status }: { status: MemberStatus }) {
  const v = statusVariant(status);
  return <span className={`${base} ${variantStyles[v]}`} style={monoFont}>{statusLabel(status)}</span>;
}

export function PlanPill({ plan }: { plan: 'monthly' | 'yearly' }) {
  const v = plan === 'yearly' ? 'info' : '';
  return <span className={`${base} ${variantStyles[v]}`} style={monoFont}>{plan === 'yearly' ? 'YEARLY' : 'MONTHLY'}</span>;
}

export function Pill({ children, variant = '' }: { children: React.ReactNode; variant?: string }) {
  return <span className={`${base} ${variantStyles[variant] || variantStyles['']}`} style={monoFont}>{children}</span>;
}
