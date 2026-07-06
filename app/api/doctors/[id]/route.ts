import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params; // ⭐ ต้อง await

    const doctorId = Number(id);
    const body = await req.json();

    const expertiseValue = body.expertise ?? body.specialty ?? null;
    const availableDaysStr = Array.isArray(body.availableDays) ? body.availableDays.join(',') : null;

    const updated = await prisma.doctor.update({
      where: { id: doctorId },
      data: {
        name: body.name,
        expertise: expertiseValue,
        imageUrl: body.imageUrl,
        email: body.email,
        bio: body.bio || '',
        availableDays: availableDaysStr,
      },
    });

    const mapped = {
      ...updated,
      availableDays: updated.availableDays ? updated.availableDays.split(',').filter(Boolean) : [],
      role: updated.expertise || '',
      specialty: updated.expertise || '',
    };

    return NextResponse.json(mapped);
  } catch (error) {
    console.error('PUT /api/doctors/[id] error', error);
    return NextResponse.json({ error: 'Failed to update doctor' }, { status: 503 });
  }
}


export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params; // ⭐ ต้อง await ก่อน

    const doctorId = Number(id);

    if (isNaN(doctorId)) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    }

    await prisma.doctor.delete({ where: { id: doctorId } });

    return NextResponse.json({ message: 'Deleted successfully' });
  } catch (error) {
    console.error('DELETE /api/doctors/[id] error', error);
    return NextResponse.json({ error: 'Failed to delete doctor' }, { status: 503 });
  }
}
