'use client';
import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { dueSoonList, daysUntil, fmtRelative } from '@/lib/data';
import type { MemberWithStatus } from '@/lib/types';
import { useAppState, useActions } from '@/lib/store';
import Avatar from '@/components/Avatar';
import { PlanPill } from '@/components/StatusPill';
import Empty from '@/components/Empty';
import Icon from '@/components/Icon';

const mono = { fontFamily: "'JetBrains Mono', monospace" };
const display = { fontFamily: "'Space Grotesk', sans-serif" };

type TabId = 'all' | 'overdue' | 'due-soon' | 'upcoming';

export default function RemindersScreen() {
  const router = useRouter();
  const { members } = useAppState();
  const actions = useActions();
  const [tab, setTab] = useState<TabId>('all');
  const ITEMS_PER_PAGE = 1;
  const [page, setPage] = useState(1);

  const all = useMemo(() => dueSoonList(members), [members]);
  const overdue = all.filter(m => m._status === 'overdue');
  const soon = all.filter(m => m._status === 'due-soon');
  const upcoming = useMemo(() =>
    members.filter(m => !m.paused)
      .map(m => ({ ...m, _days: daysUntil(m.paidUntil), _status: 'active' as const }))
      .filter(m => m._days > 7 && m._days <= 30)
      .sort((a, b) => a._days - b._days),
    [members]
  );

  const TABS = [
    { id: 'all' as TabId, label: 'All', count: overdue.length + soon.length },
    { id: 'overdue' as TabId, label: 'Overdue', count: overdue.length },
    { id: 'due-soon' as TabId, label: 'Due Soon', count: soon.length },
    { id: 'upcoming' as TabId, label: 'Upcoming', count: upcoming.length },
  ];

  const list = tab === 'overdue' ? overdue : tab === 'due-soon' ? soon : tab === 'upcoming' ? (upcoming as unknown as MemberWithStatus[]) : [...overdue, ...soon];
  const totalPages = Math.max(
    1,
    Math.ceil(list.length / ITEMS_PER_PAGE)
  );

  const paginatedList = list.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  return (
    <div className="flex flex-col gap-5 px-5 md:px-9.5 pt-4 md:pt-6 pb-28 md:pb-15 animate-fade">
      {/* Tabs */}
      <div className="flex gap-1 border-b border-(--border)">
        {TABS.map(t => (
          <button key={t.id} onClick={() => { setTab(t.id); setPage(1); }}
            className={`px-4 py-3 text-[12px] font-semibold tracking-[0.14em] uppercase flex items-center gap-2.5 border-b-2 -mb-px transition-all ${tab === t.id ? 'text-(--accent) border-(--accent)' : 'text-(--text-dim) border-transparent'}`}
            style={mono}>
            {t.label}
            <span className={`px-2 py-0.5 rounded-lg text-[10px] ${tab === t.id ? 'bg-[rgba(34,232,196,0.12)] text-(--accent)' : 'bg-(--bg-3) text-(--text-1)'}`}>
              {t.count}
            </span>
          </button>
        ))}
      </div>

      {/* List */}
      <div className="flex flex-col gap-2">
        {list.length === 0 ? (
          <Empty icon="check" title={tab === 'overdue' ? 'No overdue payments' : 'Nothing to remind'}
            body="Members in this category are all up to date." />
        ) : paginatedList.map(m => (
          <ReminderRow key={m.id} member={m}
            onClick={() => router.push(`/members/${m.id}`)}
            onMarkPaid={() => actions.markPaid(m.id)} />
        ))}
      </div>
      {list.length > 0 && totalPages > 1 && (
        <div className="flex items-center justify-between mt-4 px-2">
          <button
            disabled={page === 1}
            onClick={() => setPage(p => p - 1)}
            className="text-(--text-dim) disabled:opacity-40"
            style={mono}
          >
            Prev
          </button>

          <span className="text-sm" style={mono}>
            {page} / {totalPages}
          </span>

          <button
            disabled={page === totalPages}
            onClick={() => setPage(p => p + 1)}
            className="text-(--text-dim) disabled:opacity-40"
            style={mono}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

function ReminderRow({ member, onClick, onMarkPaid }: {
  member: MemberWithStatus;
  onClick: () => void;
  onMarkPaid: () => void;
}) {
  const isOverdue = member._status === 'overdue';
  const isDueSoon = member._status === 'due-soon';
  const dueColor = isOverdue ? 'var(--danger)' : isDueSoon ? 'var(--warn)' : 'var(--text-1)';

  return (
    <div className={`grid items-center gap-4 px-5 py-4 bg-(--bg-1) border rounded-[14px] min-w-0 transition-all ${isOverdue ? 'border-[color-mix(in_srgb,var(--danger)_25%,transparent)]' : isDueSoon ? 'border-[color-mix(in_srgb,var(--warn)_25%,transparent)]' : 'border-(--border)'}`}
      style={{
        gridTemplateColumns: '48px minmax(160px,1.4fr) minmax(90px,1fr) minmax(90px,1fr) auto',
        background: isOverdue ? 'linear-gradient(90deg, var(--danger-soft), transparent 50%), var(--bg-1)' : 'var(--bg-1)',
      }}>
      <Avatar name={member.name} photo={member.photo} size="md" />
      <div onClick={onClick} className="cursor-pointer flex flex-col gap-1 min-w-0">
        <strong className="text-[15px] font-semibold truncate" style={{ ...display, letterSpacing: '-0.01em' }}>{member.name}</strong>
        <span className="text-[11px] text-(--text-mute)" style={{ ...mono, letterSpacing: '0.05em' }}>{member.phone}</span>
      </div>
      <div className="hidden lg:block"><PlanPill plan={member.plan} /></div>
      <div>
        <div className="text-[10px] text-(--text-mute) uppercase tracking-[0.14em] mb-1" style={mono}>Due</div>
        <div className="text-[14px] font-semibold" style={{ ...mono, color: dueColor }}>{fmtRelative(member.paidUntil)}</div>
      </div>
      <div className="flex gap-2 flex-wrap justify-end">
        <button onClick={e => { e.stopPropagation(); alert(`Reminder sent to ${member.name} via WhatsApp (mock).`); }}
          className="flex items-center gap-1.5 px-3 py-2 rounded-[10px] border border-(--border-strong) bg-(--bg-1) text-(--text-1) text-[11px] font-semibold tracking-[0.12em] uppercase hover:border-[color-mix(in_srgb,var(--accent)_50%,transparent)] hover:text-(--accent) transition-all"
          style={mono}>
          <Icon name="msg" size={14} /> REMIND
        </button>
        <button onClick={e => { e.stopPropagation(); onMarkPaid(); }}
          className="flex items-center gap-1.5 px-3 py-2 rounded-[10px] bg-(--accent) text-(--accent-text-on) text-[11px] font-semibold tracking-[0.12em] uppercase hover:brightness-95 transition-all"
          style={{ ...mono, boxShadow: '0 0 0 1px rgba(34,232,196,0.4),0 4px 16px rgba(34,232,196,0.2)' }}>
          <Icon name="check" size={14} /> PAID
        </button>
      </div>
    </div>
  );
}
