import { Schema, model, Document, Types } from 'mongoose';

export interface IPayment extends Document {
  memberId: Types.ObjectId;
  paidOn: Date;
  period: Date;
  amount: number;
  createdAt: Date;
  updatedAt: Date;
}

const paymentSchema = new Schema<IPayment>(
  {
    memberId: { type: Schema.Types.ObjectId, ref: 'Member', required: true, index: true },
    paidOn: { type: Date, required: true },
    period: { type: Date, required: true },
    amount: { type: Number, required: true },
  },
  { timestamps: true }
);

export const Payment = model<IPayment>('Payment', paymentSchema);
