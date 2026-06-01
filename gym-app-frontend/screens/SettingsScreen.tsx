'use client';
import { useState, useMemo } from 'react';
import { useAppState, useActions } from '@/lib/store';
import { useAuth } from '@/lib/auth-context';
import { useTheme } from '@/lib/theme-context';
import { fmtMoney } from '@/lib/data';
import Icon from '@/components/Icon';

const mono = { fontFamily: "'JetBrains Mono', monospace" };
const display = { fontFamily: "'Space Grotesk', sans-serif" };

const inputCls = 'w-full bg-[var(--bg)] border border-[var(--border-strong)] rounded-[10px] px-3.5 py-3 text-sm text-[var(--text)] outline-none transition-all focus:border-[var(--accent)] focus:shadow-[0_0_0_4px_var(--accent-softer)]';

function SectionCard({ head, sub, children }: { head: string; sub?: string; children: React.ReactNode }) {
  return (
    <section className="bg-(--bg-1) border border-(--border) rounded-[20px] p-6 flex flex-col gap-0">
      <div className="flex items-center justify-between gap-3 mb-1.5">
        <div className="flex items-center gap-2.5 text-[12px] font-medium tracking-[0.14em] uppercase text-(--text-1)" style={mono}>
          <span className="w-0.75 h-3.5 bg-(--accent) rounded-sm" />{head}
        </div>
        {sub && <span className="text-[11px] text-(--text-dim) uppercase tracking-[0.14em]" style={mono}>{sub}</span>}
      </div>
      {children}
    </section>
  );
}

function Toggle({ label, hint, icon, checked, onChange }: { label: string; hint: string; icon: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button type="button" onClick={() => onChange(!checked)}
      className={`flex items-center gap-3.5 px-3.5 py-3.5 w-full text-left rounded-xl border transition-all ${checked ? 'border-[color-mix(in_srgb,var(--accent)_30%,transparent)]' : 'border-(--border) hover:border-(--border-strong)'}`}
      style={{ background: checked ? 'linear-gradient(90deg, var(--accent-softer), var(--bg-2) 60%)' : 'var(--bg-2)' }}>
      <span className={`w-9 h-9 rounded-[10px] grid place-items-center shrink-0 border ${checked ? 'bg-(--accent-soft) border-[color-mix(in_srgb,var(--accent)_30%,transparent)] text-(--accent)' : 'bg-(--bg-3) border-(--border-strong) text-(--text-dim)'}`}>
        <Icon name={icon as Parameters<typeof Icon>[0]['name']} size={16} />
      </span>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-semibold tracking-[-0.01em]" style={display}>{label}</div>
        <div className="text-[10px] tracking-widest uppercase text-(--text-mute) mt-0.5" style={mono}>{hint}</div>
      </div>
      <span className={`w-11 h-6.5 rounded-full border relative shrink-0 transition-all ${checked ? 'bg-(--accent) border-(--accent)' : 'bg-(--bg-3) border-(--border-strong)'}`}
        style={{ boxShadow: checked ? '0 0 0 1px var(--accent-soft),0 0 12px var(--accent-softer)' : undefined }}>
        <span className={`absolute top-0.5 w-5 h-5 rounded-full transition-all ${checked ? 'translate-x-4.5 bg-(--accent-text-on)' : 'translate-x-0.5 bg-(--text-dim)'}`} />
      </span>
    </button>
  );
}

