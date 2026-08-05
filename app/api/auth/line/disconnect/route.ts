import { NextResponse } from 'next/server';
import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';
import { sessionOptions, SessionData } from '@/backend/session';
import prisma from '@/backend/prisma';

export const runtime = 'nodejs';

export async function POST() {
  try {
    const session = await getIronSession<SessionData>(await cookies(), sessionOptions);
    if (!session.isLoggedIn || !session.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await prisma.user.update({
      where: { id: session.userId },
      data: { lineUserId: null },
    });

    return NextResponse.json({ success: true, message: 'Disconnected LINE account successfully' });
  } catch (error) {
    console.error('Error disconnecting LINE account:', error);
    return NextResponse.json({ error: 'Failed to disconnect LINE account' }, { status: 500 });
  }
}
