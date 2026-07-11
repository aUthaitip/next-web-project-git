import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/backend/prisma';

// GET /api/content?category=Cat
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');

    const articles = await prisma.article.findMany({
      where: category ? { category } : undefined,
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(articles);
  } catch (error) {
    console.error('GET /api/content error:', error);
    return NextResponse.json({ error: 'Failed to fetch articles' }, { status: 500 });
  }
}

// POST /api/content — create new article
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, category, content, imageUrl, published } = body;

    if (!title || !content) {
      return NextResponse.json({ error: 'title and content are required' }, { status: 400 });
    }

    const article = await prisma.article.create({
      data: {
        title,
        category: category || 'General',
        content,
        imageUrl: imageUrl || null,
        published: published ?? false,
      },
    });
    return NextResponse.json(article, { status: 201 });
  } catch (error) {
    console.error('POST /api/content error:', error);
    return NextResponse.json({ error: 'Failed to create article' }, { status: 500 });
  }
}
