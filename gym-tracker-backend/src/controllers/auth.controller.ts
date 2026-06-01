import { FastifyRequest, FastifyReply } from 'fastify';
import { RegisterBody, LoginBody } from '../schemas/auth.schema';
import { registerUser, loginUser } from '../services/auth.service';

export const register = async (
  req: FastifyRequest<{ Body: RegisterBody }>,
  reply: FastifyReply
): Promise<void> => {
  try {
    const user = await registerUser(req.body);
    reply.code(201).send({ success: true, data: user });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Registration failed';
    reply.code(400).send({ success: false, message });
  }
};

export const login = async (
  req: FastifyRequest<{ Body: LoginBody }>,
  reply: FastifyReply
): Promise<void> => {
  try {
    const data = await loginUser(req.body.email, req.body.password);
    reply.send({ success: true, data });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Login failed';
    reply.code(401).send({ success: false, message });
  }
};
