import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/backend/prisma';
import { sendLinePushMessage, getLineFlexTemplateForSuggestedAppointment } from '@/lib/line';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, patient, owner, phone, petName, petType, service, date, time, notes, doctorName } = body;

    if (!userId) {
      return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
    }

    // Create the suggested appointment
    const appointment = await prisma.appointment.create({
      data: {
        userId,
        patient: patient || owner || 'คนไข้ทั่วไป',
        owner: owner || patient || 'คนไข้ทั่วไป',
        phone: phone || '-',
        petName: petName || 'สัตว์เลี้ยง',
        petType: petType || 'ไม่ระบุ',
        service: service || 'ตรวจรักษา',
        date: date || '',
        time: time || '09:00',
        notes: notes || 'นัดหมายครั้งต่อไปโดยแพทย์',
        doctorName: doctorName || null,
        status: 'suggested',
      },
    });

    // Create a notification for the user
    await prisma.notification.create({
      data: {
        userId,
        message: `คุณมีนัดหมายใหม่: ${service}${doctorName ? ` กับ ${doctorName}` : ''} สำหรับน้อง ${petName} วันที่ ${date} เวลา ${time} กรุณายืนยันการนัดหมาย`,
      },
    });

    // Send LINE Push Notification if user is connected to LINE
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { lineUserId: true },
      });

      if (user?.lineUserId) {
        const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000').trim();
        const suggestFlex = getLineFlexTemplateForSuggestedAppointment(appointment, siteUrl);
        await sendLinePushMessage(user.lineUserId, [suggestFlex]);
      }
    } catch (lineErr) {
      console.error('Failed to send suggested appointment LINE notification:', lineErr);
    }

    return NextResponse.json(appointment, { status: 201 });
  } catch (error) {
    console.error('Suggest appointment error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
