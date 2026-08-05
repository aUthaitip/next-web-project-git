import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { sessionOptions, SessionData } from '@/backend/session';
import prisma from '@/backend/prisma';

export const runtime = 'nodejs';

export async function GET() {
  const session = await getIronSession<SessionData>(await cookies(), sessionOptions);
  if (!session.isLoggedIn || !session.userId) {
    return NextResponse.json({ isLoggedIn: false });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: session.userId },
    });

    if (!user) {
      return NextResponse.json({ isLoggedIn: false });
    }

    return NextResponse.json({
      isLoggedIn: true,
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      userPhone: user.phone,
      userImage: user.image ?? null,
      lineUserId: user.lineUserId ?? null,
    });
  } catch (error) {
    console.error('Error fetching user info from DB:', error);
    return NextResponse.json({
      isLoggedIn: true,
      userId: session.userId,
      userName: session.userName,
      userEmail: session.userEmail,
      userPhone: session.userPhone,
      userImage: session.userImage ?? null,
      lineUserId: null,
    });
  }
}