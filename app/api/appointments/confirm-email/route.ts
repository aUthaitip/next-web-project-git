import { NextResponse } from 'next/server';
import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';
import { sessionOptions, SessionData } from '@/lib/session';
import { sendAppointmentEmail } from '@/lib/email';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  const session = await getIronSession<SessionData>(await cookies(), sessionOptions);
  if (!session.isLoggedIn || !session.userEmail) {
    return NextResponse.json({ ok: false });
  }

  const { petName, service, date, time } = await req.json();

  try {
    await sendAppointmentEmail({
      to: session.userEmail,
      userName: session.userName!,
      appointment: { petName, service, date, time },
      type: 'confirmation',
    });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error('Email error:', e);
    return NextResponse.json({ ok: false });
  }
}