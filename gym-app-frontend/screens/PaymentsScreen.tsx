'use client';
import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { fmtDate, fmtMoney } from '@/lib/data';
import { useAppState } from '@/lib/store';
import StatCard from '@/components/StatCard';
import Avatar from '@/components/Avatar';
import { PlanPill } from '@/components/StatusPill';
import Empty from '@/components/Empty';
import Icon from '@/components/Icon';

const mono = { fontFamily: "'JetBrains Mono', monospace" };
const display = { fontFamily: "'Space Grotesk', sans-serif" };

export default function PaymentsScreen() {
  const router = useRouter();

  const { members } = useAppState();

  const [monthFilter, setMonthFilter] = useState('all');
  const [query, setQuery] = useState('');

  // ALL PAYMENTS
  const all = useMemo(() => {
    const rows: {
      id: string;
      memberId: string;
      name: string;
      phone: string;
      photo: string | null;
      plan: 'monthly' | 'yearly';
      fee: number;
      paidOn: string;
      period: string;
    }[] = [];

    for (const m of members) {
      for (const p of m.payments || []) {
        rows.push({
          id: `${m.id}_${p.paidOn}_${Math.random()}`,
          memberId: m.id,
          name: m.name,
          phone: m.phone,
          photo: m.photo,
          plan: m.plan,
          fee: m.fee,
          paidOn: p.paidOn,
          period: p.period,
        });
      }
    }

    rows.sort(
      (a, b) =>
        new Date(b.paidOn).getTime() -
        new Date(a.paidOn).getTime()
    );

    return rows;
  }, [members]);

  // LAST 6 MONTHS
  const months = useMemo(() => {
    const today = new Date();

    return Array.from({ length: 6 }, (_, i) => {
      const d = new Date(
        today.getFullYear(),
        today.getMonth() - (5 - i),
        1
      );

      const month = d.getMonth();
      const year = d.getFullYear();

      const total = all.reduce((sum, p) => {
        const paidDate = new Date(p.paidOn);

        const sameMonth =
          paidDate.getMonth() === month &&
          paidDate.getFullYear() === year;

        return sameMonth ? sum + (p.fee || 0) : sum;
      }, 0);

      return {
        ym: `${year}-${String(month + 1).padStart(2, '0')}`,
        label: d
          .toLocaleDateString('en-US', {
            month: 'short',
          })
          .toUpperCase(),
        total,
      };
    });
  }, [all]);

  // SUMMARY
  const maxMonth = Math.max(
    1,
    ...months.map((m) => m.total)
  );

  const thisMonth =
    months[months.length - 1]?.total || 0;

  const lastMonth =
    months[months.length - 2]?.total || 0;

  const ytd = all.reduce(
    (s, p) => s + (p.fee || 0),
    0
  );

  // FILTER
  const filtered = useMemo(() => {
    let list = all;

    if (monthFilter !== 'all') {
      list = list.filter((p) => {
        const paidDate = new Date(p.paidOn);

        const ym = `${paidDate.getFullYear()}-${String(
          paidDate.getMonth() + 1
        ).padStart(2, '0')}`;

        return ym === monthFilter;
      });
    }

    if (query.trim()) {
      const q = query.toLowerCase();

      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          (p.phone || '').includes(q)
      );
    }

    return list;
  }, [all, monthFilter, query]);

  const filteredTotal = filtered.reduce(
    (s, p) => s + (p.fee || 0),
    0
  );

  return (
    <div className="flex flex-col gap-6 px-5 md:px-9.5 pt-4 md:pt-6 pb-28 md:pb-15 animate-fade">

      {/* SUMMARY */}
      {/* <div className="grid grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr] gap-4"> */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

        {/* THIS MONTH */}
        <div className="bg-(--bg-1) border border-(--border) rounded-[20px] p-5 flex flex-col gap-5 min-h-45">

          <div className="flex items-start justify-between gap-3">

            <div
              className="w-13 h-13 rounded-[14px] border grid place-items-center shrink-0 bg-(--accent-soft) border-[color-mix(in_srgb,var(--accent)_25%,transparent)] text-(--accent)"
            >
              <Icon name="wallet" size={22} />
            </div>

            <span
              className="px-2.5 py-1.5 rounded-lg border text-[11px] font-semibold tracking-widest uppercase bg-(--accent-soft) text-(--accent) border-[color-mix(in_srgb,var(--accent)_20%,transparent)]"
              style={mono}
            >
              {lastMonth > 0
                ? `${thisMonth >= lastMonth ? '+' : ''}${Math.round(
                    ((thisMonth - lastMonth) / lastMonth) * 100
                  )}% VS LAST`
                : 'FIRST MONTH'}
            </span>
          </div>

          <div className="flex flex-col gap-2 mt-auto">
            <div
              className="text-[11px] tracking-[0.14em] uppercase text-(--text-dim)"
              style={mono}
            >
              Revenue · This Month
            </div>

            <div
              className="text-[44px] font-bold leading-none tracking-[-0.03em]"
              style={display}
            >
              {fmtMoney(thisMonth)}
            </div>
          </div>
        </div>

        <StatCard
          icon="trend"
          iconVariant="info"
          label="Revenue · YTD"
          value={fmtMoney(ytd)}
        />

        <StatCard
          icon="check"
          iconVariant="accent"
          label="Payments · Total"
          value={all.length}
        />
      </div>

      {/* CHART */}
      <div className="bg-(--bg-1) border border-(--border) rounded-[20px] p-5">

        <div className="flex items-center justify-between mb-1">

          <div
            className="flex items-center gap-2.5 text-[12px] font-medium tracking-[0.14em] uppercase text-(--text-1)"
            style={mono}
          >
            <span className="w-0.75 h-3.5 bg-(--accent) rounded-sm" />
            Last 6 Months
          </div>

          <span
            className="text-[11px] text-(--text-dim) uppercase tracking-[0.14em]"
            style={mono}
          >
            {months.reduce((s, m) => s + m.total, 0) > 0
              ? `PEAK · ${fmtMoney(maxMonth)}`
              : 'NO DATA'}
          </span>
        </div>

        <div className="flex items-end gap-2 h-27.5 mt-4">
          {months.map((m) => {
            const h = Math.max(
              4,
              Math.round((m.total / maxMonth) * 90)
            );

            const isActive =
              monthFilter === m.ym;

            return (
              <div
                key={m.ym}
                onClick={() =>
                  setMonthFilter(
                    isActive ? 'all' : m.ym
                  )
                }
                className="flex-1 flex flex-col items-center gap-1.5 cursor-pointer"
              >

                <div
                  className="w-full rounded-t-[5px] transition-all"
                  style={{
                    height: h,
                    background:
                      m.total === 0
                        ? 'var(--bg-3)'
                        : 'linear-gradient(180deg, var(--accent), var(--accent-2))',
                    opacity: isActive ? 1 : 0.6,
                  }}
                />

                <span
                  className={`text-[9px] font-medium tracking-[0.12em] uppercase ${
                    isActive
                      ? 'text-(--accent)'
                      : 'text-(--text-mute)'
                  }`}
                  style={mono}
                >
                  {m.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* SEARCH + FILTER */}
      <div className="flex flex-col md:flex-row gap-3 md:items-center">

        <div className="flex-1 min-w-60 flex items-center gap-2.5 px-4 py-3 bg-(--bg-1) border border-(--border) rounded-xl text-(--text-dim)">

          <Icon name="search" size={16} />

          <input
            className="flex-1 bg-transparent border-none outline-none text-sm text-(--text) placeholder:text-(--text-mute)"
            placeholder="Search by member name or phone..."
            value={query}
            onChange={(e) =>
              setQuery(e.target.value)
            }
          />
        </div>

        <select
          className="bg-(--bg) border border-(--border-strong) rounded-xl px-3.5 py-3 text-[11px] text-(--text)"
          style={mono}
          value={monthFilter}
          onChange={(e) =>
            setMonthFilter(e.target.value)
          }
        >
          <option value="all">
            ALL MONTHS
          </option>

          {[...months]
            .reverse()
            .map((m) => (
              <option
                key={m.ym}
                value={m.ym}
              >
                {m.label}{' '}
                {m.ym.slice(0, 4)}
              </option>
            ))}
        </select>
      </div>

      {/* SUMMARY ROW */}
      <div className="flex items-center justify-between">

        <div
          className="flex items-center gap-2.5 text-[12px] font-medium tracking-[0.14em] uppercase text-(--text-1)"
          style={mono}
        >
          <span className="w-0.75 h-3.5 bg-(--accent) rounded-sm" />

          {filtered.length} payment
          {filtered.length === 1 ? '' : 's'}
        </div>

        <span
          className="text-[11px] text-(--text-dim) uppercase tracking-[0.14em]"
          style={mono}
        >
          TOTAL ·{' '}
          <span
            style={{
              color: 'var(--accent)',
            }}
          >
            {fmtMoney(filteredTotal)}
          </span>
        </span>
      </div>

      {/* PAYMENTS */}
      <div className="flex flex-col gap-1.5">

        {filtered.length === 0 ? (
          <Empty
            icon="wallet"
            title="No payments found"
            body="Payments will appear here once members are billed."
          />
        ) : (
          filtered.map((p, index) => (
            <div
              key={`${p.id}_${index}`}
              className="grid items-center gap-3.5 px-4 py-3.5 bg-(--bg-1) border border-(--border) rounded-xl"
              style={{
                gridTemplateColumns:
                  '40px 1.4fr 1fr 1fr 1fr auto',
              }}
            >

              <Avatar
                name={p.name}
                photo={p.photo}
                size="md"
              />

              <div>
                <div
                  className="text-sm font-semibold"
                  style={display}
                >
                  {p.name}
                </div>

                <div
                  className="text-[11px] text-(--text-mute)"
                  style={mono}
                >
                  {p.phone}
                </div>
              </div>

              <div className="hidden md:block">
                <div
                  className="text-[10px] text-(--text-mute) uppercase tracking-[0.14em] mb-1"
                  style={mono}
                >
                  Plan
                </div>

                <PlanPill plan={p.plan} />
              </div>

              <div className="hidden md:block">
                <div
                  className="text-[10px] text-(--text-mute) uppercase tracking-[0.14em] mb-1"
                  style={mono}
                >
                  Paid On
                </div>

                <div
                  className="text-[13px] text-(--text-1)"
                  style={mono}
                >
                  {fmtDate(
                    p.paidOn,
                    'mono'
                  )}
                </div>
              </div>

              <div className="hidden md:block">
                <div
                  className="text-[10px] text-(--text-mute) uppercase tracking-[0.14em] mb-1"
                  style={mono}
                >
                  Period
                </div>

                <div
                  className="text-[13px] text-(--text-1)"
                  style={mono}
                >
                  {p.plan === 'yearly'
                    ? '1 Year'
                    : '1 Month'}
                </div>
              </div>

              <div className="flex flex-col items-end gap-1">

                <div
                  className="text-lg font-bold tracking-[-0.01em]"
                  style={{
                    ...display,
                    color: 'var(--accent)',
                  }}
                >
                  {fmtMoney(p.fee)}
                </div>

                <button
                  onClick={() =>
                    router.push(
                      `/members/${p.memberId}`
                    )
                  }
                  className="flex items-center gap-1 text-[10px] text-(--text-dim) hover:text-(--text)"
                  style={mono}
                >
                  VIEW MEMBER

                  <Icon
                    name="chev"
                    size={10}
                  />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}