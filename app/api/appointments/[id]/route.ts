import { NextRequest, NextResponse } from 'next/server';
import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';
import prisma from '@/lib/prisma';
import { sessionOptions, SessionData } from '@/lib/session';
import { sendAppointmentEmail } from '@/lib/email';

export const runtime = 'nodejs';

// ของเดิม — ใช้โดย admin
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id: idStr } = await params;
  const id = parseInt(idStr);
  if (isNaN(id)) return NextResponse.json({ error: 'Invalid id' }, { status: 400 });
  try {
    const body = await req.json();
    const updated = await prisma.appointment.update({
      where: { id },
      data: { status: body.status },
    });
    return NextResponse.json(updated);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 });
  }
}

// ของเดิม — ใช้โดย admin
export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id: idStr } = await params;
  const id = parseInt(idStr);
  if (isNaN(id)) return NextResponse.json({ error: 'Invalid id' }, { status: 400 });
  try {
    await prisma.appointment.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 });
  }
}

// ใหม่ — ใช้โดย Pet Owner (เลื่อนนัด/ยกเลิก)
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getIronSession<SessionData>(await cookies(), sessionOptions);
  if (!session.isLoggedIn) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id: idStr } = await params;
  const id = parseInt(idStr);
  if (isNaN(id)) return NextResponse.json({ error: 'Invalid id' }, { status: 400 });

  const { status, date, time } = await req.json();

  // เช็คว่าเป็นนัดของ user คนนี้จริงๆ
  const appt = await prisma.appointment.findFirst({
    where: { id, userId: session.userId },
  });
  if (!appt) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const updated = await prisma.appointment.update({
    where: { id },
    data: {
      ...(status && { status }),
      ...(date && { date }),
      ...(time && { time }),
    },
  });

  // ส่ง email แจ้งเตือน
  try {
    if (session.userEmail) {
      await sendAppointmentEmail({
        to: session.userEmail,
        userName: session.userName!,
        appointment: updated,
        type: status === 'cancelled' ? 'cancellation' : 'reschedule',
      });
    }
  } catch (e) {
    console.error('Email error:', e);
  }

  return NextResponse.json(updated);
}