import { NextResponse } from 'next/server';
import prisma from '@/backend/prisma';
import { getMemberUser } from '@/backend/member-session';

export const runtime = 'nodejs';

export async function POST() {
  try {
    const user = await getMemberUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { lineUserId: null },
    });

    return NextResponse.json({ success: true, message: 'Disconnected LINE account successfully' });
  } catch (error) {
    console.error('Error disconnecting LINE account:', error);
    return NextResponse.json({ error: 'Failed to disconnect LINE account' }, { status: 500 });
  }
}
