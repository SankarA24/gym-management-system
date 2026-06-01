'use client';
import { createContext, useContext, useState, useEffect, useMemo, useRef, useCallback } from 'react';
import type { AppState, Member, MemberFormPayload, Settings } from './types';
import { addPeriod, todayISO, DEFAULT_SETTINGS, saveState, loadState } from './data';
import { api, ApiMember, ApiPayment } from './api';

function mapApiMember(m: ApiMember): Member {
  return {
    id: m._id,
    name: m.name,
    phone: m.phone,
    photo: m.photo,
    joining: m.joining.slice(0, 10),
    plan: m.plan,
    fee: m.fee,
    paidUntil: m.paidUntil.slice(0, 10),
    paused: m.paused,
    notes: m.notes,
    notifyVia: m.notifyVia,
    payments: [],
    createdAt: m.createdAt.slice(0, 10),
  };
}

export function mapApiPayment(p: ApiPayment) {
  return {
    _id: p._id,
    paidOn: p.paidOn.slice(0, 10),
    period: p.period.slice(0, 10),
    amount: p.amount,
  };
}

export interface AppActions {
  reload: () => Promise<void>;
  addMember: (payload: MemberFormPayload) => Promise<string>;
  updateMember: (id: string, patch: Partial<Member>) => Promise<void>;
  deleteMember: (id: string) => Promise<void>;
  markPaid: (id: string) => Promise<void>;
  togglePause: (id: string) => Promise<void>;
  clearAll: () => void;
  updateSettings: (patch: Partial<Settings>) => void;
  updateProfile: (patch: Partial<Pick<AppState, 'ownerName' | 'gymName'>>) => void;
  exportJSON: (state: AppState) => void;
}

const StateCtx = createContext<AppState | null>(null);
const ActionsCtx = createContext<AppActions | null>(null);

