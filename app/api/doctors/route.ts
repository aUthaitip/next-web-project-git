import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { z } from 'zod';

export const runtime = 'nodejs';

export async function GET() {
  try {
    const doctors = await prisma.doctor.findMany({
      orderBy: { createdAt: 'desc' },
    });
    // Map availableDays string to array and provide fallback alias fields
    const mappedDoctors = doctors.map(d => ({
      ...d,
      availableDays: d.availableDays ? d.availableDays.split(',').filter(Boolean) : [],
      role: d.expertise || '',
      specialty: d.expertise || '',
    }));
    return NextResponse.json(mappedDoctors);
  } catch (error) {
    console.error('GET /api/doctors error', error);
    // If DB is unavailable, return an empty list so pages can still render.
    return NextResponse.json([], { status: 200 });
  }
}

const doctorSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  specialty: z.string().optional().nullable(),
  expertise: z.string().optional().nullable(),
  email: z.string().email().optional().nullable(),
  imageUrl: z.string().url().optional().nullable(),
  bio: z.string().optional().nullable(),
  availableDays: z.array(z.string()).optional(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = doctorSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || 'Invalid input' },
        { status: 400 }
      );
    }

    const { name, specialty, expertise, email, imageUrl, bio, availableDays } = parsed.data;

    // map incoming `specialty` (old name) to `expertise` (schema)
    const expertiseValue = expertise ?? specialty ?? null;
    const availableDaysStr = Array.isArray(availableDays) ? availableDays.join(',') : null;

    const doctor = await prisma.doctor.create({
      data: {
        name,
        expertise: expertiseValue,
        email,
        imageUrl,
        bio: bio || '',
        availableDays: availableDaysStr,
      },
    });

    const mappedDoctor = {
      ...doctor,
      availableDays: doctor.availableDays ? doctor.availableDays.split(',').filter(Boolean) : [],
      role: doctor.expertise || '',
      specialty: doctor.expertise || '',
    };

    return NextResponse.json(mappedDoctor, { status: 201 });
  } catch (error) {
    console.error('POST /api/doctors error', error);
    return NextResponse.json({ error: 'Error creating doctor' }, { status: 500 });
  }
}