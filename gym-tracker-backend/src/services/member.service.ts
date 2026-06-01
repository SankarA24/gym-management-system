import { Types } from 'mongoose';
import memberCrud from '../crud/member_crud';
import paymentCrud from '../crud/payment_crud';
import { IMember, MemberPlan } from '../models/Member';

function addPeriod(date: Date, plan: MemberPlan, n: number): Date {
  const d = new Date(date);
  if (plan === 'monthly') d.setUTCMonth(d.getUTCMonth() + n);
  else d.setUTCFullYear(d.getUTCFullYear() + n);
  return d;
}

export const createMember = async (
  userId: string,
  data: Omit<Partial<IMember>, 'userId'>
): Promise<IMember> => {
  // const joining = data.joining instanceof Date ? data.joining : new Date(data.joining as string);
  // const paidUntil = addPeriod(joining, data.plan as MemberPlan, 1);
  const joining = data.joining
  ? data.joining instanceof Date
    ? data.joining
    : new Date(data.joining)
  : new Date();

const paidUntil = addPeriod(joining, data.plan as MemberPlan, 1);

  const member = await memberCrud.createMember({
    ...data,
    userId: new Types.ObjectId(userId),
    paidUntil,
    paused: false,
    pausedAt: null,
  });

  // First payment is recorded at joining date
  await paymentCrud.createPayment({
    memberId: member._id,
    paidOn: joining,
    period: joining,
    amount: data.fee as number,
  });

  return member;
};

export const getMembers = async (userId: string): Promise<IMember[]> => {
  return memberCrud.getMembers({ userId: new Types.ObjectId(userId) });
};

export const getMember = async (userId: string, id: string): Promise<IMember> => {
  const member = await memberCrud.getMember(id);
  if (!member || member.userId.toString() !== userId) throw new Error('Member not found');
  return member;
};

export const updateMember = async (
  userId: string,
  id: string,
  data: Partial<IMember>
): Promise<IMember> => {
  await getMember(userId, id);
  const updated = await memberCrud.updateMember(id, data as Record<string, unknown>);
  if (!updated) throw new Error('Member not found');
  return updated;
};

export const deleteMember = async (userId: string, id: string): Promise<void> => {
  await getMember(userId, id);
  await memberCrud.deleteMember(id);
};

export const togglePause = async (userId: string, id: string): Promise<IMember> => {
  const member = await getMember(userId, id);
  const now = new Date();

  if (!member.paused) {
    // Pausing: record the timestamp so resume can extend paidUntil correctly
    const updated = await memberCrud.updateMember(id, { paused: true, pausedAt: now });
    if (!updated) throw new Error('Member not found');
    return updated;
  } else {
    // Resuming: extend paidUntil by however long the member was paused
    let paidUntil = member.paidUntil;
    if (member.pausedAt) {
      const pausedMs = now.getTime() - member.pausedAt.getTime();
      paidUntil = new Date(member.paidUntil.getTime() + pausedMs);
    }
    const updated = await memberCrud.updateMember(id, {
      paused: false,
      pausedAt: null,
      paidUntil,
    });
    if (!updated) throw new Error('Member not found');
    return updated;
  }
};
