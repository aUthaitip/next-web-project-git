import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/backend/prisma';

// PUT /api/content/[id] — update article
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: idStr } = await params;
    const id = parseInt(idStr);
    const body = await req.json();
    const { title, titleEn, category, content, contentEn, imageUrl, published } = body;

    const article = await prisma.article.update({
      where: { id },
      data: {
        title,
        titleEn: titleEn || null,
        category,
        content,
        contentEn: contentEn || null,
        imageUrl: imageUrl || null,
        published: published ?? false,
      },
    });

    return NextResponse.json(article);
  } catch (error) {
    console.error('PUT /api/content error:', error);
    return NextResponse.json({ error: 'Failed to update article' }, { status: 500 });
  }
}

// DELETE /api/content/[id] — delete article
export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: idStr } = await params;
    const id = parseInt(idStr);
    await prisma.article.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE /api/content error:', error);
    return NextResponse.json({ error: 'Failed to delete article' }, { status: 500 });
  }
}
