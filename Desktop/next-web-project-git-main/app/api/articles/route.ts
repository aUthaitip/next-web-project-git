import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const type = url.searchParams.get('type') ?? '';
    const category = url.searchParams.get('category') ?? '';

    const db = await getDb();
    const col = db.collection('articles');

    const filter: any = {};
    if (type) filter.type = type;
    if (category) filter.category = category;

    const items = await col.find(filter).sort({ date: -1 }).limit(200).toArray();

    const data = items.map((it: any) => ({
      id: it._id?.toString?.(),
      title: it.title ?? '',
      snippet: it.snippet ?? '',
      image: it.image ?? '',
      date: it.date ?? '',
      category: it.category ?? '',
      link: it.link ?? ''
    }));

    return NextResponse.json({ ok: true, data });
  } catch (err: any) {
    console.error('GET /api/articles error', err);
    return NextResponse.json({ ok: false, error: err.message || 'Server error' }, { status: 500 });
  }
}