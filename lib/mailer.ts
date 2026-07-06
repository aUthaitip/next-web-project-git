import nodemailer from "nodemailer";

const isDev = process.env.NODE_ENV === "development";
const useMock = isDev && process.env.MOCK_EMAIL !== "false";

type SendMailOptions = {
  from?: string;
  to: string;
  subject: string;
  html: string;
  text?: string;
};

// transporter จริง ใช้ config เดียวกับ SMTP_* ใน .env
// (lib/email.ts และ app/api/contact/route.ts เรียกผ่านฟังก์ชันนี้ทั้งคู่ ไม่สร้าง transporter ซ้ำ)
const realTransporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER || process.env.EMAIL_USER,
    pass: process.env.SMTP_PASS || process.env.EMAIL_PASS,
  },
});

export async function sendMail({ from, to, subject, html, text }: SendMailOptions) {
  if (useMock) {
    // dev mode: ไม่ส่งจริง แค่ log ออก console เพื่อไม่ต้องพึ่ง Gmail app password จากทีม
    console.log("\n📧 [MOCK EMAIL] ------------------------------");
    console.log("From:    ", from ?? process.env.EMAIL_USER);
    console.log("To:      ", to);
    console.log("Subject: ", subject);
    console.log("Body:\n", text ?? html.replace(/<[^>]+>/g, ""));
    console.log("--------------------------------------------\n");
    return { success: true, mocked: true };
  }

  try {
    const info = await realTransporter.sendMail({
      from: from ?? `"Pawplan" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
      text,
    });
    return { success: true, mocked: false, messageId: info.messageId };
  } catch (error) {
    console.error("[sendMail] Failed to send email:", error);
    return { success: false, mocked: false, error };
  }
}
