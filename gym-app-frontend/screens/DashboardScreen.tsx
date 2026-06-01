'use client';
import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { statusCounts, planBreakdown, monthRevenue, dueSoonList, fmtMoney, fmtRelative } from '@/lib/data';
import { useAppState } from '@/lib/store';
import StatCard from '@/components/StatCard';
import MemberRow from '@/components/MemberRow';
import Avatar from '@/components/Avatar';
import Icon from '@/components/Icon';

const mono = { fontFamily: "'JetBrains Mono', monospace" };
const display = { fontFamily: "'Space Grotesk', sans-serif" };

function LabelBar({ children }: { children: React.ReactNode }) {
  return (
    <div className="inline-flex items-center gap-2.5 text-[12px] font-medium tracking-[0.14em] uppercase text-(--text-1)" style={mono}>
      <span className="w-0.75 h-3.5 bg-(--accent) rounded-sm shrink-0" />
      {children}
    </div>
  );
}

export default function DashboardScreen() {
  const router = useRouter();
  const { members } = useAppState();
  const [showRevenue, setShowRevenue] = useState(false);
  const counts = useMemo(() => statusCounts(members), [members]);
  const plans = useMemo(() => planBreakdown(members), [members]);
  const totalActive = members.filter(m => !m.paused).length;
  const revenue = useMemo(() => monthRevenue(members), [members]);
  const dueList = useMemo(() => dueSoonList(members), [members]);
  const overdueList = dueList.filter(m => m._status === 'overdue');
  const upcomingList = dueList.filter(m => m._status === 'due-soon');
  const total = Math.max(1, plans.monthly + plans.yearly);
  const monthlyPct = Math.round((plans.monthly / total) * 100);
  const yearlyPct = 100 - monthlyPct;

  return (
    <div className="flex flex-col gap-7 px-5 md:px-9.5 pt-4 md:pt-6 pb-28 md:pb-15 animate-fade">

      {/* Stat cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

      {/* Active + New Members */}
    <div className="bg-(--bg-1) border border-(--border) rounded-[20px] p-5 min-h-45">

      <div className="flex items-start justify-between">

        <div className="w-13 h-13 rounded-2xl bg-(--accent-soft) border border-(--accent-border) flex items-center justify-center">
          <Icon name="users" size={22} className="text-(--accent)" />
        </div>

      </div>

  <div className="grid grid-cols-2 gap-6 mt-8">

    {/* Active Members */}
    <div>
      <div
        className="text-[11px] tracking-[0.14em] uppercase text-(--text-dim)"
        style={mono}
      >
        Active Members
      </div>

      <div
        className="text-5xl font-bold leading-none mt-4"
        style={display}
      >
        {totalActive}
      </div>

    </div>

    {/* New Members */}
    <div className="border-l border-(--border) pl-6">

      <div
        className="text-[11px] tracking-[0.14em] uppercase text-(--text-dim)"
        style={mono}
      >
        New Members
      </div>

      <div
        className="text-5xl font-bold leading-none mt-4"
        style={display}
      >
        {
          members.filter((m) => {
            const joined = new Date(m.joining || '');

            return (
              joined.getMonth() === new Date().getMonth() &&
              joined.getFullYear() === new Date().getFullYear()
            );
          }).length
        }
      </div>
      <div
  className="mt-3 text-[10px] tracking-[0.14em] uppercase text-(--text-mute)"
  style={mono}
>
  Previous Month - {
    members.filter((m) => {
      const joined = new Date(m.joining || '');

      const now = new Date();

      const previousMonth =
        now.getMonth() === 0 ? 11 : now.getMonth() - 1;

      const previousYear =
        now.getMonth() === 0
          ? now.getFullYear() - 1
          : now.getFullYear();

      return (
        joined.getMonth() === previousMonth &&
        joined.getFullYear() === previousYear
      );
    }).length
  }
</div>

    </div>
    

  </div>
</div>

  {/* Revenue Analytics */}
  <div className="bg-(--bg-1) border border-(--border) rounded-[20px] p-5 flex flex-col justify-between min-h-45">

    <div className="flex items-start justify-between">

      <div className="flex items-center gap-3">

        <div className="w-13 h-13 rounded-[14px] border grid place-items-center shrink-0 bg-(--info-soft) border-[color-mix(in_srgb,var(--info)_25%,transparent)] text-(--info)">
          <Icon name="money" size={22} />
        </div>

        <div>
          <div
            className="text-[11px] tracking-[0.14em] uppercase text-(--text-dim)"
            style={mono}
          >
            Revenue
          </div>
          <div
            className="text-[28px] font-bold leading-none mt-1 tracking-[-0.02em]"
            style={display}
>
          </div>
        </div>
      </div>
    </div>

      <div className="flex flex-col flex-1 pt-6">
      {showRevenue ? (
        <div className="space-y-3">

          <div>
            <div
              className="text-[11px] uppercase tracking-[0.12em] text-(--text-dim) pt-1.5"
              style={mono}
            >
              THIS MONTH
            </div>

            <div
              className="text-2xl font-bold text-(--accent) mt-1"
              style={display}
            >
              {fmtMoney(revenue)}
            </div>
          </div>
          <div className="flex items-center justify-between">

  <span
    className="text-[11px] text-(--text-dim) uppercase tracking-[0.12em]"
    style={mono}
  >
    Revenue Updated
  </span>

  <button
    onClick={() => setShowRevenue(false)}
    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-(--accent-soft) border border-(--accent-border) text-(--accent) text-[11px] uppercase tracking-[0.12em] hover:scale-[1.03] hover:shadow-lg transition-all active:scale-[0.98]"
    style={mono}
  >
    Hide
    <Icon name="chev" size={10} />
  </button>
  </div>

  </div>
      ) : (
        <div className="flex flex-col gap-10 mt-2">
  <div
  className="text-[11px] tracking-[0.14em] uppercase text-(--text-dim)"
  style={mono}
>
  THIS MONTH
</div>
<button
  onClick={() => setShowRevenue(!showRevenue)}
  className="
    inline-flex items-center self-start gap-2
    px-4 py-2 rounded-xl
    bg-(--accent)
    text-black
    text-[11px] uppercase tracking-[0.14em]
    font-semibold
    shadow-[0_0_20px_rgba(0,255,200,0.25)]
    hover:scale-[1.03]
    hover:shadow-[0_0_28px_rgba(0,255,200,0.4)]
    transition-all duration-300
    active:scale-[0.98]
    cursor-pointer
  "
  style={mono}
>
  {showRevenue ? 'Hide Revenue' : 'Show Revenue'}

  <Icon
    name="chev"
    size={11}
    className={`transition-transform duration-300 ${
      showRevenue ? 'rotate-90' : ''
    }`}
  />
</button>
</div>
      )}
    </div>
  </div>

  {/* Dues This Week */}
  <StatCard
    icon="bell"
    iconVariant={counts.overdue > 0 ? 'danger' : 'warn'}
    label="Dues This Week"
    value={counts.overdue + counts['due-soon']}
    // suffix={counts.overdue > 0 ? `· ${counts.overdue} OVERDUE` : ''}
  />

</div>
      {/* Bottom Dashboard Section */}
<div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-5">

  {/* LEFT SIDE */}
  <div className="flex flex-col gap-5">

    {/* Plan Mix */}
    <div>
      <div className="flex items-center justify-between mb-3.5">
        <LabelBar>Plan Mix</LabelBar>
      </div>

      <div className="bg-(--bg-1) border border-(--border) rounded-[20px] p-5">

        <div className="grid grid-cols-2 gap-5">

          <div>
            <div
              className="text-[11px] tracking-[0.14em] uppercase text-(--accent) mb-2"
              style={mono}
            >
              Monthly
            </div>

            <div
              className="text-[38px] font-bold leading-none tracking-[-0.03em]"
              style={display}
            >
              {plans.monthly}
              <span className="text-sm text-(--text-dim) ml-1">
                · {monthlyPct}%
              </span>
            </div>
          </div>

          <div>
            <div
              className="text-[11px] tracking-[0.14em] uppercase text-(--info) mb-2"
              style={mono}
            >
              Yearly
            </div>

            <div
              className="text-[38px] font-bold leading-none tracking-[-0.03em]"
              style={display}
            >
              {plans.yearly}
              <span className="text-sm text-(--text-dim) ml-1">
                · {yearlyPct}%
              </span>
            </div>
          </div>

        </div>

        <div className="h-2.5 bg-(--bg-3) rounded-full overflow-hidden mt-4 flex">
          <div
            style={{
              width: `${monthlyPct}%`,
              background:
                'linear-gradient(90deg, var(--accent), var(--accent-2))',
            }}
          />

          <div
            style={{
              width: `${yearlyPct}%`,
              background: 'var(--info)',
            }}
          />
        </div>

        <div
          className="flex flex-wrap gap-4 mt-3.5 text-[11px] tracking-[0.12em] uppercase text-(--text-dim)"
          style={mono}
        >
          <span>
            <span className="inline-block w-2 h-2 rounded-full bg-(--accent) mr-2 align-middle" />
            {counts.active} Active
          </span>

          <span>
            <span className="inline-block w-2 h-2 rounded-full bg-(--warn) mr-2 align-middle" />
            {counts['due-soon']} Due Soon
          </span>

          <span>
            <span className="inline-block w-2 h-2 rounded-full bg-(--danger) mr-2 align-middle" />
            {counts.overdue} Overdue
          </span>

          {counts.paused > 0 && (
            <span>
              <span className="inline-block w-2 h-2 rounded-full bg-(--text-mute) mr-2 align-middle" />
              {counts.paused} Paused
            </span>
          )}
        </div>
      </div>
    </div>

  </div>

  {/* RIGHT SIDE */}
  <div>

    <div className="flex items-center justify-between mb-3.5">
      <LabelBar>Up Next</LabelBar>

      <button
        onClick={() => router.push('/reminders')}
        className="flex items-center gap-1 text-[12px] font-semibold tracking-[0.12em] uppercase text-(--text-dim) hover:text-(--text) transition-all"
        style={mono}
      >
        VIEW ALL <Icon name="chev" size={12} />
      </button>
    </div>

    <div className="bg-(--bg-1) border border-(--border) rounded-[20px] p-4">
      <div className="flex flex-col gap-2.5">

        {[...overdueList, ...upcomingList]
          .slice(0, 2)
          .map((m) => (
            <button
              key={m.id}
              onClick={() => router.push(`/members/${m.id}`)}
              className="flex items-center gap-3 px-3 py-3 bg-(--bg-2) border border-(--border) rounded-xl text-left w-full hover:border-(--border-strong) transition-all"
            >
              <Avatar name={m.name} photo={m.photo} size="sm" />

              <div className="flex-1 min-w-0">
                <div
                  className="text-sm font-semibold"
                  style={display}
                >
                  {m.name}
                </div>

                <div
                  className="flex gap-2 text-[10px] text-(--text-mute) uppercase tracking-widest mt-0.5"
                  style={mono}
                >
                  <span>{m.plan.toUpperCase()}</span>
                  <span>·</span>
                  <span>{fmtMoney(m.fee)}</span>
                </div>
              </div>

              <span
                className="text-[10px] font-semibold px-2.5 py-1 rounded-full border tracking-[0.12em] uppercase shrink-0"
                style={{
                  background:
                    m._status === 'overdue'
                      ? 'var(--danger-soft)'
                      : 'var(--warn-soft)',

                  color:
                    m._status === 'overdue'
                      ? 'var(--danger)'
                      : 'var(--warn)',

                  borderColor:
                    m._status === 'overdue'
                      ? 'rgba(255,107,107,0.25)'
                      : 'rgba(255,200,87,0.25)',

                  fontFamily:
                    "'JetBrains Mono', monospace",
                }}
              >
                {fmtRelative(m.paidUntil)}
              </span>
            </button>
          ))}

        {dueList.length === 0 && (
          <div className="py-6 text-center text-(--text-dim) text-sm">
            No pending reminders. Every member is up to date.
          </div>
        )}

      </div>
    </div>

  </div>

</div>

      {/* Recently joined */}
      <div>
        <div className="flex items-center justify-between mb-3.5">
          <LabelBar>Recently Joined</LabelBar>
          <button onClick={() => router.push('/members')}
            className="flex items-center gap-1 text-[12px] font-semibold tracking-[0.12em] uppercase text-(--text-dim) hover:text-(--text) transition-all" style={mono}>
            ALL MEMBERS <Icon name="chev" size={12} />
          </button>
        </div>
        <div className="flex flex-col gap-2">
          <div className="hidden md:grid gap-4 px-5 pb-2 text-[10px] text-(--text-mute) uppercase tracking-[0.18em]" style={{ gridTemplateColumns: '40px 1.4fr 1.2fr 1fr 1fr 90px', ...mono }}>
            <div /><div>Name / Phone</div><div>Plan</div><div>Joined</div><div>Next Due</div><div className="text-right">Status</div>
          </div>
          {[...members].sort((a, b) => (b.joining || '').localeCompare(a.joining || '')).slice(0, 4).map(m => (
            <MemberRow key={m.id} member={m} onClick={() => router.push(`/members/${m.id}`)} />
          ))}
        </div>
      </div>
    </div>
  );
}