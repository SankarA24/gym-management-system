import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { authenticate } from '../../middleware/authenticate';
import { CreateMemberSchema, UpdateMemberSchema, MemberParamsSchema } from '../../schemas/member.schema';
import { create, list, get, update, remove, togglePause } from '../../controllers/member.controller';

export default async function memberRoutes(fastify: FastifyInstance): Promise<void> {
  const f = fastify.withTypeProvider<ZodTypeProvider>();

  f.post('/', {
    preHandler: authenticate,
    schema: {
      tags: ['Members'],
      description: 'Create a new member',
      body: CreateMemberSchema,
    },
    handler: create,
  });

  f.get('/', {
    preHandler: authenticate,
    schema: {
      tags: ['Members'],
      description: 'List all members for the logged-in user',
    },
    handler: list,
  });

  f.get('/:id', {
    preHandler: authenticate,
    schema: {
      tags: ['Members'],
      description: 'Get a member by ID',
      params: MemberParamsSchema,
    },
    handler: get,
  });

  f.put('/:id', {
    preHandler: authenticate,
    schema: {
      tags: ['Members'],
      description: 'Update a member',
      params: MemberParamsSchema,
      body: UpdateMemberSchema,
    },
    handler: update,
  });

  f.delete('/:id', {
    preHandler: authenticate,
    schema: {
      tags: ['Members'],
      description: 'Delete a member',
      params: MemberParamsSchema,
    },
    handler: remove,
  });

  f.patch('/:id/pause', {
    preHandler: authenticate,
    schema: {
      tags: ['Members'],
      description: 'Toggle pause/resume for a member (resume extends paidUntil by paused duration)',
      params: MemberParamsSchema,
    },
    handler: togglePause,
  });
}
