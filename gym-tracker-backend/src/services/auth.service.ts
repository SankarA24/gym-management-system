import jwt from 'jsonwebtoken';
import userCrud from '../crud/user_crud';
import { IUser } from '../models/User';

const JWT_SECRET = process.env.JWT_SECRET ?? 'change_me_in_production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN ?? '7d';

export const registerUser = async (data: Partial<IUser>): Promise<IUser> => {
  const existing = await userCrud.getUsers({ email: data.email });
  if (existing.length > 0) throw new Error('Email already in use');
  return userCrud.createUser(data);
};

export const loginUser = async (
  email: string,
  password: string
): Promise<{ token: string; user: Omit<IUser, 'password'> }> => {
  const [user] = await userCrud.getUsers({ email });
  if (!user) throw new Error('Invalid email or password');

  const valid = await user.comparePassword(password);
  if (!valid) throw new Error('Invalid email or password');

  const token = jwt.sign({ id: user._id }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  } as jwt.SignOptions);

  const { password: _pw, ...safeUser } = user.toObject();
  return { token, user: safeUser as Omit<IUser, 'password'> };
};
