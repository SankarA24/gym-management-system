'use client';
import Icon from './Icon';

const iconVariantCls: Record<string, string> = {
  accent: 'bg-[var(--accent-soft)] border-[color-mix(in_srgb,var(--accent)_25%,transparent)] text-[var(--accent)]',
  info:   'bg-[var(--info-soft)]   border-[color-mix(in_srgb,var(--info)_25%,transparent)]   text-[var(--info)]',
  warn:   'bg-[var(--warn-soft)]   border-[color-mix(in_srgb,var(--warn)_25%,transparent)]   text-[var(--warn)]',
  danger: 'bg-[var(--danger-soft)] border-[color-mix(in_srgb,var(--danger)_25%,transparent)] text-[var(--danger)]',
};

export default function StatCard({ icon = 'grid', iconVariant = 'accent', label, value, suffix, delta, wide = false }: {
  icon?: string;
  iconVariant?: string;
  label: string;
  value: React.ReactNode;
  suffix?: string;
  delta?: { text: string; dir?: string };
  wide?: boolean;
}) {
  return (
    <div className="bg-(--bg-1) border border-(--border) rounded-[20px] p-5 flex flex-col gap-5 min-h-45 relative overflow-hidden">
      <div className="flex items-start justify-between gap-3">
        <div className={`w-13 h-13 rounded-[14px] border grid place-items-center shrink-0 ${iconVariantCls[iconVariant] || iconVariantCls.accent}`}>
          <Icon name={icon as Parameters<typeof Icon>[0]['name']} size={22} />
        </div>
        {delta && (
          <span className={`px-2.5 py-1.5 rounded-lg border text-[11px] font-semibold tracking-widest uppercase ${delta.dir === 'down' ? 'bg-(--danger-soft) text-(--danger) border-[color-mix(in_srgb,var(--danger)_20%,transparent)]' : 'bg-(--accent-soft) text-(--accent) border-[color-mix(in_srgb,var(--accent)_20%,transparent)]'}`}
            style={{ fontFamily: "'JetBrains Mono', monospace" }}>
            {delta.text}
          </span>
        )}
      </div>
      <div className="flex flex-col gap-2 mt-auto">
        <div className="text-[11px] tracking-[0.14em] uppercase text-(--text-dim) " style={{ fontFamily: "'JetBrains Mono', monospace" }}>{label}</div>
        <div className={`font-bold leading-none tracking-[-0.03em] text-(--text) ${wide ? 'text-[56px]' : 'text-[44px]'}`} style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
          {value}
          {suffix && <span className="text-sm text-(--text-dim) ml-1 tracking-[-0.01em]">{suffix}</span>}
        </div>
      </div>
    </div>
  );
}
