import { NextResponse } from 'next/server';
import { sendAppointmentEmail } from '@/backend/email/email';
import { getMemberUser } from '@/backend/member-session';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  const user = await getMemberUser();
  if (!user) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const { petName, service, date, time } = await req.json();

  try {
    await sendAppointmentEmail({
      to: user.email,
      userName: user.name,
      appointment: { petName, service, date, time },
      type: 'confirmation',
    });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error('Email error:', e);
    return NextResponse.json({ ok: false });
  }
}
