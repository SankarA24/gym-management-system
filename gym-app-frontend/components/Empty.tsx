'use client';
import Icon from './Icon';

export default function Empty({ icon = 'users', title, body, action }: {
  icon?: string;
  title: string;
  body?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center border border-dashed border-[var(--border-strong)] rounded-2xl">
      <div className="text-[var(--text-mute)] mb-4">
        <Icon name={icon as Parameters<typeof Icon>[0]['name']} size={36} />
      </div>
      <div className="text-[var(--text-1)] text-lg font-semibold mb-1.5" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{title}</div>
      {body && <div className="text-[var(--text-dim)] text-sm">{body}</div>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
