import { FastifyInstance } from 'fastify';
import authRoutes from './auth';
import memberRoutes from './members';
import paymentRoutes from './payments';

export default async function routes(fastify: FastifyInstance): Promise<void> {
  fastify.register(authRoutes, { prefix: '/auth' });
  fastify.register(memberRoutes, { prefix: '/members' });
  fastify.register(paymentRoutes, { prefix: '/payments' });
}
