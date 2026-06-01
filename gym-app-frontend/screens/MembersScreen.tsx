'use client';
import { useState, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { memberStatus, daysUntil } from '@/lib/data';
import type { MemberStatus } from '@/lib/types';
import { useAppState } from '@/lib/store';
import MemberRow from '@/components/MemberRow';
import Empty from '@/components/Empty';
import Icon from '@/components/Icon';

const mono = { fontFamily: "'JetBrains Mono', monospace" };

type FilterKey = 'all' | 'active' | 'due-soon' | 'overdue' | 'paused' | 'monthly' | 'yearly';

const FILTERS: { id: FilterKey; label: string }[] = [
  { id: 'all',      label: 'All' },
  { id: 'active',   label: 'Active' },
  { id: 'due-soon', label: 'Due Soon' },
  { id: 'overdue',  label: 'Overdue' },
  { id: 'paused',   label: 'Paused' },
  { id: 'monthly',  label: 'Monthly' },
  { id: 'yearly',   label: 'Yearly' },
];

export default function MembersScreen() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { members } = useAppState();
  const [search, setSearch] = useState(searchParams.get('q') || '');
  const [filter, setFilter] = useState<FilterKey>('all');
  const [sort, setSort] = useState('name');

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: members.length, monthly: 0, yearly: 0, active: 0, 'due-soon': 0, overdue: 0, paused: 0 };
    for (const m of members) { c[m.plan]++; c[memberStatus(m)]++; }
    return c;
  }, [members]);

  const filtered = useMemo(() => {
    let list = members.filter(m => {
      if (!search) return true;
      const q = search.toLowerCase();
      return m.name.toLowerCase().includes(q) || (m.phone || '').includes(q);
    });
    if (filter === 'monthly' || filter === 'yearly') list = list.filter(m => m.plan === filter);
    else if (filter !== 'all') list = list.filter(m => memberStatus(m) === (filter as MemberStatus));
    list.sort((a, b) => {
      if (sort === 'name') return a.name.localeCompare(b.name);
      if (sort === 'joined') return (b.joining || '').localeCompare(a.joining || '');
      if (sort === 'due') return daysUntil(a.paidUntil) - daysUntil(b.paidUntil);
      return 0;
    });
    return list;
  }, [members, search, filter, sort]);

  return (
    <div className="flex flex-col gap-5 px-5 md:px-[38px] pt-4 md:pt-6 pb-28 md:pb-[60px] animate-fade">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-2.5 items-center">
        <div className="flex-1 min-w-[240px] flex items-center gap-2.5 px-4 py-3 bg-[var(--bg-1)] border border-[var(--border)] rounded-xl text-[var(--text-dim)] focus-within:border-[color-mix(in_srgb,var(--accent)_40%,var(--border-strong))] transition-all">
          <Icon name="search" size={16} />
          <input className="flex-1 bg-transparent border-none outline-none text-sm text-[var(--text)] placeholder:text-[var(--text-mute)]"
            placeholder="Search by name or phone…" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <select className="bg-[var(--bg)] border border-[var(--border-strong)] rounded-xl px-3.5 py-3 text-[11px] text-[var(--text)] outline-none focus:border-[var(--accent)] transition-all"
          style={mono} value={sort} onChange={e => setSort(e.target.value)}>
          <option value="name">SORT · NAME</option>
          <option value="joined">SORT · RECENT</option>
          <option value="due">SORT · DUE DATE</option>
        </select>
      </div>
      {/* Filter Menus */}
<div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

  {/* STATUS BOX */}
  <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-1)] p-4">

    <div
      className="mb-3 text-[10px] uppercase tracking-[0.16em] text-[var(--text-mute)]"
      style={mono}
    >
      Status
    </div>

    <div className="flex gap-2 flex-wrap">
      {FILTERS.filter(f =>
        ['all', 'active', 'due-soon', 'overdue', 'paused'].includes(f.id)
      ).map(f => (
        <button
          key={f.id}
          onClick={() => setFilter(f.id)}
          className={`px-3.5 py-2 rounded-xl border text-[11px] font-medium tracking-[0.12em] uppercase transition-all ${
            filter === f.id
              ? 'bg-[var(--accent-soft)] text-[var(--accent)] border-[color-mix(in_srgb,var(--accent)_35%,transparent)]'
              : 'bg-[var(--bg)] text-[var(--text-dim)] border-[var(--border)] hover:text-[var(--text-1)] hover:border-[var(--border-strong)]'
          }`}
          style={mono}
        >
          {f.label}

          <span className="ml-1.5 text-[var(--text-mute)]">
            {counts[f.id] ?? 0}
          </span>
        </button>
      ))}
    </div>

  </div>

  {/* PLANS BOX */}
  <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-1)] p-4">

    <div
      className="mb-3 text-[10px] uppercase tracking-[0.16em] text-[var(--text-mute)]"
      style={mono}
    >
      Plans
    </div>

    <div className="flex gap-2 flex-wrap">
      {FILTERS.filter(f =>
        ['all', 'monthly', 'yearly'].includes(f.id)
      ).map(f => (
        <button
          key={f.id}
          onClick={() => setFilter(f.id)}
          className={`px-3.5 py-2 rounded-xl border text-[11px] font-medium tracking-[0.12em] uppercase transition-all ${
            filter === f.id
              ? 'bg-[var(--accent-soft)] text-[var(--accent)] border-[color-mix(in_srgb,var(--accent)_35%,transparent)]'
              : 'bg-[var(--bg)] text-[var(--text-dim)] border-[var(--border)] hover:text-[var(--text-1)] hover:border-[var(--border-strong)]'
          }`}
          style={mono}
        >
          {f.id === 'all' ? 'All Plans' : f.label}

          <span className="ml-1.5 text-[var(--text-mute)]">
            {counts[f.id] ?? 0}
          </span>
        </button>
      ))}
    </div>

  </div>

