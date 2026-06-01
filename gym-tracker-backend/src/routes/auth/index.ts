import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { RegisterSchema, LoginSchema } from '../../schemas/auth.schema';
import { register, login } from '../../controllers/auth.controller';

export default async function authRoutes(fastify: FastifyInstance): Promise<void> {
  const f = fastify.withTypeProvider<ZodTypeProvider>();

  f.post('/register', {
    schema: {
      tags: ['Auth'],
      description: 'Register a new user',
      security: [],
      body: RegisterSchema,
    },
    handler: register,
  });

  f.post('/login', {
    schema: {
      tags: ['Auth'],
      description: 'Login and receive a JWT token',
      security: [],
      body: LoginSchema,
    },
    handler: login,
  });
}
