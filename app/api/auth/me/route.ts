import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { sessionOptions, SessionData } from '@/lib/session';

export const runtime = 'nodejs';

export async function GET() {
  const session = await getIronSession<SessionData>(await cookies(), sessionOptions);
  if (!session.isLoggedIn) {
    return NextResponse.json({ isLoggedIn: false });
  }
  return NextResponse.json({
    isLoggedIn: true,
    userId: session.userId,
    userName: session.userName,
    userEmail: session.userEmail,
    userPhone: session.userPhone,
  });
}