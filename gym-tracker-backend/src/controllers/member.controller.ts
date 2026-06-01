import { FastifyRequest, FastifyReply } from 'fastify';
import { CreateMemberBody, UpdateMemberBody, MemberParams } from '../schemas/member.schema';
import * as memberService from '../services/member.service';

export const create = async (
  req: FastifyRequest<{ Body: CreateMemberBody }>,
  reply: FastifyReply
): Promise<void> => {
  try {
    const member = await memberService.createMember(req.userId, req.body);
    reply.code(201).send({ success: true, data: member });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to create member';
    reply.code(400).send({ success: false, message });
  }
};

export const list = async (
  req: FastifyRequest,
  reply: FastifyReply
): Promise<void> => {
  try {
    const members = await memberService.getMembers(req.userId);
    reply.send({ success: true, data: members });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to fetch members';
    reply.code(400).send({ success: false, message });
  }
};

export const get = async (
  req: FastifyRequest<{ Params: MemberParams }>,
  reply: FastifyReply
): Promise<void> => {
  try {
    const member = await memberService.getMember(req.userId, req.params.id);
    reply.send({ success: true, data: member });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Member not found';
    reply.code(404).send({ success: false, message });
  }
};

export const update = async (
  req: FastifyRequest<{ Params: MemberParams; Body: UpdateMemberBody }>,
  reply: FastifyReply
): Promise<void> => {
  try {
    const member = await memberService.updateMember(req.userId, req.params.id, req.body);
    reply.send({ success: true, data: member });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to update member';
    reply.code(400).send({ success: false, message });
  }
};

export const remove = async (
  req: FastifyRequest<{ Params: MemberParams }>,
  reply: FastifyReply
): Promise<void> => {
  try {
    await memberService.deleteMember(req.userId, req.params.id);
    reply.send({ success: true, message: 'Member deleted' });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to delete member';
    reply.code(400).send({ success: false, message });
  }
};

export const togglePause = async (
  req: FastifyRequest<{ Params: MemberParams }>,
  reply: FastifyReply
): Promise<void> => {
  try {
    const member = await memberService.togglePause(req.userId, req.params.id);
    reply.send({ success: true, data: member });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to toggle pause';
    reply.code(400).send({ success: false, message });
  }
};
