'use client';
import { useState, useRef, useMemo } from 'react';
import { todayISO, addPeriod, fmtDate } from '@/lib/data';
import type { Member, Settings, MemberFormPayload } from '@/lib/types';
import Icon from './Icon';

const mono = { fontFamily: "'JetBrains Mono', monospace" };
const display = { fontFamily: "'Space Grotesk', sans-serif" };

const inputCls = 'w-full bg-[var(--bg)] border border-[var(--border-strong)] rounded-[10px] px-3.5 py-3 text-sm text-[var(--text)] outline-none transition-all focus:border-[var(--accent)] focus:shadow-[0_0_0_4px_var(--accent-softer)] placeholder:text-[var(--text-mute)]';
const labelCls = 'text-[10px] font-medium tracking-[0.16em] uppercase text-[var(--text-dim)] mb-2';

export default function MemberFormModal({ initial, settings, onClose, onSave }: {
  initial?: Member;
  settings?: Settings;
  onClose: () => void;
  onSave: (p: MemberFormPayload) => void;
}) {
  const editing = !!initial;
  const def = settings;
  const [name, setName] = useState(initial?.name || '');
  const [phone, setPhone] = useState(initial?.phone || '');
  const [plan, setPlan] = useState<'monthly' | 'yearly'>(initial?.plan || def?.defaultPlan || 'monthly');
  const [fee, setFee] = useState(
    initial?.fee?.toString() ||
    (plan === 'yearly' ? (def?.defaultYearlyFee ?? '').toString() : (def?.defaultMonthlyFee ?? '').toString())
  );
  const [joining, setJoining] = useState(initial?.joining || todayISO());
  const [photo, setPhoto] = useState<string | null>(initial?.photo || null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const fileRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = 'Required';
    if (!phone.trim()) errs.phone = 'Required';
    if (!fee || Number(fee) <= 0) errs.fee = 'Enter a fee';
    if (!joining) errs.joining = 'Required';
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    onSave({ name: name.trim(), phone: phone.trim(), plan, fee: Number(fee), joining, photo });
  };

  const handlePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 1.5 * 1024 * 1024) { alert('Image too large. Pick something under 1.5MB.'); return; }
    const reader = new FileReader();
    reader.onload = () => setPhoto(reader.result as string);
    reader.readAsDataURL(file);
  };

  const previewDue = useMemo(() => joining ? addPeriod(joining, plan, 1) : null, [joining, plan]);

  const switchPlan = (p: 'monthly' | 'yearly') => {
    setPlan(p);
    if (!initial && def) setFee(String(p === 'yearly' ? def.defaultYearlyFee : def.defaultMonthlyFee));
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-[8px] z-[100] grid place-items-center p-5 animate-fade" onClick={onClose}>
      <form
        className="w-full max-w-[560px] max-h-[calc(100vh-40px)] overflow-y-auto border border-[var(--border-strong)] rounded-[22px] p-7 flex flex-col gap-5 animate-pop"
        style={{ background: 'var(--gradient-modal)', boxShadow: '0 32px 96px rgba(0,0,0,0.5)' }}
        onSubmit={handleSubmit}
        onClick={e => e.stopPropagation()}
      >
        {/* Head */}
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2.5 text-[12px] font-medium tracking-[0.14em] uppercase text-[var(--text-1)]" style={mono}>
              <span className="w-[3px] h-3.5 bg-[var(--accent)] rounded-sm" />
              {editing ? 'Edit Member' : 'New Member'}
            </div>
            <div className="text-2xl font-bold mt-2.5 tracking-[-0.02em]" style={display}>
              {editing ? 'Update Member' : 'Add a New Member'}
            </div>
            <div className="text-[var(--text-dim)] text-sm mt-1.5">
              {editing ? 'Make changes to this member\'s profile.' : 'Enter details and choose a billing plan. First due date is set automatically.'}
            </div>
          </div>
          <button type="button" onClick={onClose} className="w-9 h-9 rounded-[10px] grid place-items-center text-[var(--text-dim)] border border-[var(--border)] hover:text-[var(--text)] hover:border-[var(--border-strong)] transition-all">
            <Icon name="x" size={16} />
          </button>
        </div>

        {/* Photo */}
        <div className="flex items-center gap-3.5">
          <button type="button" onClick={() => fileRef.current?.click()}
            className="w-16 h-16 rounded-[18px] border border-dashed border-[var(--border-strong)] grid place-items-center text-[var(--text-mute)] bg-[var(--bg)] overflow-hidden">
            {photo ? <img src={photo} alt="" className="w-full h-full object-cover" /> : <Icon name="user" size={26} />}
          </button>
          <div className="flex flex-col gap-1.5">
            <div className={labelCls}>Photo (optional)</div>
            <div className="flex gap-1.5">
              <button type="button" onClick={() => fileRef.current?.click()}
                className="flex items-center gap-2 px-3 py-2 rounded-[10px] border border-[var(--border-strong)] bg-[var(--bg-1)] text-[var(--text-1)] text-[10px] font-semibold tracking-[0.12em] uppercase hover:border-[color-mix(in_srgb,var(--accent)_50%,transparent)] hover:text-[var(--accent)] transition-all"
                style={mono}>
                {photo ? 'REPLACE' : 'UPLOAD'}
              </button>
              {photo && (
                <button type="button" onClick={() => setPhoto(null)}
                  className="flex items-center gap-2 px-3 py-2 rounded-[10px] text-[var(--text-dim)] text-[10px] font-semibold tracking-[0.12em] uppercase hover:text-[var(--text)] hover:bg-[var(--bg-1)] transition-all"
                  style={mono}>REMOVE</button>
              )}
            </div>
            <input ref={fileRef} type="file" accept="image/*" onChange={handlePhoto} className="hidden" />
          </div>
        </div>

        {/* Name + Phone */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={`block ${labelCls}`}>Full Name *</label>
            <input className={`${inputCls} ${errors.name ? 'border-[var(--danger)]' : ''}`} value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Rohan Iyer" autoFocus />
            {errors.name && <span className="text-[var(--danger)] text-[10px] tracking-[0.14em] uppercase mt-1 block" style={mono}>{errors.name}</span>}
          </div>
          <div>
            <label className={`block ${labelCls}`} style={mono}>Phone *</label>
            <input className={`${inputCls} ${errors.phone ? 'border-[var(--danger)]' : ''}`} style={mono} value={phone} onChange={e => setPhone(e.target.value)} placeholder="+91 98XXX XXXXX" />
            {errors.phone && <span className="text-[var(--danger)] text-[10px] tracking-[0.14em] uppercase mt-1 block" style={mono}>{errors.phone}</span>}
          </div>
        </div>

        {/* Date + Fee */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={`block ${labelCls}`}>Joining Date *</label>
            <input type="date" className={`${inputCls} ${errors.joining ? 'border-[var(--danger)]' : ''}`} style={mono} value={joining} onChange={e => setJoining(e.target.value)} max={todayISO()} />
            {errors.joining && <span className="text-[var(--danger)] text-[10px] tracking-[0.14em] uppercase mt-1 block" style={mono}>{errors.joining}</span>}
          </div>
          <div>
            <label className={`block ${labelCls}`}>Fee Amount (₹) *</label>
            <input type="number" min="0" className={`${inputCls} ${errors.fee ? 'border-[var(--danger)]' : ''}`} style={mono} value={fee} onChange={e => setFee(e.target.value)} placeholder="1800" />
            {errors.fee && <span className="text-[var(--danger)] text-[10px] tracking-[0.14em] uppercase mt-1 block" style={mono}>{errors.fee}</span>}
          </div>
        </div>

        {/* Plan */}
        <div>
          <label className={`block ${labelCls}`}>Subscription Plan *</label>
          <div className="grid grid-cols-2 gap-1.5 p-1 bg-[var(--bg)] border border-[var(--border-strong)] rounded-xl">
            {(['monthly', 'yearly'] as const).map(p => (
              <button key={p} type="button" onClick={() => switchPlan(p)}
                className={`py-2.5 rounded-lg text-[11px] font-semibold tracking-[0.14em] uppercase transition-all ${plan === p ? 'bg-[var(--accent)] text-[var(--accent-text-on)]' : 'text-[var(--text-dim)] hover:text-[var(--text-1)] hover:bg-[var(--bg-1)]'}`}
                style={{ ...mono, boxShadow: plan === p ? '0 0 0 1px rgba(34,232,196,0.4),0 0 16px rgba(34,232,196,0.25)' : undefined }}>
                {p.charAt(0).toUpperCase() + p.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Preview */}
        {previewDue && (
          <div className="flex items-center gap-3 px-3.5 py-3.5 rounded-xl border" style={{ background: 'var(--accent-softer)', borderColor: 'rgba(34,232,196,0.18)' }}>
            <Icon name="calendar" size={18} style={{ color: 'var(--accent)' }} />
            <div className="flex-1">
              <div className="text-[10px] tracking-[0.14em] uppercase text-[var(--accent)] mb-1" style={mono}>First Renewal On</div>
              <div className="text-lg font-semibold tracking-[-0.01em]" style={display}>{fmtDate(previewDue, 'long')}</div>
            </div>
            <span className="text-[10px] px-2.5 py-1.5 rounded-full bg-[var(--accent-soft)] text-[var(--accent)] border border-[color-mix(in_srgb,var(--accent)_25%,transparent)] font-semibold tracking-[0.14em] uppercase" style={mono}>
              {plan === 'yearly' ? '1 YEAR' : '1 MONTH'}
            </span>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end gap-2.5">
          <button type="button" onClick={onClose} className="flex items-center gap-2 px-4 py-2.5 rounded-[10px] text-[var(--text-dim)] text-[12px] font-semibold tracking-[0.12em] uppercase hover:text-[var(--text)] hover:bg-[var(--bg-1)] transition-all" style={mono}>CANCEL</button>
          <button type="submit" className="flex items-center gap-2 px-4 py-2.5 rounded-[10px] bg-[var(--accent)] text-[var(--accent-text-on)] text-[12px] font-semibold tracking-[0.12em] uppercase transition-all hover:brightness-95" style={{ ...mono, boxShadow: '0 0 0 1px rgba(34,232,196,0.5),0 8px 24px rgba(34,232,196,0.25)' }}>
            <Icon name="check" size={14} /> {editing ? 'SAVE CHANGES' : 'ADD MEMBER'}
          </button>
        </div>
      </form>
    </div>
  );
}
