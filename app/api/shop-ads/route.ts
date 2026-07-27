import { NextResponse } from 'next/server';
import prisma from '@/backend/prisma';
import { z } from 'zod';

export const runtime = 'nodejs';

export async function GET() {
  try {
    const ads = await prisma.shopAdvertisement.findMany({
      orderBy: { sortOrder: 'asc' },
    });
    return NextResponse.json(ads);
  } catch (error) {
    console.error('GET /api/shop-ads error', error);
    return NextResponse.json([], { status: 200 });
  }
}

const adSchema = z.object({
  titleTh: z.string().min(1, 'Title TH is required'),
  titleEn: z.string().min(1, 'Title EN is required'),
  imageUrl: z.string().min(1, 'Image URL is required'),
  linkUrl: z.string().optional().nullable(),
  category: z.string().optional().default('all'),
  isActive: z.boolean().optional().default(true),
  sortOrder: z.number().optional().default(0),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = adSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || 'Invalid input' },
        { status: 400 }
      );
    }

    const { titleTh, titleEn, imageUrl, linkUrl, category, isActive, sortOrder } = parsed.data;

    const ad = await prisma.shopAdvertisement.create({
      data: {
        titleTh,
        titleEn,
        imageUrl,
        linkUrl,
        category,
        isActive,
        sortOrder,
      },
    });

    return NextResponse.json(ad, { status: 201 });
  } catch (error) {
    console.error('POST /api/shop-ads error', error);
    return NextResponse.json({ error: 'Error creating ad', details: String(error) }, { status: 500 });
  }
}
