import { Types } from 'mongoose';
import paymentCrud from '../crud/payment_crud';
import memberCrud from '../crud/member_crud';
import { IPayment } from '../models/Payment';
import { MemberPlan } from '../models/Member';

function addPeriod(date: Date, plan: MemberPlan, n: number): Date {
  const d = new Date(date);
  if (plan === 'monthly') d.setUTCMonth(d.getUTCMonth() + n);
  else d.setUTCFullYear(d.getUTCFullYear() + n);
  return d;
}

const verifyMemberOwnership = async (userId: string, memberId: string) => {
  const member = await memberCrud.getMember(memberId);
  if (!member || member.userId.toString() !== userId) throw new Error('Member not found');
  return member;
};

export const createPayment = async (
  userId: string,
  data: { memberId: string; paidOn?: Date }
): Promise<{ payment: IPayment; newPaidUntil: Date }> => {
  const member = await verifyMemberOwnership(userId, data.memberId);
  const paidOn = data.paidOn ?? new Date();
  // period and amount derived from member — no client input needed
  const payment = await paymentCrud.createPayment({
    memberId: new Types.ObjectId(data.memberId),
    paidOn,
    period: member.paidUntil,
    amount: member.fee,
  });
  const newPaidUntil = addPeriod(member.paidUntil, member.plan, 1);
  await memberCrud.updateMember(member._id.toString(), { paidUntil: newPaidUntil, paused: false });
  return { payment, newPaidUntil };
};

export const getPayments = async (userId: string, memberId: string): Promise<IPayment[]> => {
  await verifyMemberOwnership(userId, memberId);
  return paymentCrud.getPayments({ memberId: new Types.ObjectId(memberId) });
};

export const getAllPayments = async (userId: string): Promise<IPayment[]> => {
  const members = await memberCrud.getMembers({ userId: new Types.ObjectId(userId) });
  const memberIds = members.map(m => m._id);
  return paymentCrud.getPayments({ memberId: { $in: memberIds } });
};

export const getPayment = async (userId: string, id: string): Promise<IPayment> => {
  const payment = await paymentCrud.getPayment(id);
  if (!payment) throw new Error('Payment not found');
  await verifyMemberOwnership(userId, payment.memberId.toString());
  return payment;
};

export const deletePayment = async (userId: string, id: string): Promise<void> => {
  const payment = await paymentCrud.getPayment(id);
  if (!payment) throw new Error('Payment not found');
  const member = await verifyMemberOwnership(userId, payment.memberId.toString());
  await paymentCrud.deletePayment(id);
  const rolledBack = addPeriod(member.paidUntil, member.plan, -1);
  await memberCrud.updateMember(member._id.toString(), { paidUntil: rolledBack });
};
