import { NextResponse } from 'next/server';
import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';
import prisma from '@/lib/prisma';
import { sessionOptions, SessionData } from '@/lib/session';

export const runtime = 'nodejs';

export async function GET() {
  try {
    const appointments = await prisma.appointment.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(appointments);
  } catch (error) {
    console.error('GET /api/appointments error', error);
    return NextResponse.json([], { status: 200 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { patient, service, date, time, owner, phone, petName, petType, notes } = body;

    const ownerValue = owner || patient || '';
    const patientValue = patient || owner || '';

    // Validate required fields
    if (!patientValue || !service || !date || !time || !phone || !petName || !petType) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (!process.env.DATABASE_URL) {
      return NextResponse.json(
        { error: 'DATABASE_URL is not configured. Please set it in your environment.' },
        { status: 500 }
      );
    }

    // Test database connection
    try {
      await prisma.$connect();
    } catch (connectionError) {
      console.error('Database connection failed:', connectionError);
      return NextResponse.json(
        { error: 'Database connection failed. Please check if the database server is running.' },
        { status: 503 }
      );
    }

    // Get current user session to link appointment if logged in
    const session = await getIronSession<SessionData>(await cookies(), sessionOptions);
    const userId = session.isLoggedIn ? session.userId : null;

    const appointment = await prisma.appointment.create({
      data: {
        patient: patientValue,
        service,
        date,
        time,
        owner: ownerValue,
        phone,
        petName,
        petType,
        notes: notes || '',
        status: 'pending',
        userId,
      },
    });

    return NextResponse.json(appointment, { status: 201 });
  } catch (error) {
    console.error('POST /api/appointments error', error);
    const message = error instanceof Error ? error.message : 'Error creating appointment';
    return NextResponse.json({ error: message }, { status: 503 });
  }
}
