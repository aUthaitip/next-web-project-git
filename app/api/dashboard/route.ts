import { NextResponse } from 'next/server';
import prisma from '@/backend/prisma';

export const runtime = 'nodejs';

export async function GET() {
  try {
    const [totalAppointments, confirmedVisits, pendingRequests, activeDoctors, recentAppointments] =
      await Promise.all([
        prisma.appointment.count(),
        prisma.appointment.count({ where: { status: 'confirmed' } }),
        prisma.appointment.count({ where: { status: 'pending' } }),
        prisma.doctor.count(),
        prisma.appointment.findMany({
          orderBy: { createdAt: 'desc' },
          take: 5,
          select: { id: true, petName: true, petType: true, date: true, time: true, status: true },
        }),
      ]);

    const toLocalDateStr = (d: Date) => {
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };

    const today = new Date();
    const dayOfWeek = today.getDay();
    const monday = new Date(today);
    monday.setDate(today.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));

    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const weeklyActivity = [];

    for (let i = 0; i < 7; i++) {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      const dateStr = toLocalDateStr(d);
      const shortDate = `${d.getDate()}/${d.getMonth() + 1}`;

      const appts = await prisma.appointment.findMany({
        where: { date: dateStr },
        select: { id: true, petName: true, owner: true, time: true, status: true },
        orderBy: { time: 'asc' },
      });

      weeklyActivity.push({
        day: days[i],
        date: shortDate,
        count: appts.length,
        appointments: appts,
      });
    }

    return NextResponse.json({
      totalAppointments,
      confirmedVisits,
      pendingRequests,
      activeDoctors,
      recentAppointments,
      weeklyActivity,
    });
  } catch (error) {
    console.error('GET /api/dashboard error:', error);
    return NextResponse.json({ error: 'Failed to load dashboard' }, { status: 500 });
  }
}
