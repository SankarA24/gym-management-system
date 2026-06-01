'use client';
import { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
// import { useAppState } from '@/lib/store';
import { useAuth } from '@/lib/auth-context';
import Icon from './Icon';
import Avatar from './Avatar';

const mono = { fontFamily: "'JetBrains Mono', monospace" };
const display = { fontFamily: "'Space Grotesk', sans-serif" };

const NAV_ITEMS = [
  { id: 'dashboard', icon: 'grid',    label: 'Dashboard' },
  { id: 'members',   icon: 'users',   label: 'Members' },
  { id: 'reminders', icon: 'bell',    label: 'Reminders' },
  { id: 'payments',  icon: 'wallet',  label: 'Payments' },
] as const;

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuth();

  const activeRoute = pathname.split('/')[1] || 'dashboard';

  return (
    <aside className="hidden md:flex w-60 shrink-0 flex-col border-r border-(--border-soft) sticky top-0 h-screen py-5 px-4"
      style={{ background: 'var(--gradient-sidebar)' }}>

      {/* Brand */}
      <div className="flex items-center gap-3 px-2 pb-5">
        <div className="w-9.5 h-9.5 rounded-[11px] grid place-items-center text-(--accent) border border-[color-mix(in_srgb,var(--accent)_35%,transparent)] shrink-0"
          style={{ background: 'var(--gradient-brand-mark)', boxShadow: '0 0 20px rgba(34,232,196,0.15) inset' }}>
          <Icon name="dumbbell" size={22} />
        </div>
      <button
      onClick={() => router.push('/dashboard')}
      className="
        group
        flex items-center gap-3
        px-2 py-1.5
        rounded-xl
        cursor-pointer
        transition-all duration-300
        hover:bg-(--accent-soft)
        hover:shadow-[0_0_20px_rgba(34,232,196,0.12)]
        active:scale-[0.98]
      "
  >
    <div
      className="
        text-[20px] font-bold tracking-[0.04em]
        text-(--accent)
        transition-all duration-300
        group-hover:tracking-[0.06em]
        group-hover:text-white
      "
      style={{
        ...display,
        textShadow: '0 0 12px rgba(34,232,196,0.4)',
      }}
    >
      IRONDESK
    </div>
</button>
  </div>
      {/* Search */}
      {/* <div className="flex items-center gap-2.5 px-3 py-2.5 bg-(--bg-1) border border-(--border) rounded-[10px] mb-4 text-(--text-dim) focus-within:border-[color-mix(in_srgb,var(--accent)_40%,var(--border-strong))] focus-within:text-(--text) transition-all">
        <Icon name="search" size={16} />
        <input
          className="flex-1 bg-transparent border-none outline-none text-[13px] text-(--text) placeholder:text-(--text-mute)"
          placeholder="Search members…"
          value={search}
          onChange={e => handleSearchChange(e.target.value)}
          onFocus={() => router.push('/members')}
        />
      </div> */}

      {/* Main nav */}
      <div className="flex flex-col gap-0.5">
        <div className="text-[10px] tracking-[0.18em] uppercase text-(--text-mute) px-2.5 pb-2" style={mono}>Workspace</div>
        {NAV_ITEMS.map(it => {
          const active = activeRoute === it.id;
          return (
            <button key={it.id} onClick={() => router.push(`/${it.id}`)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-[10px] text-[12px] font-medium tracking-[0.12em] uppercase transition-all border ${active ? 'text-(--accent) border-[color-mix(in_srgb,var(--accent)_35%,transparent)]' : 'text-(--text-dim) border-transparent hover:text-(--text-1) hover:bg-(--bg-1)'}`}
              style={{ ...mono, background: active ? 'linear-gradient(90deg, var(--accent-soft), transparent)' : undefined }}>
              <Icon name={it.icon as Parameters<typeof Icon>[0]['name']} size={18} className="shrink-0 opacity-90" />
              <span className="flex-1 text-left">{it.label}</span>
              <Icon name="chev" size={14} style={{ color: active ? 'var(--accent)' : 'transparent' }} />
            </button>
          );
        })}
      </div>

      {/* Account nav */}
      <div className="flex flex-col gap-0.5 mt-4">
        <div className="text-[10px] tracking-[0.18em] uppercase text-(--text-mute) px-2.5 pb-2" style={mono}>Account</div>
        {(() => {
          const active = activeRoute === 'settings';
          return (
            <button onClick={() => router.push('/settings')}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-[10px] text-[12px] font-medium tracking-[0.12em] uppercase transition-all border ${active ? 'text-(--accent) border-[color-mix(in_srgb,var(--accent)_35%,transparent)]' : 'text-(--text-dim) border-transparent hover:text-(--text-1) hover:bg-(--bg-1)'}`}
              style={{ ...mono, background: active ? 'linear-gradient(90deg, var(--accent-soft), transparent)' : undefined }}>
              <Icon name="settings" size={18} className="shrink-0 opacity-90" />
              <span className="flex-1 text-left">Settings</span>
              <Icon name="chev" size={14} style={{ color: active ? 'var(--accent)' : 'transparent' }} />
            </button>
          );
        })()}
      </div>

      <div className="flex-1" />

      {/* Footer */}
      <div className="flex items-center gap-2.5 px-2.5 pt-3.5 border-t border-(--border-soft) mt-3">
        <Avatar name={user?.name||'User'} size="sm" ring />
        <div>
          <div className="text-[13px] font-semibold text-(--text)">{user?.name||''}</div>
          <div className="text-[11px] text-(--text-mute) tracking-widest uppercase" style={mono}>Gym Owner</div>
        </div>
     <button
  onClick={() => {
    localStorage.clear();
    router.push('/login');
  }}
  className="group flex items-center gap-2 mt-2 px-2 py-1.5 rounded-lg border border-red-500/20 bg-red-500/5 hover:bg-red-500/10 hover:border-red-400/40 transition-all duration-200"
>
  <Icon
    name="settings"
    size={14}
    className="text-red-400 group-hover:text-red-300"
  />

  <span
    className="text-[10px] uppercase tracking-[0.18em] text-red-400 group-hover:text-red-300"
    style={mono}
  >
    Logout
  </span>
</button>
      </div>
    </aside>
  );
}