</div>


      {/* Dynamic Tables */}
<div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

  {/* STATUS TABLE */}
  <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-1)] p-4">

    <div
      className="mb-3 text-[10px] uppercase tracking-[0.16em] text-[var(--text-mute)]"
      style={mono}
    >
      Status Members
    </div>

    <div
      className="hidden md:grid gap-4 px-2 pb-2 text-[10px] text-[var(--text-mute)] uppercase tracking-[0.18em]"
      style={{
        gridTemplateColumns: '1.2fr 1fr 90px',
        ...mono
      }}
    >
      <div>Name</div>
      <div>Next Due</div>
      <div className="text-right">Status</div>
    </div>

    <div className="flex flex-col gap-2">
      {filtered
        .filter(m =>
          ['active', 'due-soon', 'overdue', 'paused'].includes(memberStatus(m))
        )
        .map(m => (
          <div
            key={m.id}
            onClick={() => router.push(`/members/${m.id}`)}
            className="grid gap-4 items-center px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--bg)] cursor-pointer hover:border-[var(--accent-border)] transition-all"
            style={{ gridTemplateColumns: '1.2fr 1fr 90px' }}
          >
            <div>
              <div className="font-semibold text-[var(--text)]">
                {m.name}
              </div>

              <div className="text-[12px] text-[var(--text-mute)]">
                {m.phone}
              </div>
            </div>

            <div>
              <div className="font-semibold text-[var(--text)]">
                {m.paidUntil}
              </div>
            </div>

            <div className="text-right">
              <span
                className="px-2 py-1 rounded-full text-[10px] uppercase tracking-[0.12em]"
                style={mono}
              >
                {memberStatus(m)}
              </span>
            </div>
          </div>
        ))}
    </div>

  </div>

  {/* PLANS TABLE */}
  <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-1)] p-4">

    <div
      className="mb-3 text-[10px] uppercase tracking-[0.16em] text-[var(--text-mute)]"
      style={mono}
    >
      Plan Members
    </div>

    <div
      className="hidden md:grid gap-4 px-2 pb-2 text-[10px] text-[var(--text-mute)] uppercase tracking-[0.18em]"
      style={{
        gridTemplateColumns: '1.2fr 1fr 1fr',
        ...mono
      }}
    >
      <div>Name</div>
      <div>Plan</div>
      <div>Joined</div>
    </div>

    <div className="flex flex-col gap-2">
      {filtered
        .filter(m => ['monthly', 'yearly'].includes(m.plan))
        .map(m => (
          <div
            key={m.id}
            onClick={() => router.push(`/members/${m.id}`)}
            className="grid gap-4 items-center px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--bg)] cursor-pointer hover:border-[var(--accent-border)] transition-all"
            style={{ gridTemplateColumns: '1.2fr 1fr 1fr' }}
          >
            <div>
              <div className="font-semibold text-[var(--text)]">
                {m.name}
              </div>

              <div className="text-[12px] text-[var(--text-mute)]">
                {m.phone}
              </div>
            </div>

            <div>
              <span
                className="px-2 py-1 rounded-full border border-[var(--border)] text-[10px] uppercase tracking-[0.12em]"
                style={mono}
              >
                {m.plan}
              </span>
            </div>

            <div className="font-semibold text-[var(--text)]">
              {m.joining}
            </div>
          </div>
        ))}
    </div>

  </div>

</div>
    </div>
  );
}