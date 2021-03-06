import jwt from 'jsonwebtoken';
import User, { IUser } from './models/user.model';

const SECRETKEY = process.env.SECRETKEY || 'not safe use env';

export const getUserFromToken = (token: string | undefined) => {
  try {
    if (!token) return null;
    const payload: any = jwt.verify(token, SECRETKEY);
    const user = User.findById(payload._id);
    return user;
  } catch (error) {
    return null;
  }
};
