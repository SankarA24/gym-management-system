import { z } from 'zod';

export const CreatePaymentSchema = z.object({
  memberId: z.string(),
  paidOn: z.coerce.date().optional(),
});

export const PaymentParamsSchema = z.object({ id: z.string() });

export const MemberIdQuerySchema = z.object({ memberId: z.string().optional() });

export type CreatePaymentBody = z.infer<typeof CreatePaymentSchema>;
export type PaymentParams = z.infer<typeof PaymentParamsSchema>;
export type MemberIdQuery = z.infer<typeof MemberIdQuerySchema>;
