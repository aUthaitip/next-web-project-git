import { NextResponse } from 'next/server';
import { sendMail } from '@/backend/email/mailer';
import { contactSchema } from '@/lib/validations';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parseResult = contactSchema.safeParse(body);

    if (!parseResult.success) {
      const errorMessage = parseResult.error.issues.map((issue) => issue.message).join(', ');
      return NextResponse.json(
        { success: false, error: errorMessage },
        { status: 400 }
      );
    }

    const { name, phone, email = '', service = '', message = '' } = parseResult.data;

    const recipient = process.env.EMAIL_TO || process.env.EMAIL_USER;
    if (!recipient) {
      throw new Error('No recipient email configured. Set EMAIL_TO or EMAIL_USER in environment variables.');
    }

    // ยิงอีเมลกับบันทึกลง Google Sheet พร้อมกัน ไม่ต้องรอทีละอย่าง
    const [emailResult, sheetResult] = await Promise.allSettled([
      sendMail({
        from: `"Pawplan Website" <${process.env.EMAIL_USER}>`,
        to: recipient,
        subject: 'มีข้อความติดต่อใหม่จากเว็บไซต์',
        html: `
          <h3>ข้อมูลผู้ติดต่อ</h3>
          <p><b>ชื่อ:</b> ${name}</p>
          <p><b>เบอร์:</b> ${phone}</p>
          <p><b>อีเมล:</b> ${email}</p>
          <p><b>บริการ:</b> ${service}</p>
          <p><b>ข้อความ:</b><br/>${message}</p>
        `,
      }),
      saveToGoogleSheet({ name, phone, email, service, message }),
    ]);

    // log ถ้ามีอันไหน fail แต่ไม่ block response หลัก
    if (emailResult.status === 'rejected') {
      console.error('sendMail failed:', emailResult.reason);
    }
    if (sheetResult.status === 'rejected') {
      console.error('saveToGoogleSheet failed:', sheetResult.reason);
    }

    // ถือว่าสำเร็จถ้ามีอย่างน้อย 1 อย่างสำเร็จ (กันข้อมูลหายทั้งหมด)
    if (emailResult.status === 'rejected' && sheetResult.status === 'rejected') {
      return NextResponse.json(
        { success: false, error: 'ไม่สามารถส่งข้อมูลได้ กรุณาลองใหม่' },
        { status: 502 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, error: 'Send mail failed' },
      { status: 500 }
    );
  }
}

async function saveToGoogleSheet(data: {
  name: string;
  phone: string;
  email: string;
  service: string;
  message: string;
}) {
  const webhookUrl = process.env.GOOGLE_SHEET_WEBHOOK_URL;
  if (!webhookUrl) {
    throw new Error('GOOGLE_SHEET_WEBHOOK_URL is not configured');
  }

  // Apps Script's doPost reads the action from the query string
  // (e.parameter.action), not from the JSON body — must be appended to the URL.
  const url = new URL(webhookUrl);
  url.searchParams.set('action', 'addUser');

  const response = await fetch(url.toString(), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
    redirect: 'follow',
  });

  const text = await response.text();
  let result;
  try {
    result = JSON.parse(text);
  } catch (err) {
    throw new Error(`Google Sheet webhook returned HTML or invalid JSON. Status: ${response.status}. Preview: ${text.substring(0, 150)}`);
  }

  // addUser() ตอบกลับเป็น { success: true } หรือ { success: false, error }
  if (result.success !== true) {
    throw new Error(result.error || `Google Sheet webhook returned failure: ${JSON.stringify(result)}`);
  }

  return result;
}