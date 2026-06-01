'use client';
import { useAppState } from '@/lib/store';
import { useModal } from '@/lib/modal-context';
import Icon from './Icon';
import Bell from './Bell';
import ThemeToggle from './ThemeToggle';

const display = { fontFamily: "'Space Grotesk', sans-serif" };
const mono = { fontFamily: "'JetBrains Mono', monospace" };

export default function Topbar({ title, subtitle, backLabel, onBack }: {
  title: string;
  subtitle?: string;
  backLabel?: string;
  onBack?: () => void;
}) {
  const { ownerName } = useAppState();
  const { openAdd } = useModal();

  return (
    <header className="flex items-center justify-between px-5 md:px-9.5 pt-6 md:pt-7 pb-5 gap-4">
      <div>
        {backLabel && onBack && (
          <button onClick={onBack} className="flex items-center gap-2 text-(--text-dim) text-[12px] font-semibold tracking-[0.12em] uppercase mb-2 -ml-2 px-2.5 py-1.5 rounded-lg hover:text-(--text) hover:bg-(--bg-1) transition-all" style={mono}>
            <Icon name="back" size={14} /> {backLabel}
          </button>
        )}
        {title === 'hello' ? (
          <div className="text-[28px] font-medium tracking-[-0.02em]" style={display}>
            Hello, <b className="font-bold">{ownerName}</b>
          </div>
        ) : (
          <>
            <div className="text-[26px] md:text-[32px] font-bold tracking-tight" style={display}>{title}</div>
            {subtitle && <div className="text-(--text-dim) mt-1.5 text-sm">{subtitle}</div>}
          </>
        )}
      </div>
      <div className="flex items-center gap-3">
        <ThemeToggle />
        <button onClick={openAdd}
          className="hidden md:flex items-center gap-2 px-4 py-2.5 rounded-[10px] bg-(--accent) text-(--accent-text-on) text-[12px] font-semibold tracking-[0.12em] uppercase hover:brightness-95 transition-all"
          style={{ ...mono, boxShadow: '0 0 0 1px rgba(34,232,196,0.5),0 8px 24px rgba(34,232,196,0.25)' }}>
          <Icon name="plus" size={14} /> ADD MEMBER
        </button>
        <Bell />
      </div>
    </header>
  );
}