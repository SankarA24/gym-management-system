'use client';
import { usePathname, useRouter } from 'next/navigation';
import { useModal } from '@/lib/modal-context';
import Icon from './Icon';

const mono = { fontFamily: "'JetBrains Mono', monospace" };

const ITEMS = [
  { id: 'dashboard', icon: 'home',   label: 'Home' },
  { id: 'members',   icon: 'users',  label: 'Members' },
  { id: 'add',       icon: 'plus',   label: 'Add', isAdd: true },
  { id: 'payments',  icon: 'wallet', label: 'Pay' },
  { id: 'reminders', icon: 'bell',   label: 'Alerts' },
] as const;

export default function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { openAdd } = useModal();
  const activeRoute = pathname.split('/')[1] || 'dashboard';

  return (
    <nav className="flex md:hidden fixed bottom-0 left-0 right-0 border-t border-(--border) px-3 pb-4 pt-2 justify-around z-30"
      style={{ background: 'color-mix(in srgb, var(--bg) 92%, transparent)', backdropFilter: 'blur(16px)' }}>
      {ITEMS.map(it => {
        const active = activeRoute === it.id;
        if ('isAdd' in it && it.isAdd) {
          return (
            <button key="add" onClick={openAdd}
              className="w-14 h-14 -mt-4 rounded-[18px] grid place-items-center text-(--accent-text-on) bg-(--accent) shrink-0"
              style={{ boxShadow: '0 8px 24px rgba(34,232,196,0.4)' }}>
              <Icon name="plus" size={24} />
            </button>
          );
        }
        return (
          <button key={it.id} onClick={() => router.push(`/${it.id}`)}
            className={`flex-1 flex flex-col items-center gap-1 px-2 py-2 rounded-[10px] text-[9px] font-medium tracking-[0.14em] uppercase transition-all ${active ? 'text-(--accent)' : 'text-(--text-mute)'}`}
            style={mono}>
            <Icon name={it.icon as Parameters<typeof Icon>[0]['name']} size={20} />
            <span>{it.label}</span>
          </button>
        );
      })}
    </nav>
  );
}