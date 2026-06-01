import { IPayment, Payment } from '../models/Payment';
import * as queryFactory from '../db/queryFactory';

export default {
    createPayment: async (data: Partial<IPayment>): Promise<IPayment> => {
        return await queryFactory.createRecord(Payment, data);
    },
    getPayments: async (conditions: Record<string, unknown> = {}): Promise<IPayment[]> => {
        return await queryFactory.getRecords(Payment, conditions);
    },
    getPayment: async (id: string): Promise<IPayment | null> => {
        return await queryFactory.getRecord(Payment, id);
    },
    updatePayment: async (id: string, data: Record<string, unknown>): Promise<IPayment | null> => {
        return await queryFactory.updateRecord(Payment, id, data);
    },
    deletePayment: async (id: string): Promise<IPayment | null> => {
        return await queryFactory.deleteRecord(Payment, id);
    },
};
