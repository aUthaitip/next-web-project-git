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
