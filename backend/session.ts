import { SessionOptions } from 'iron-session';

export interface SessionData {
  userId?: number;
  userName?: string;
  userEmail?: string;
  userPhone?: string;
  userImage?: string;
  isLoggedIn: boolean;
}

export const sessionOptions: SessionOptions = {
  password: process.env.SESSION_SECRET as string,
  cookieName: 'pawplan-session',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 7,
  },
};
