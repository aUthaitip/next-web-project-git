import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/backend/prisma';

// PUT /api/about-us/[id]
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id: idStr } = await params;  // ← เพิ่ม await
  const id = parseInt(idStr);
  if (isNaN(id)) return NextResponse.json({ error: 'Invalid id' }, { status: 400 });
  try {
    const body = await req.json();
    const { section, title, content, imageUrl, published, sortOrder } = body;
    const updated = await prisma.aboutUs.update({
      where: { id },
      data: {
        ...(section !== undefined && { section }),
        ...(title !== undefined && { title }),
        ...(content !== undefined && { content }),
        ...(imageUrl !== undefined && { imageUrl: imageUrl || null }),
        ...(published !== undefined && { published }),
        ...(sortOrder !== undefined && { sortOrder }),
      },
    });
    return NextResponse.json(updated);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 });
  }
}

// DELETE /api/about-us/[id]
export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id: idStr } = await params;  // ← เพิ่ม await
  const id = parseInt(idStr);
  if (isNaN(id)) return NextResponse.json({ error: 'Invalid id' }, { status: 400 });
  try {
    await prisma.aboutUs.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 });
  }
}