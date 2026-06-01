'use client';
import { useState, useEffect, useRef, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { dueSoonList, fmtRelative } from '@/lib/data';
import { useAppState, useActions } from '@/lib/store';
import Icon from './Icon';
import Avatar from './Avatar';

const mono = { fontFamily: "'JetBrains Mono', monospace" };

export default function Bell() {
  const router = useRouter();
  const { members } = useAppState();
  const actions = useActions();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const overdue = useMemo(() => dueSoonList(members), [members]);
  const count = overdue.length;

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(o => !o)}
        aria-label="Notifications"
        className="w-10.5 h-10.5 rounded-[11px] grid place-items-center border border-(--border) bg-(--bg-1) text-(--text-1) hover:border-[color-mix(in_srgb,var(--accent)_40%,var(--border-strong))] hover:text-(--accent) transition-all relative"
      >
        <Icon name="bell" size={18} />
        {count > 0 && (
          <span className="absolute -top-1 -right-1 min-w-4.5 h-4.5 px-1 rounded-full bg-(--accent) text-(--accent-text-on) text-[10px] font-bold grid place-items-center border-2 border-(--bg-1)" style={{ ...mono, boxShadow: '0 0 12px rgba(34,232,196,0.5)' }}>
            {count}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute top-[calc(100%+10px)] right-0 w-95 bg-(--bg-1) border border-(--border-strong) rounded-2xl p-4 z-50 flex flex-col gap-3 animate-fade" style={{ boxShadow: '0 24px 64px rgba(0,0,0,0.4)' }}>
          <div className="flex items-center justify-between pb-2 border-b border-(--border-soft)">
            <div className="flex items-center gap-2.5 text-[12px] font-medium tracking-[0.14em] uppercase text-(--text-1)" style={mono}>
              <span className="w-0.75 h-3.5 bg-(--accent) rounded-sm" />
              Reminders
            </div>
            <span className="text-[11px] text-(--text-dim) uppercase tracking-[0.14em]" style={mono}>{count} PENDING</span>
          </div>

          {count === 0 && (
            <div className="py-4 text-center text-(--text-dim) text-sm">All members are up to date.</div>
          )}

          {overdue.slice(0, 6).map(m => (
            <div key={m.id} className="flex items-center gap-3 px-3 py-2.5 bg-(--bg-2) border border-(--border) rounded-xl">
              <Avatar name={m.name} photo={m.photo} size="sm" />
              <div className="flex-1 min-w-0">
                <div className="text-[14px] font-semibold" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{m.name}</div>
                <div className="flex gap-2 text-[10px] text-(--text-mute) uppercase tracking-widest mt-0.5" style={mono}>
                  <span>{m.plan === 'yearly' ? 'YEARLY' : 'MONTHLY'}</span>
                  <span>·</span>
                  <span style={{ color: m._status === 'overdue' ? 'var(--danger)' : 'var(--warn)' }}>
                    {fmtRelative(m.paidUntil)}
                  </span>
                </div>
              </div>
              <button
                className="shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-[10px] border border-(--border-strong) bg-(--bg-1) text-(--text-1) text-[10px] font-semibold tracking-[0.12em] uppercase hover:border-[color-mix(in_srgb,var(--accent)_50%,transparent)] hover:text-(--accent) transition-all"
                style={mono}
                onClick={e => { e.stopPropagation(); actions.markPaid(m.id); }}
              >
                <Icon name="check" size={12} /> PAID
              </button>
            </div>
          ))}

          <div className="pt-2 border-t border-(--border-soft)">
            <button
              className="w-full text-center flex items-center justify-center gap-2 px-4 py-2.5 text-[12px] font-semibold tracking-[0.12em] uppercase text-(--text-dim) hover:text-(--text) hover:bg-(--bg-1) rounded-lg transition-all"
              style={mono}
              onClick={() => { setOpen(false); router.push('/reminders'); }}
            >
              VIEW ALL REMINDERS
            </button>
          </div>
        </div>
      )}
    </div>
  );
}