import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { authenticate } from '../../middleware/authenticate';
import { CreatePaymentSchema, PaymentParamsSchema, MemberIdQuerySchema } from '../../schemas/payment.schema';
import { create, list, get, remove } from '../../controllers/payment.controller';

export default async function paymentRoutes(fastify: FastifyInstance): Promise<void> {
  const f = fastify.withTypeProvider<ZodTypeProvider>();

  f.post('/', {
    preHandler: authenticate,
    schema: {
      tags: ['Payments'],
      description: 'Record a payment for a member',
      body: CreatePaymentSchema,
    },
    handler: create,
  });

  f.get('/', {
    preHandler: authenticate,
    schema: {
      tags: ['Payments'],
      description: 'List payments for a member',
      querystring: MemberIdQuerySchema,
    },
    handler: list,
  });

  f.get('/:id', {
    preHandler: authenticate,
    schema: {
      tags: ['Payments'],
      description: 'Get a payment by ID',
      params: PaymentParamsSchema,
    },
    handler: get,
  });

  f.delete('/:id', {
    preHandler: authenticate,
    schema: {
      tags: ['Payments'],
      description: 'Delete a payment',
      params: PaymentParamsSchema,
    },
    handler: remove,
  });
}
