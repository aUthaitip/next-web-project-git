import { NextResponse } from 'next/server';
import prisma from '@/backend/prisma';
import { sendLinePushMessage, getLineFlexTemplateForReminder } from '@/lib/line';

export const runtime = 'nodejs';

export async function GET(request: Request) {
  // Simple auth key validation to prevent unauthorized trigger of reminders (optional, highly recommended)
  const { searchParams } = new URL(request.url);
  const key = searchParams.get('key');
  const cronKey = process.env.CRON_SECRET_KEY || 'pawplan-cron-default-key';

  if (key !== cronKey) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Get date for tomorrow (1 day from now)
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0]; // "YYYY-MM-DD"

    // Query appointments for tomorrow where user has lineUserId connected
    const appointments = await prisma.appointment.findMany({
      where: {
        date: tomorrowStr,
        status: { notIn: ['cancelled', 'rejected'] },
        acknowledged: false, // only remind if they haven't already acknowledged
        user: {
          lineUserId: { not: null },
        },
      },
      include: {
        user: {
          select: {
            lineUserId: true,
          },
        },
      },
    });

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    let sentCount = 0;
    let failedCount = 0;

    for (const appt of appointments) {
      if (appt.user?.lineUserId) {
        const flexTemplate = getLineFlexTemplateForReminder(appt, siteUrl);
        const success = await sendLinePushMessage(appt.user.lineUserId, [flexTemplate]);
        if (success) {
          sentCount++;
        } else {
          failedCount++;
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: `Checked reminders for tomorrow (${tomorrowStr})`,
      tomorrow: tomorrowStr,
      foundAppointments: appointments.length,
      sentReminders: sentCount,
      failedReminders: failedCount,
    });
  } catch (error) {
    console.error('Error processing cron reminders:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
