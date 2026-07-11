import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/backend/prisma';

// GET /api/about-us?section=awards_accreditation
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const section = searchParams.get('section');

  try {
    const data = await prisma.aboutUs.findMany({
      where: section ? { section } : undefined,
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
    });
    return NextResponse.json(data);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
  }
}


// POST /api/about-us
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { section, title, content, imageUrl, published, sortOrder } = body;

    if (!section || !title || !content) {
      return NextResponse.json(
        { error: 'section, title, content are required' },
        { status: 400 }
      );
    }

    const entry = await prisma.aboutUs.create({
      data: {
        section,
        title,
        content,
        imageUrl: imageUrl || null,
        published: published ?? false,
        sortOrder: sortOrder ?? 0,
      },
    });
    return NextResponse.json(entry, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to create' }, { status: 500 });
  }
}
