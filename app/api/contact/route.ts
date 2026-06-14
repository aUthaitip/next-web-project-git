import { NextResponse } from 'next/server';
import * as nodemailer from 'nodemailer';

export async function POST(req: Request) {
  try {
    const { name, phone, email, service, message } = await req.json();

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const recipient = process.env.EMAIL_TO || process.env.EMAIL_USER;
    if (!recipient) {
      throw new Error('No recipient email configured. Set EMAIL_TO or EMAIL_USER in environment variables.');
    }

    await transporter.sendMail({
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
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, error: 'Send mail failed' },
      { status: 500 }
    );
  }
}