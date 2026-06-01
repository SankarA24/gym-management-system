'use client';
import { avColor, initials } from '@/lib/data';

type AvatarSize = 'sm' | 'md' | 'lg' | 'xl';

const sizeMap: Record<AvatarSize, { cls: string; font: string }> = {
  sm: { cls: 'w-8 h-8 text-xs',    font: '12px' },
  md: { cls: 'w-10 h-10 text-sm',  font: '14px' },
  lg: { cls: 'w-14 h-14 text-lg',  font: '18px' },
  xl: { cls: 'w-22 h-22 rounded-[22px]', font: '28px' },
};

export default function Avatar({ name, photo, size = 'md', ring = false }: {
  name: string;
  photo?: string | null;
  size?: AvatarSize;
  ring?: boolean;
}) {
  const hue = avColor(name || '?');
  const bg = photo ? 'var(--bg-2)' : `linear-gradient(135deg, oklch(0.28 0.06 ${hue}) 0%, oklch(0.18 0.04 ${hue}) 100%)`;
  const ringStyle = ring ? { boxShadow: '0 0 0 2px var(--accent), 0 0 16px rgba(34,232,196,0.18)' } : {};
  const { cls, font } = sizeMap[size];
  const xlCls = size === 'xl' ? 'w-[88px] h-[88px] rounded-[22px]' : 'rounded-full';

  return (
    <div
      className={`grid place-items-center shrink-0 overflow-hidden border border-(--border-strong) relative ${xlCls} ${cls}`}
      style={{ background: bg, fontSize: font, color: 'var(--text)', fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, ...ringStyle }}
    >
      {photo
        ? <img src={photo} alt={name} className="w-full h-full object-cover" />
        : <span>{initials(name)}</span>}
    </div>
  );
}
