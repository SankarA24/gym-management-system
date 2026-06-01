import { Schema, model, Document } from 'mongoose';
import argon2 from 'argon2';

export interface IUserSettings {
  defaultPlan: 'monthly' | 'yearly';
  defaultMonthlyFee: number;
  defaultYearlyFee: number;
  reminderWindowDays: number;
  reminderTime: string;
  notifyWhatsapp: boolean;
  notifySms: boolean;
  notifyEmail: boolean;
}

export interface IUser extends Document {
  name: string;
  email: string;
  phone: string;
  password: string;
  gymName: string;
  settings: IUserSettings;
  comparePassword(candidate: string): Promise<boolean>;
}

const userSettingsSchema = new Schema<IUserSettings>(
  {
    defaultPlan: { type: String, enum: ['monthly', 'yearly'], default: 'monthly' },
    defaultMonthlyFee: { type: Number, default: 1800 },
    defaultYearlyFee: { type: Number, default: 18000 },
    reminderWindowDays: { type: Number, default: 7 },
    reminderTime: { type: String, default: '09:00' },
    notifyWhatsapp: { type: Boolean, default: true },
    notifySms: { type: Boolean, default: false },
    notifyEmail: { type: Boolean, default: false },
  },
  { _id: false }
);

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone: { type: String, required: true, trim: true },
    password: { type: String, required: true },
    gymName: { type: String, required: true, trim: true },
    settings: { type: userSettingsSchema, default: () => ({}) },
  },
  { timestamps: true }
);

userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  this.password = await argon2.hash(this.password);
});

userSchema.methods.comparePassword = function (candidate: string): Promise<boolean> {
  return argon2.verify(this.password, candidate);
};

export const User = model<IUser>('User', userSchema);
