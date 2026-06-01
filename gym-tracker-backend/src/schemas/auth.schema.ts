import { z } from 'zod';

export const RegisterSchema = z.object({
  name: z.string().min(1),
  email: z.email(),
  phone: z.string().min(7),
  password: z.string().min(6),
  gymName: z.string().min(1),
});

export const LoginSchema = z.object({
  email: z.email(),
  password: z.string().min(1),
});

export type RegisterBody = z.infer<typeof RegisterSchema>;
export type LoginBody = z.infer<typeof LoginSchema>;