export default function SettingsScreen() {
  const state = useAppState();
  const actions = useActions();
  const { theme, setTheme } = useTheme();
  const s = state.settings;
  const set = (patch: Partial<typeof s>) => actions.updateSettings(patch);

  // const [profile, setProfile] = useState({ ownerName: state.ownerName, gymName: state.gymName });
  const { user } = useAuth();
  const [profile, setProfile] = useState({
  ownerName: user?.name || '',
  gymName: user?.gymName || ''
});
  // const profileDirty = profile.ownerName !== state.ownerName || profile.gymName !== state.gymName;
  const profileDirty =
  profile.ownerName !== (user?.name || '') ||
  profile.gymName !== (user?.gymName || '');

  const storageKB = useMemo(() => {
    try { return (new Blob([JSON.stringify(state)]).size / 1024).toFixed(1); } catch { return '0'; }
  }, [state]);

  const totalPaid = state.members.reduce((sum, m) => sum + ((m.payments || []).length * (m.fee || 0)), 0);

  return (
    <div className="px-5 md:px-9.5 pt-4 md:pt-6 pb-28 md:pb-15 animate-fade">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

        {/* Profile */}
        <SectionCard head="Workspace Profile" sub="YOUR IDENTITY">
          <p className="text-(--text-dim) text-[13px] leading-relaxed mt-2 mb-4">
            How your gym shows up across IRONDESK. Your name appears in the greeting; gym name is used in exports.
          </p>
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div>
              <label className="block text-[10px] font-medium tracking-[0.16em] uppercase text-(--text-dim) mb-2" style={mono}>Owner Name</label>
              <input className={inputCls} value={profile.ownerName} onChange={e => setProfile(p => ({ ...p, ownerName: e.target.value }))} />
            </div>
            <div>
              <label className="block text-[10px] font-medium tracking-[0.16em] uppercase text-(--text-dim) mb-2" style={mono}>Gym Name</label>
              <input className={inputCls} value={profile.gymName} onChange={e => setProfile(p => ({ ...p, gymName: e.target.value }))} />
            </div>
          </div>
          <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-(--border-soft)">
            {profileDirty && <span className="text-(--warn) text-[10px] tracking-[0.14em] uppercase mr-auto" style={mono}>UNSAVED CHANGES</span>}
            <button disabled={!profileDirty} onClick={() => setProfile({ ownerName: user?.name||'', gymName: user?.gymName||'' })}
              className="flex items-center gap-2 px-3.5 py-2 rounded-lg text-(--text-dim) text-[12px] font-semibold tracking-[0.12em] uppercase hover:text-(--text) hover:bg-(--bg-1) transition-all disabled:opacity-50"
              style={mono}>DISCARD</button>
            <button disabled={!profileDirty} onClick={() => actions.updateProfile({ ownerName: profile.ownerName.trim() || user?.name ||'', gymName: profile.gymName.trim() || user?.gymName||'' })}
              className="flex items-center gap-2 px-4 py-2 rounded-[10px] bg-(--accent) text-(--accent-text-on) text-[12px] font-semibold tracking-[0.12em] uppercase hover:brightness-95 transition-all disabled:opacity-50"
              style={{ ...mono, boxShadow: '0 0 0 1px rgba(34,232,196,0.5),0 8px 24px rgba(34,232,196,0.25)' }}>
              <Icon name="check" size={14} /> SAVE PROFILE
            </button>
          </div>
        </SectionCard>

        {/* Appearance */}
        <SectionCard head="Appearance" sub="THEME">
          <p className="text-(--text-dim) text-[13px] leading-relaxed mt-2 mb-4">Pick a theme. Stored to this browser only.</p>
          <div className="grid grid-cols-2 gap-3">
            {(['dark', 'light'] as const).map(t => (
              <button key={t} onClick={() => setTheme(t)}
                className={`flex items-center gap-3.5 px-3.5 py-3.5 rounded-[14px] border text-left transition-all relative ${theme === t ? 'border-[color-mix(in_srgb,var(--accent)_50%,transparent)]' : 'border-(--border) hover:border-(--border-strong)'}`}
                style={{ background: theme === t ? 'linear-gradient(180deg, var(--accent-softer), var(--bg-2))' : 'var(--bg-2)', boxShadow: theme === t ? '0 0 0 1px color-mix(in srgb, var(--accent) 25%, transparent),0 0 18px var(--accent-softer)' : undefined }}>
                <div className="w-14 h-14 rounded-xl border flex items-center justify-center gap-1 shrink-0 overflow-hidden border-(--border-strong)"
                  style={{ background: t === 'dark' ? 'linear-gradient(135deg,#0a1011 0%,#07090a 100%)' : 'linear-gradient(135deg,#ffffff 0%,#eef2f1 100%)' }}>
                  {t === 'dark'
                    ? <><span className="w-2 h-2 rounded-full bg-[#22e8c4]" style={{ boxShadow: '0 0 8px rgba(34,232,196,0.5)' }} /><span className="w-2 h-2 rounded-full bg-[#6ba8ff]" /><span className="w-2 h-2 rounded-full bg-[#ffc857]" /></>
                    : <><span className="w-2 h-2 rounded-full bg-[#0fa68a]" /><span className="w-2 h-2 rounded-full bg-[#3a6cc2]" /><span className="w-2 h-2 rounded-full bg-[#c98a14]" /></>}
                </div>
                <div className="flex flex-col gap-0.5 flex-1">
                  <div className="text-[15px] font-semibold tracking-[-0.01em]" style={display}>{t === 'dark' ? 'Dark' : 'Light'}</div>
                  <div className="text-[10px] tracking-[0.12em] uppercase text-(--text-mute)" style={mono}>{t === 'dark' ? 'Default · low-light' : 'Daytime · daylit gyms'}</div>
                </div>
                {theme === t && (
                  <span className="w-5.5 h-5.5 rounded-full grid place-items-center bg-(--accent) text-(--accent-text-on) shrink-0" style={{ boxShadow: '0 0 12px color-mix(in srgb, var(--accent) 50%, transparent)' }}>
                    <Icon name="check" size={12} />
                  </span>
                )}
              </button>
            ))}
          </div>
        </SectionCard>

        {/* Billing Defaults */}
        <SectionCard head="Billing Defaults" sub="PREFILLED ON NEW MEMBER">
          <p className="text-(--text-dim) text-[13px] leading-relaxed mt-2 mb-4">These values prefill the &ldquo;Add Member&rdquo; form. You can always override per member.</p>
          <div className="mb-3.5">
            <label className="block text-[10px] font-medium tracking-[0.16em] uppercase text-(--text-dim) mb-2" style={mono}>Default Plan</label>
            <div className="grid grid-cols-2 gap-1.5 p-1 bg-(--bg) border border-(--border-strong) rounded-xl">
              {(['monthly', 'yearly'] as const).map(p => (
                <button key={p} type="button" onClick={() => set({ defaultPlan: p })}
                  className={`py-2.5 rounded-lg text-[11px] font-semibold tracking-[0.14em] uppercase transition-all ${s.defaultPlan === p ? 'bg-(--accent) text-(--accent-text-on)' : 'text-(--text-dim) hover:text-(--text-1) hover:bg-(--bg-1)'}`}
                  style={{ ...mono, boxShadow: s.defaultPlan === p ? '0 0 0 1px rgba(34,232,196,0.4),0 0 16px rgba(34,232,196,0.25)' : undefined }}>
                  {p.charAt(0).toUpperCase() + p.slice(1)}
                </button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-medium tracking-[0.16em] uppercase text-(--text-dim) mb-2" style={mono}>Monthly Fee (₹)</label>
              <input type="number" min="0" className={inputCls} style={mono} value={s.defaultMonthlyFee} onChange={e => set({ defaultMonthlyFee: Number(e.target.value) || 0 })} />
            </div>
            <div>
              <label className="block text-[10px] font-medium tracking-[0.16em] uppercase text-(--text-dim) mb-2" style={mono}>Yearly Fee (₹)</label>
              <input type="number" min="0" className={inputCls} style={mono} value={s.defaultYearlyFee} onChange={e => set({ defaultYearlyFee: Number(e.target.value) || 0 })} />
            </div>
          </div>
        </SectionCard>

        {/* Reminders */}
        <SectionCard head="Reminders" sub="HOW & WHEN">
          <p className="text-(--text-dim) text-[13px] leading-relaxed mt-2 mb-4">Choose how far ahead a renewal shows and which channels you use to nudge members.</p>
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div>
              <label className="block text-[10px] font-medium tracking-[0.16em] uppercase text-(--text-dim) mb-2" style={mono}>Renewal Window</label>
              <select className={`${inputCls} cursor-pointer`} style={mono} value={s.reminderWindowDays} onChange={e => set({ reminderWindowDays: Number(e.target.value) })}>
                {[3, 5, 7, 14, 30].map(d => <option key={d} value={d}>{d} DAYS BEFORE</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-medium tracking-[0.16em] uppercase text-(--text-dim) mb-2" style={mono}>Daily Reminder Time</label>
              <input type="time" className={inputCls} style={mono} value={s.reminderTime} onChange={e => set({ reminderTime: e.target.value })} />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Toggle label="WhatsApp" hint="Send renewal nudges via WhatsApp." icon="msg" checked={s.notifyWhatsapp} onChange={v => set({ notifyWhatsapp: v })} />
            <Toggle label="SMS" hint="Text message fallback." icon="phone" checked={s.notifySms} onChange={v => set({ notifySms: v })} />
            <Toggle label="Email" hint="Include an email copy." icon="bell" checked={s.notifyEmail} onChange={v => set({ notifyEmail: v })} />
          </div>
        </SectionCard>

        {/* Data */}
        <SectionCard head="Data & Storage" sub={`${storageKB} KB · ${state.members.length} MEMBERS`}>
          <p className="text-(--text-dim) text-[13px] leading-relaxed mt-2 mb-4">IRONDESK keeps your data in this browser. Export a copy before resetting or clearing.</p>
          <div className="flex flex-wrap gap-2.5 mb-4">
            <button onClick={() => actions.exportJSON(state)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-[10px] border border-(--border-strong) bg-(--bg-1) text-(--text-1) text-[12px] font-semibold tracking-[0.12em] uppercase hover:border-[color-mix(in_srgb,var(--accent)_50%,transparent)] hover:text-(--accent) transition-all"
              style={mono}>
              <Icon name="wallet" size={14} /> EXPORT JSON
            </button>
            <button onClick={actions.reload}
              className="flex items-center gap-2 px-4 py-2.5 rounded-[10px] border border-(--border-strong) bg-(--bg-1) text-(--text-1) text-[12px] font-semibold tracking-[0.12em] uppercase hover:border-[color-mix(in_srgb,var(--accent)_50%,transparent)] hover:text-(--accent) transition-all"
              style={mono}>
              <Icon name="sparkles" size={14} /> RELOAD FROM SERVER
            </button>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3.5 p-4 rounded-[14px] border border-dashed"
            style={{ background: 'var(--danger-soft)', borderColor: 'color-mix(in srgb, var(--danger) 40%, transparent)' }}>
            <div className="flex items-center gap-3">
              <span className="w-9 h-9 rounded-[10px] grid place-items-center border text-(--danger)"
                style={{ background: 'color-mix(in srgb, var(--danger) 14%, transparent)', borderColor: 'color-mix(in srgb, var(--danger) 30%, transparent)' }}>
                <Icon name="bolt" size={16} />
              </span>
              <div>
                <div className="text-sm font-bold text-(--danger)" style={display}>Danger Zone</div>
                <div className="text-[10px] tracking-[0.12em] uppercase text-(--text-dim) mt-0.5" style={mono}>Irreversible. Export first if you want a backup.</div>
              </div>
            </div>
            <button onClick={actions.clearAll}
              className="flex items-center gap-2 px-4 py-2.5 rounded-[10px] border text-(--danger) text-[12px] font-semibold tracking-[0.12em] uppercase hover:border-(--danger) transition-all"
              style={{ ...mono, borderColor: 'var(--danger-deep)', background: 'var(--danger-soft)' }}>
              <Icon name="trash" size={14} /> DELETE ALL MEMBERS
            </button>
          </div>
        </SectionCard>

        {/* About */}
        <SectionCard head="About" sub="v1.0.0 · BUILD 2026.05">
          <div className="grid grid-cols-3 gap-2.5 mt-4 mb-4">
            {[
              { k: 'Total Members', v: state.members.length },
              { k: 'Lifetime Collected', v: fmtMoney(totalPaid) },
              { k: 'Workspace', v: state.gymName },
            ].map(({ k, v }) => (
              <div key={k} className="p-3.5 bg-(--bg-2) border border-(--border) rounded-xl">
                <div className="text-[10px] tracking-[0.14em] uppercase text-(--text-mute) mb-1.5" style={mono}>{k}</div>
                <div className="text-xl font-semibold tracking-[-0.015em]" style={display}>{v}</div>
              </div>
            ))}
          </div>
          <p className="text-(--text-dim) text-[13px] leading-relaxed">
            IRONDESK is a single-user, browser-only gym member ops tool. No accounts, no servers — your data lives only on this device.
          </p>
        </SectionCard>

      </div>
    </div>
  );
}