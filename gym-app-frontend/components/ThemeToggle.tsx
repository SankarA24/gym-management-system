'use client';
import { useTheme } from '@/lib/theme-context';
import Icon from './Icon';

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  return (
    <div className="inline-flex items-center h-10.5 px-1 gap-0.5 rounded-[11px] border border-(--border) bg-(--bg-1)">
      <button
        onClick={() => setTheme('dark')}
        aria-label="Dark theme"
        className={`w-8 h-8 grid place-items-center rounded-lg transition-all ${theme === 'dark' ? 'bg-(--bg-3) text-(--accent)' : 'text-(--text-mute) hover:text-(--text-1)'}`}
      >
        <Icon name="moon" size={16} />
      </button>
      <button
        onClick={() => setTheme('light')}
        aria-label="Light theme"
        className={`w-8 h-8 grid place-items-center rounded-lg transition-all ${theme === 'light' ? 'bg-(--bg-3) text-(--accent)' : 'text-(--text-mute) hover:text-(--text-1)'}`}
      >
        <Icon name="sun" size={16} />
      </button>
    </div>
  );
}