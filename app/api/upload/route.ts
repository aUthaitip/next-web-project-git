import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'ไม่พบไฟล์ภาพ' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'กรุณาอัปโหลดไฟล์รูปภาพเท่านั้น' }, { status: 400 });
    }

    // Limit file size to 1.5MB for base64 storage limits
    if (file.size > 1.5 * 1024 * 1024) {
      return NextResponse.json({ error: 'ขนาดรูปภาพต้องไม่เกิน 1.5MB สำหรับเซิร์ฟเวอร์คลาวด์' }, { status: 400 });
    }

    // Convert to Base64 Data URL
    const base64Data = buffer.toString('base64');
    const dataUrl = `data:${file.type};base64,${base64Data}`;

    return NextResponse.json({ success: true, url: dataUrl });

  } catch (error: any) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: `เกิดข้อผิดพลาดในการอัปโหลดรูปภาพ: ${error?.message || error}` }, { status: 500 });
  }
}
