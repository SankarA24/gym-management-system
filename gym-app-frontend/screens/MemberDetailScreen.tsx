'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { memberStatus, daysUntil, daysBetween, todayISO, fmtDate, fmtRelative, fmtMoney, addPeriod } from '@/lib/data';
import type { Payment } from '@/lib/types';
import { useAppState, useActions, mapApiPayment } from '@/lib/store';
import { useModal } from '@/lib/modal-context';
import { api } from '@/lib/api';
import Avatar from '@/components/Avatar';
import { StatusPill, PlanPill } from '@/components/StatusPill';
import Empty from '@/components/Empty';
import Icon from '@/components/Icon';

const mono = { fontFamily: "'JetBrains Mono', monospace" };
const display = { fontFamily: "'Space Grotesk', sans-serif" };

function KV({ k, v, color }: { k: string; v: React.ReactNode; color?: string }) {
  return (
    <div className="p-3.5 bg-(--bg-2) border border-(--border) rounded-xl">
      <div className="text-[10px] tracking-[0.14em] uppercase text-(--text-mute) mb-1.5" style={mono}>{k}</div>
      <div className="text-xl font-semibold tracking-[-0.015em]" style={{ ...display, color: color || 'var(--text)' }}>{v}</div>
    </div>
  );
}

export default function MemberDetailScreen({ memberId }: { memberId: string }) {
  const router = useRouter();
  const { members } = useAppState();
  const actions = useActions();
  const { openEdit } = useModal();
  const member = members.find(m => m.id === memberId);

  // Payments loaded from API (member.payments is empty after API load)
  const [payments, setPayments] = useState<Payment[]>([]);
  const [paymentsLoading, setPaymentsLoading] = useState(false);
  const [paymentConfirm, setPaymentConfirm] = useState<{ isDuplicate: boolean; newPaidUntil: string } | null>(null);
  const [deletingPaymentId, setDeletingPaymentId] = useState<string | null>(null);

  useEffect(() => {
    if (!memberId) return;
    setPaymentsLoading(true);
    api.payments.list(memberId)
      .then(data => setPayments(data.map(mapApiPayment)))
      .catch(() => setPayments(member?.payments ?? []))
      .finally(() => setPaymentsLoading(false));
  }, [memberId]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!member) {
    return (
      <div className="px-5 md:px-9.5 pt-4 md:pt-6 pb-28 md:pb-15 animate-fade">
        <Empty title="Member not found" body="This member may have been deleted."
          action={<button onClick={() => router.push('/members')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-[10px] border border-(--border-strong) text-(--text-1) text-[12px] font-semibold tracking-[0.12em] uppercase hover:border-[color-mix(in_srgb,var(--accent)_50%,transparent)] hover:text-(--accent) transition-all" style={mono}>
            BACK TO MEMBERS</button>}
        />
      </div>
    );
  }

  const status = memberStatus(member);
  const daysAsMember = Math.max(0, daysBetween(member.joining, todayISO()));
  const totalPaid = payments.reduce((sum, p) => sum + (p.amount ?? member.fee ?? 0), 0);
  const dueColor = status === 'overdue' ? 'var(--danger)' : status === 'due-soon' ? 'var(--warn)' : 'var(--text)';

  const refreshPayments = () =>
    api.payments.list(memberId).then(data => setPayments(data.map(mapApiPayment)));

  const handleMarkPaid = () => {
    const today = todayISO();
    const alreadyActive = member.paidUntil > today;
    const paidThisPeriod = member.plan === 'monthly'
      ? payments.some(p => (p.paidOn ?? '').slice(0, 7) === today.slice(0, 7))
      : payments.some(p => (p.paidOn ?? '').slice(0, 4) === today.slice(0, 4));
    setPaymentConfirm({
      isDuplicate: alreadyActive || paidThisPeriod,
      newPaidUntil: addPeriod(member.paidUntil, member.plan, 1),
    });
  };

  const handleConfirmPayment = () => {
    const today = todayISO();
    // Optimistically add to local payments so a second click immediately detects the duplicate
    setPayments(prev => [...prev, { paidOn: today, period: member.paidUntil, amount: member.fee }]);
    setPaymentConfirm(null);
    actions.markPaid(member.id).then(refreshPayments);
  };

  const handleDeletePayment = async (paymentId: string) => {
    await api.payments.remove(paymentId);
    setDeletingPaymentId(null);
    await refreshPayments();
    await actions.reload();
  };

  const handleDelete = async () => {
    if (confirm(`Delete ${member.name}? This cannot be undone.`)) {
      await actions.deleteMember(member.id);
      router.push('/members');
    }
  };

  const btnBase = 'flex items-center gap-2 px-4 py-2.5 rounded-[10px] text-[12px] font-semibold tracking-[0.12em] uppercase transition-all';

  return (
    <div className="flex flex-col gap-6 px-5 md:px-9.5 pt-4 md:pt-6 pb-28 md:pb-15 animate-fade">
      {/* Header card */}
      <div className="flex flex-col md:flex-row items-start md:items-center gap-5 p-6 bg-(--bg-1) border border-(--border) rounded-[20px]">
        <Avatar name={member.name} photo={member.photo} size="xl" ring={status === 'active'} />
        <div className="flex-1">
          <div className="text-[32px] font-bold tracking-tight" style={display}>{member.name}</div>
          <div className="flex flex-wrap items-center gap-2.5 mt-2">
            <StatusPill status={status} />
            <PlanPill plan={member.plan} />
            <span className="flex items-center gap-1.5 text-[11px] text-(--text-dim) tracking-widest uppercase" style={mono}>
              <Icon name="phone" size={12} /> {member.phone}
            </span>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          <button onClick={handleMarkPaid}
            className={`${btnBase} bg-(--accent) text-(--accent-text-on)`}
            style={{ ...mono, boxShadow: '0 0 0 1px rgba(34,232,196,0.5),0 8px 24px rgba(34,232,196,0.25)' }}>
            <Icon name="check" size={14} /> MARK PAID
          </button>
          <button onClick={() => actions.togglePause(member.id)}
            className={`${btnBase} border border-(--border-strong) bg-(--bg-1) text-(--text-1) hover:border-[color-mix(in_srgb,var(--accent)_50%,transparent)] hover:text-(--accent)`}
            style={mono}>
            <Icon name={member.paused ? 'play' : 'pause'} size={14} />
            {member.paused ? ' RESUME' : ' PAUSE'}
          </button>
          <button onClick={() => openEdit(member)}
            className={`${btnBase} border border-(--border-strong) bg-(--bg-1) text-(--text-1) hover:border-[color-mix(in_srgb,var(--accent)_50%,transparent)] hover:text-(--accent)`}
            style={mono}>
            <Icon name="pencil" size={14} />
          </button>
          <button onClick={handleDelete}
            className={`${btnBase} border border-(--danger-deep) bg-(--danger-soft) text-(--danger) hover:border-(--danger)`}
            style={mono}>
            <Icon name="trash" size={14} />
          </button>
        </div>
      </div>

      {/* Detail grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Billing */}
        <div>
          <div className="flex items-center gap-2.5 text-[12px] font-medium tracking-[0.14em] uppercase text-(--text-1) mb-3.5" style={mono}>
            <span className="w-0.75 h-3.5 bg-(--accent) rounded-sm" /> Billing
          </div>
          <div className="grid grid-cols-2 gap-3">
            <KV k="Next Due" v={
              <>{fmtDate(member.paidUntil, 'mono')}<small className="block text-[11px] font-normal text-(--text-dim) mt-0.5" style={mono}>{member.paused ? 'Paused' : fmtRelative(member.paidUntil)}</small></>
            } color={dueColor} />
            <KV k={`Fee · ${member.plan === 'yearly' ? 'Yearly' : 'Monthly'}`} v={fmtMoney(member.fee)} />
            <KV k="Joined" v={fmtDate(member.joining, 'short')} />
            <KV k="Member For" v={<>{daysAsMember}<small className="text-[11px] font-normal text-(--text-dim) ml-1.5">days</small></>} />
            <KV k="Total Paid" v={fmtMoney(totalPaid)} />
            <KV k="Cycles" v={<>{payments.length}<small className="text-[11px] font-normal text-(--text-dim) ml-1.5">completed</small></>} />
          </div>
        </div>

        {/* Payment history */}
        <div>
          <div className="flex items-center gap-2.5 text-[12px] font-medium tracking-[0.14em] uppercase text-(--text-1) mb-3.5" style={mono}>
            <span className="w-0.75 h-3.5 bg-(--accent) rounded-sm" /> Payment History
          </div>
          <div className="bg-(--bg-1) border border-(--border) rounded-[20px] p-4 max-h-90 overflow-y-auto">
            {paymentsLoading ? (
              <div className="py-5 text-center text-(--text-dim) text-sm">Loading…</div>
            ) : payments.length === 0 ? (
              <div className="py-5 text-center text-(--text-dim) text-sm">No payments recorded yet.</div>
            ) : (
              <div className="flex flex-col gap-2">
                {[...payments].reverse().map((p, i) => {
                  const pid = p._id ?? String(i);
                  const confirming = deletingPaymentId === pid;
                  return (
                    <div key={pid} className="flex items-center gap-3 px-3.5 py-3 bg-(--bg-2) border border-(--border) rounded-[10px]">
                      <span className="w-2 h-2 rounded-full bg-(--accent) shrink-0" style={{ boxShadow: '0 0 6px color-mix(in srgb, var(--accent) 60%, transparent)' }} />
                      <span className="flex-1 text-[12px] tracking-[0.08em]" style={mono}>{fmtDate(p.paidOn, 'mono')}</span>
                      <span className="hidden sm:inline text-[11px] text-(--text-dim) tracking-widest uppercase shrink-0" style={mono}>{member.plan === 'yearly' ? '1 YEAR' : '1 MONTH'}</span>
                      <span className="shrink-0 text-[9px] px-2.5 py-1.5 rounded-full bg-(--accent-soft) text-(--accent) border border-[color-mix(in_srgb,var(--accent)_25%,transparent)] font-semibold tracking-[0.14em] uppercase" style={mono}>{fmtMoney(p.amount ?? member.fee)}</span>
                      {confirming ? (
                        <div className="flex items-center gap-1.5 ml-1 shrink-0">
                          <button onClick={() => setDeletingPaymentId(null)}
                            className="text-[10px] px-2 py-1 rounded-md border border-(--border-strong) text-(--text-dim) tracking-widest uppercase hover:text-(--text-1) transition-colors" style={mono}>
                            No
                          </button>
                          <button onClick={() => p._id && handleDeletePayment(p._id)}
                            className="text-[10px] px-2 py-1 rounded-md border border-(--danger-deep) bg-(--danger-soft) text-(--danger) tracking-widest uppercase hover:border-(--danger) transition-colors" style={mono}>
                            Delete
                          </button>
                        </div>
                      ) : (
                        <button onClick={() => setDeletingPaymentId(pid)}
                          className="shrink-0 ml-1 p-1.5 rounded-md text-(--text-mute) hover:text-(--danger) hover:bg-(--danger-soft) transition-colors"
                          title="Delete payment">
                          <Icon name="trash" size={12} />
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Payment confirmation dialog */}
      {paymentConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-(--bg-1) border border-(--border) rounded-[20px] p-6 w-full max-w-sm mx-4" style={{ boxShadow: '0 24px 64px rgba(0,0,0,0.5)' }}>
            <div className="flex items-center gap-3 mb-4">
              {paymentConfirm.isDuplicate ? (
                <span className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0"
                  style={{ background: 'color-mix(in srgb, var(--warn) 15%, transparent)', border: '1px solid color-mix(in srgb, var(--warn) 40%, transparent)', color: 'var(--warn)' }}>!</span>
              ) : (
                <span className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                  style={{ background: 'color-mix(in srgb, var(--accent) 15%, transparent)', border: '1px solid color-mix(in srgb, var(--accent) 40%, transparent)', color: 'var(--accent)' }}>
                  <Icon name="check" size={14} />
                </span>
              )}
              <div className="text-[15px] font-semibold" style={display}>
                {paymentConfirm.isDuplicate ? 'Already Paid?' : 'Confirm Payment'}
              </div>
            </div>

            {paymentConfirm.isDuplicate ? (
              <>
                <p className="text-sm text-(--text-1) mb-2">
                  <strong>{member.name}</strong> is already paid until{' '}
                  <span className="font-semibold" style={{ ...mono, color: 'var(--accent)' }}>{fmtDate(member.paidUntil)}</span>.
                </p>
                <p className="text-[13px] text-(--text-dim) mb-5">
                  This looks like a duplicate. Only confirm if this is an advance or extra payment — it will extend their subscription to{' '}
                  <span style={mono}>{fmtDate(paymentConfirm.newPaidUntil)}</span>.
                </p>
              </>
            ) : (
              <>
                <p className="text-sm text-(--text-1) mb-2">
                  Record payment for <strong>{member.name}</strong>?
                </p>
                <div className="flex items-center gap-3 px-3.5 py-3 bg-(--bg-2) border border-(--border) rounded-[10px] mb-5">
                  <span className="w-2 h-2 rounded-full bg-(--accent) shrink-0" />
                  <span className="flex-1 text-[12px] tracking-[0.08em] text-(--text-dim)" style={mono}>
                    {member.plan === 'yearly' ? '1 YEAR' : '1 MONTH'} · until {fmtDate(paymentConfirm.newPaidUntil, 'short')}
                  </span>
                  <span className="text-[11px] px-2.5 py-1.5 rounded-full bg-(--accent-soft) text-(--accent) border border-[color-mix(in_srgb,var(--accent)_25%,transparent)] font-semibold tracking-[0.14em] uppercase" style={mono}>
                    {fmtMoney(member.fee)}
                  </span>
                </div>
              </>
            )}

            <div className="flex gap-3">
              <button onClick={() => setPaymentConfirm(null)}
                className={`flex-1 ${btnBase} border border-(--border-strong) bg-(--bg-1) text-(--text-1) justify-center hover:border-[color-mix(in_srgb,var(--accent)_50%,transparent)]`}
                style={mono}>
                Cancel
              </button>
              <button onClick={handleConfirmPayment}
                className={`flex-1 ${btnBase} bg-(--accent) text-(--accent-text-on) justify-center`}
                style={{ ...mono, boxShadow: '0 0 0 1px rgba(34,232,196,0.4),0 4px 16px rgba(34,232,196,0.2)' }}>
                <Icon name="check" size={14} />{paymentConfirm.isDuplicate ? ' Yes, Mark Paid' : ' Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
