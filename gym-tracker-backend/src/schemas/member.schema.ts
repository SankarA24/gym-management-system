import { z } from 'zod';

export const CreateMemberSchema = z.object({
  name: z.string().min(1),
  phone: z.string().min(7),
  photo: z.string().nullable().optional(),
  joining: z.coerce.date(),
  plan: z.enum(['monthly', 'yearly']),
  fee: z.number().positive(),
  notes: z.string().default(''),
  notifyVia: z.enum(['whatsapp', 'sms', 'email']).default('whatsapp'),
});

// Update allows adjusting any field including paidUntil (manual correction by admin)
export const UpdateMemberSchema = z.object({
  name: z.string().min(1).optional(),
  phone: z.string().min(7).optional(),
  photo: z.string().nullable().optional(),
  joining: z.coerce.date().optional(),
  plan: z.enum(['monthly', 'yearly']).optional(),
  fee: z.number().positive().optional(),
  paidUntil: z.coerce.date().optional(),
  paused: z.boolean().optional(),
  notes: z.string().optional(),
  notifyVia: z.enum(['whatsapp', 'sms', 'email']).optional(),
});

export const MemberParamsSchema = z.object({ id: z.string() });

export type CreateMemberBody = z.infer<typeof CreateMemberSchema>;
export type UpdateMemberBody = z.infer<typeof UpdateMemberSchema>;
export type MemberParams = z.infer<typeof MemberParamsSchema>;