function defaultState(): AppState {
  const saved = loadState();
  return {
    ownerName: saved?.ownerName ?? '',
    gymName: saved?.gymName ?? '',
    members: [],
    settings: { ...DEFAULT_SETTINGS, ...(saved?.settings ?? {}) },
  };
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState>(defaultState);
  const stateRef = useRef<AppState>(state);
  stateRef.current = state;

  // Persist only settings/profile (not members — those live in the backend)
  useEffect(() => {
    saveState({ ...state, members: [] });
  }, [state.ownerName, state.gymName, state.settings]); // eslint-disable-line react-hooks/exhaustive-deps

  const reload = useCallback(async () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('irondesk:token') : null;
    if (!token) return;
    try {
      const [apiMembers, apiPayments] = await Promise.all([
        api.members.list(),
        api.payments.listAll(),
      ]);
      const byMember = new Map<string, ReturnType<typeof mapApiPayment>[]>();
      for (const p of apiPayments) {
        const arr = byMember.get(p.memberId) ?? [];
        arr.push(mapApiPayment(p));
        byMember.set(p.memberId, arr);
      }
      setState(s => ({
        ...s,
        members: apiMembers.map(m => ({ ...mapApiMember(m), payments: byMember.get(m._id) ?? [] })),
      }));
    } catch {
      // 401 or network error — leave members as-is
    }
  }, []);

  const actions = useMemo<AppActions>(() => ({
    reload,

    async addMember(payload) {
      // Backend computes paidUntil and creates first payment
      const apiMember = await api.members.create({
        name: payload.name,
        phone: payload.phone,
        plan: payload.plan,
        fee: payload.fee,
        joining: payload.joining,
        photo: payload.photo,
        notes: '',
        notifyVia: 'whatsapp',
      });
      const member = mapApiMember(apiMember);
      setState(s => ({ ...s, members: [member, ...s.members] }));
      // Reload in background to pick up the first payment the backend created
      reload().catch(() => {});
      return apiMember._id;
    },

    async updateMember(id, patch) {
      const current = stateRef.current.members.find(m => m.id === id);
      if (!current) return;

      // Recalculate paidUntil when plan or joining changes (for new members only)
      let paidUntil = current.paidUntil;
      const newPlan = patch.plan ?? current.plan;
      const newJoining = patch.joining ?? current.joining;
      if (
        (patch.plan && patch.plan !== current.plan && current.payments.length <= 1) ||
        (patch.joining && patch.joining !== current.joining && current.payments.length <= 1)
      ) {
        paidUntil = addPeriod(newJoining, newPlan, 1);
      }

      // Optimistic update
      setState(s => ({
        ...s,
        members: s.members.map(m =>
          m.id !== id ? m : { ...m, ...patch, paidUntil }
        ),
      }));

      await api.members.update(id, {
        name: patch.name ?? current.name,
        phone: patch.phone ?? current.phone,
        plan: newPlan,
        fee: patch.fee ?? current.fee,
        joining: newJoining,
        paidUntil,
        photo: patch.photo !== undefined ? patch.photo : current.photo,
        notes: patch.notes ?? current.notes,
        notifyVia: patch.notifyVia ?? current.notifyVia ?? 'whatsapp',
      });
    },

    async deleteMember(id) {
      // Optimistic remove
      setState(s => ({ ...s, members: s.members.filter(m => m.id !== id) }));
      await api.members.remove(id);
    },

    async markPaid(id) {
      const member = stateRef.current.members.find(m => m.id === id);
      if (!member) return;
      const today = todayISO();
      // Optimistic update using local addPeriod — reconciled below with server value
      const optimisticPaidUntil = addPeriod(member.paidUntil, member.plan, 1);
      const newPayment = { paidOn: today, period: member.paidUntil, amount: member.fee };

      setState(s => ({
        ...s,
        members: s.members.map(m =>
          m.id !== id ? m : {
            ...m,
            paidUntil: optimisticPaidUntil,
            paused: false,
            payments: [...(m.payments ?? []), newPayment],
          }
        ),
      }));

      try {
        const { newPaidUntil } = await api.payments.create({ memberId: id, paidOn: today });
        // Reconcile with the authoritative paidUntil from the backend
        setState(s => ({
          ...s,
          members: s.members.map(m =>
            m.id !== id ? m : { ...m, paidUntil: newPaidUntil.slice(0, 10) }
          ),
        }));
      } catch (err) {
        console.error('markPaid failed, reloading:', err);
        await reload();
      }
    },

    async togglePause(id) {
      const member = stateRef.current.members.find(m => m.id === id);
      if (!member) return;

      // Optimistic flip
      setState(s => ({
        ...s,
        members: s.members.map(m => m.id !== id ? m : { ...m, paused: !m.paused }),
      }));

      try {
        const updated = await api.members.togglePause(id);
        // Sync paidUntil — on resume the backend extends it by the paused duration
        setState(s => ({
          ...s,
          members: s.members.map(m =>
            m.id !== id ? m : {
              ...m,
              paused: updated.paused,
              paidUntil: updated.paidUntil.slice(0, 10),
            }
          ),
        }));
      } catch {
        // Revert optimistic flip on failure
        setState(s => ({
          ...s,
          members: s.members.map(m => m.id !== id ? m : { ...m, paused: member.paused }),
        }));
      }
    },

    clearAll() {
      if (!confirm('Clear local view? This does not delete members from the server.')) return;
      setState(s => ({ ...s, members: [] }));
    },

    updateSettings(patch) {
      setState(s => ({ ...s, settings: { ...s.settings, ...patch } }));
    },

    updateProfile(patch) {
      setState(s => ({ ...s, ...patch }));
    },

    exportJSON(state) {
      const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = `irondesk-export-${todayISO()}.json`;
      document.body.appendChild(a); a.click();
      a.remove(); URL.revokeObjectURL(url);
    },
  }), [reload]);

  return (
    <StateCtx.Provider value={state}>
      <ActionsCtx.Provider value={actions}>
        {children}
      </ActionsCtx.Provider>
    </StateCtx.Provider>
  );
}

export function useAppState(): AppState {
  const ctx = useContext(StateCtx);
  if (!ctx) throw new Error('useAppState must be used within StoreProvider');
  return ctx;
}
export function useActions(): AppActions {
  const ctx = useContext(ActionsCtx);
  if (!ctx) throw new Error('useActions must be used within StoreProvider');
  return ctx;
}
