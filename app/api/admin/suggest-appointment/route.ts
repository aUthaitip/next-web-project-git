import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, patient, owner, phone, petName, petType, service, date, time, notes } = body;

    if (!userId) {
      return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
    }

    // Create the suggested appointment
    const appointment = await prisma.appointment.create({
      data: {
        userId,
        patient,
        owner,
        phone,
        petName,
        petType,
        service,
        date,
        time,
        notes: notes || 'นัดหมายครั้งต่อไปโดยแพทย์',
        status: 'suggested',
      },
    });

    // Create a notification for the user
    await prisma.notification.create({
      data: {
        userId,
        message: `คุณมีนัดหมายใหม่: ${service} สำหรับน้อง ${petName} วันที่ ${date} เวลา ${time} กรุณายืนยันการนัดหมาย`,
      },
    });

    return NextResponse.json(appointment, { status: 201 });
  } catch (error) {
    console.error('Suggest appointment error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
