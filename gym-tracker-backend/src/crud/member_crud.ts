import { IMember, Member } from '../models/Member';
import * as queryFactory from '../db/queryFactory';

export default {
    createMember: async (data: Partial<IMember>): Promise<IMember> => {
        return await queryFactory.createRecord(Member, data);
    },
    getMembers: async (conditions: Record<string, unknown> = {}): Promise<IMember[]> => {
        return await queryFactory.getRecords(Member, conditions);
    },
    getMember: async (id: string): Promise<IMember | null> => {
        return await queryFactory.getRecord(Member, id);
    },
    updateMember: async (id: string, data: Record<string, unknown>): Promise<IMember | null> => {
        return await queryFactory.updateRecord(Member, id, data);
    },
    deleteMember: async (id: string): Promise<IMember | null> => {
        return await queryFactory.deleteRecord(Member, id);
    },
};
