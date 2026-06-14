import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

type EmailType = 'confirmation' | 'reminder' | 'cancellation' | 'reschedule';

interface AppointmentEmailParams {
  to: string;
  userName: string;
  appointment: {
    petName: string;
    service: string;
    date: string;
    time: string;
    status?: string;
  };
  type: EmailType;
}

export async function sendAppointmentEmail({ to, userName, appointment, type }: AppointmentEmailParams) {
  const subjects: Record<EmailType, string> = {
    confirmation: 'ยืนยันการจองนัดหมาย - Pawplan',
    reminder: 'แจ้งเตือนนัดหมายพรุ่งนี้ - Pawplan',
    cancellation: 'ยกเลิกนัดหมาย - Pawplan',
    reschedule: 'เลื่อนนัดหมาย - Pawplan',
  };

  const messages: Record<EmailType, string> = {
    confirmation: 'การจองนัดหมายของคุณได้รับการยืนยันแล้ว',
    reminder: 'เตือนความจำ: คุณมีนัดหมายพรุ่งนี้',
    cancellation: 'การนัดหมายของคุณถูกยกเลิกแล้ว',
    reschedule: 'การนัดหมายของคุณถูกเลื่อนแล้ว',
  };

  const html = `
    <div style="font-family: 'Kanit', sans-serif; max-width: 600px; margin: 0 auto; background: #f8fffe; border-radius: 12px; overflow: hidden;">
      <div style="background: #0d9488; padding: 32px; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 24px;">🐾 Pawplan</h1>
        <p style="color: #ccfbf1; margin: 8px 0 0;">${messages[type]}</p>
      </div>
      <div style="padding: 32px;">
        <p style="color: #374151;">สวัสดีคุณ <strong>${userName}</strong>,</p>
        <div style="background: white; border-radius: 8px; padding: 24px; border: 1px solid #e5e7eb; margin: 16px 0;">
          <h3 style="color: #0d9488; margin: 0 0 16px;">รายละเอียดนัดหมาย</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 8px 0; color: #6b7280;">สัตว์เลี้ยง</td><td style="padding: 8px 0; font-weight: 600;">${appointment.petName}</td></tr>
            <tr><td style="padding: 8px 0; color: #6b7280;">บริการ</td><td style="padding: 8px 0; font-weight: 600;">${appointment.service}</td></tr>
            <tr><td style="padding: 8px 0; color: #6b7280;">วันที่</td><td style="padding: 8px 0; font-weight: 600;">${appointment.date}</td></tr>
            <tr><td style="padding: 8px 0; color: #6b7280;">เวลา</td><td style="padding: 8px 0; font-weight: 600;">${appointment.time}</td></tr>
          </table>
        </div>
        <p style="color: #6b7280; font-size: 14px;">หากมีข้อสงสัย กรุณาติดต่อคลินิก Pawplan</p>
      </div>
    </div>
  `;

  await transporter.sendMail({
    from: `"Pawplan Clinic" <${process.env.SMTP_USER}>`,
    to,
    subject: subjects[type],
    html,
  });
}