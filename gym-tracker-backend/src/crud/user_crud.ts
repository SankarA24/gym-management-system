import { IUser, User } from '../models/User';
import * as queryFactory from '../db/queryFactory';

export default {
    createUser: async (data: Partial<IUser>): Promise<IUser> => {
        return await queryFactory.createRecord(User, data);
    },
    getUsers: async (conditions: Record<string, unknown> = {}): Promise<IUser[]> => {
        return await queryFactory.getRecords(User, conditions);
    },
    getUser: async (id: string): Promise<IUser | null> => {
        return await queryFactory.getRecord(User, id);
    },
    updateUser: async (id: string, data: Record<string, unknown>): Promise<IUser | null> => {
        return await queryFactory.updateRecord(User, id, data);
    },
    deleteUser: async (id: string): Promise<IUser | null> => {
        return await queryFactory.deleteRecord(User, id);
    },
};
