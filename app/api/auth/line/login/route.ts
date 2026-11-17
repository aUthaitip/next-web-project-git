import { NextResponse } from 'next/server';
import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';
import { lineSessionOptions } from '@/backend/line-session';
import { getMemberUser } from '@/backend/member-session';
import { randomBytes } from 'node:crypto';

export const runtime = 'nodejs';

export async function GET() {
  const user = await getMemberUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const clientId = process.env.LINE_LOGIN_CHANNEL_ID || process.env.LINE_CHANNEL_ID;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const redirectUri = encodeURIComponent(`${siteUrl}/api/auth/line/callback`);
  
  if (!clientId) {
    return NextResponse.json({ error: 'LINE_LOGIN_CHANNEL_ID is not configured in .env' }, { status: 500 });
  }

  const session = await getIronSession<{ state?: string; userId?: number }>(await cookies(), lineSessionOptions);
  const state = randomBytes(32).toString('hex');
  session.state = state;
  session.userId = user.id;
  await session.save();
  const lineAuthUrl = `https://access.line.me/oauth2/v2.1/authorize?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&state=${state}&scope=profile%20openid`;

  return NextResponse.redirect(lineAuthUrl);
}
