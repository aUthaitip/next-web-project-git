import type { SessionOptions } from 'iron-session';

// Only the optional LINE OAuth handshake uses iron-session. Member sessions
// are issued and verified by the Go API.
export const lineSessionOptions: SessionOptions = {
  password: process.env.SESSION_SECRET as string,
  cookieName: 'pawplan-line-oauth',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'lax',
    path: '/api/auth/line',
    maxAge: 600,
  },
};
