import { FastifyRequest, FastifyReply } from 'fastify';
import { CreatePaymentBody, PaymentParams, MemberIdQuery } from '../schemas/payment.schema';
import * as paymentService from '../services/payment.service';
import { IPayment } from '../models/Payment';

export const create = async (
  req: FastifyRequest<{ Body: CreatePaymentBody }>,
  reply: FastifyReply
): Promise<void> => {
  try {
    const { payment, newPaidUntil } = await paymentService.createPayment(req.userId, req.body);
    reply.code(201).send({ success: true, data: { payment, newPaidUntil } });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to create payment';
    reply.code(400).send({ success: false, message });
  }
};

export const list = async (
  req: FastifyRequest<{ Querystring: MemberIdQuery }>,
  reply: FastifyReply
): Promise<void> => {
  try {
    let payments: IPayment[];
    if (req.query.memberId) {
      payments = await paymentService.getPayments(req.userId, req.query.memberId);
    } else {
      payments = await paymentService.getAllPayments(req.userId);
    }
    reply.send({ success: true, data: payments });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to fetch payments';
    reply.code(400).send({ success: false, message });
  }
};

export const get = async (
  req: FastifyRequest<{ Params: PaymentParams }>,
  reply: FastifyReply
): Promise<void> => {
  try {
    const payment = await paymentService.getPayment(req.userId, req.params.id);
    reply.send({ success: true, data: payment });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Payment not found';
    reply.code(404).send({ success: false, message });
  }
};

export const remove = async (
  req: FastifyRequest<{ Params: PaymentParams }>,
  reply: FastifyReply
): Promise<void> => {
  try {
    await paymentService.deletePayment(req.userId, req.params.id);
    reply.send({ success: true, message: 'Payment deleted' });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to delete payment';
    reply.code(400).send({ success: false, message });
  }
};
