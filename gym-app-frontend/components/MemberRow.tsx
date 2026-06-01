'use client';
import { memberStatus, daysUntil, fmtDate, fmtRelative } from '@/lib/data';
import type { Member } from '@/lib/types';
import Avatar from './Avatar';
import { StatusPill, PlanPill } from './StatusPill';

const mono = { fontFamily: "'JetBrains Mono', monospace" };
const display = { fontFamily: "'Space Grotesk', sans-serif" };

export default function MemberRow({ member, onClick }: { member: Member; onClick: () => void }) {
  const status = memberStatus(member);
  const dueColor = status === 'overdue' ? 'var(--danger)' : status === 'due-soon' ? 'var(--warn)' : 'var(--text-1)';

  return (
    <div
      onClick={onClick}
      className="grid gap-4 px-5 py-3.5 bg-[var(--bg-1)] border border-[var(--border)] rounded-[14px] cursor-pointer transition-all hover:border-[color-mix(in_srgb,var(--accent)_30%,var(--border))] items-center"
      style={{ gridTemplateColumns: '40px 1.4fr 1.2fr 1fr 1fr 90px' }}
    >
      <Avatar name={member.name} photo={member.photo} size="md" />
      <div className="flex flex-col gap-0.5 min-w-0">
        <strong className="text-[15px] font-semibold truncate" style={{ ...display, letterSpacing: '-0.01em' }}>{member.name}</strong>
        <span className="text-[11px] text-[var(--text-mute)]" style={{ ...mono, letterSpacing: '0.05em' }}>{member.phone}</span>
      </div>
      <div className="hidden md:block">
        <div className="text-[10px] text-[var(--text-mute)] uppercase tracking-[0.14em] mb-1" style={mono}>Plan</div>
        <PlanPill plan={member.plan} />
      </div>
      <div className="hidden md:block">
        <div className="text-[10px] text-[var(--text-mute)] uppercase tracking-[0.14em] mb-1" style={mono}>Joined</div>
        <div className="text-[13px] text-[var(--text-1)]" style={mono}>{fmtDate(member.joining, 'mono')}</div>
      </div>
      <div className="hidden md:block">
        <div className="text-[10px] text-[var(--text-mute)] uppercase tracking-[0.14em] mb-1" style={mono}>Next Due</div>
        <div className="text-[13px] font-semibold" style={{ ...mono, color: dueColor }}>
          {fmtDate(member.paidUntil, 'mono')}
          <small className="block text-[10px] font-normal text-[var(--text-mute)] uppercase tracking-[0.1em]">
            {member.paused ? 'PAUSED' : fmtRelative(member.paidUntil)}
          </small>
        </div>
      </div>
      <div className="flex justify-end">
        <StatusPill status={status} />
      </div>
    </div>
  );
}
