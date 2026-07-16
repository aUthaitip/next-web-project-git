import { NextResponse } from 'next/server';
import prisma from '@/backend/prisma';
import { z } from 'zod';

export const runtime = 'nodejs';

const adSchema = z.object({
  titleTh: z.string().min(1, 'Title TH is required').optional(),
  titleEn: z.string().min(1, 'Title EN is required').optional(),
  imageUrl: z.string().min(1, 'Image URL is required').optional(),
  linkUrl: z.string().optional().nullable(),
  category: z.string().optional(),
  isActive: z.boolean().optional(),
  sortOrder: z.number().optional(),
});

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: paramId } = await params;
    const id = parseInt(paramId, 10);
    if (isNaN(id)) return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });

    const body = await req.json();
    const parsed = adSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || 'Invalid input' },
        { status: 400 }
      );
    }

    const updated = await prisma.shopAdvertisement.update({
      where: { id },
      data: parsed.data,
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('PUT /api/shop-ads/[id] error', error);
    return NextResponse.json({ error: 'Error updating ad' }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: paramId } = await params;
    const id = parseInt(paramId, 10);
    if (isNaN(id)) return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });

    await prisma.shopAdvertisement.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE /api/shop-ads/[id] error', error);
    return NextResponse.json({ error: 'Error deleting ad' }, { status: 500 });
  }
}
