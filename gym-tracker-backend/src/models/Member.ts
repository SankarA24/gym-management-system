import { Schema, model, Document, Types } from 'mongoose';

export type NotifyVia = 'whatsapp' | 'sms' | 'email';
export type MemberPlan = 'monthly' | 'yearly';

export interface IMember extends Document {
  userId: Types.ObjectId;
  name: string;
  phone: string;
  photo: string | null;
  joining: Date;
  plan: MemberPlan;
  fee: number;
  paidUntil: Date;
  paused: boolean;
  pausedAt: Date | null;
  notes: string;
  notifyVia: NotifyVia;
  createdAt: Date;
  updatedAt: Date;
}

const memberSchema = new Schema<IMember>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    photo: { type: String, default: null },
    joining: { type: Date, required: true },
    plan: { type: String, enum: ['monthly', 'yearly'], required: true },
    fee: { type: Number, required: true },
    paidUntil: { type: Date, required: true },
    paused: { type: Boolean, default: false },
    pausedAt: { type: Date, default: null },
    notes: { type: String, default: '' },
    notifyVia: { type: String, enum: ['whatsapp', 'sms', 'email'], default: 'whatsapp' },
  },
  { timestamps: true }
);

export const Member = model<IMember>('Member', memberSchema);
