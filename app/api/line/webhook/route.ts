import { NextResponse } from 'next/server';
import prisma from '@/backend/prisma';
import { sendLineReplyMessage, verifyLineSignature } from '@/lib/line';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  try {
    const signature = request.headers.get('x-line-signature') || '';
    const bodyText = await request.text();

    // Verify webhook signature
    const isValid = verifyLineSignature(bodyText, signature);
    if (!isValid) {
      console.warn('Invalid LINE webhook signature received.');
      return new NextResponse('Invalid signature', { status: 401 });
    }

    const payload = JSON.parse(bodyText);
    const events = payload.events || [];

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

    for (const event of events) {
      if (event.type === 'message' && event.message.type === 'text') {
        const replyToken = event.replyToken;
        const lineUserId = event.source.userId;
        const text = event.message.text.trim();

        if (text === 'นัดหมายของฉัน') {
          // Find the connected user
          const user = await prisma.user.findFirst({
            where: { lineUserId },
          });

          if (!user) {
            // User not linked
            await sendLineReplyMessage(replyToken, [
              {
                type: 'text',
                text: `🐾 บัญชี LINE ของคุณยังไม่ได้เชื่อมต่อกับระบบ PawPlan\n\nกรุณาเข้าสู่ระบบเว็บไซต์และไปที่หน้าโปรไฟล์เพื่อเชื่อมต่อบัญชี LINE ของคุณนะครับ\n\nลิงก์สำหรับเชื่อมต่อ: ${siteUrl}/profile`,
              },
            ]);
            continue;
          }

          // Fetch upcoming appointments (status is not cancelled)
          // Since appointment dates are stored as String in DB (e.g. '2026-08-10'), we fetch all and sort/filter.
          const appointments = await prisma.appointment.findMany({
            where: {
              userId: user.id,
              status: { notIn: ['cancelled', 'rejected'] },
            },
            orderBy: { createdAt: 'desc' },
          });

          // Filter upcoming ones (today onwards)
          const todayStr = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
          const upcoming = appointments.filter(appt => {
            // Basic string compare since format is YYYY-MM-DD
            return appt.date >= todayStr;
          });

          if (upcoming.length === 0) {
            await sendLineReplyMessage(replyToken, [
              {
                type: 'text',
                text: `🐾 คุณไม่มีนัดหมายที่กำลังจะมาถึงในขณะนี้\n\nคุณสามารถจองบริการตรวจรักษาสัตว์เลี้ยงได้ที่หน้าเว็บไซต์ PawPlan เลยครับ:\n${siteUrl}/book`,
              },
            ]);
          } else {
            // Send a Flex message list
            const bubbles = upcoming.slice(0, 5).map(appt => ({
              type: 'bubble',
              size: 'micro',
              header: {
                type: 'box',
                layout: 'vertical',
                backgroundColor: '#0d9488',
                contents: [
                  {
                    type: 'text',
                    text: appt.petName,
                    weight: 'bold',
                    color: '#ffffff',
                    size: 'sm',
                  },
                  {
                    type: 'text',
                    text: appt.service,
                    color: '#ccfbf1',
                    size: 'xs',
                  }
                ],
              },
              body: {
                type: 'box',
                layout: 'vertical',
                spacing: 'xs',
                contents: [
                  {
                    type: 'text',
                    text: `📅 ${appt.date}`,
                    size: 'xs',
                    color: '#374151',
                  },
                  {
                    type: 'text',
                    text: `⏰ ${appt.time} น.`,
                    size: 'xs',
                    color: '#374151',
                  },
                  {
                    type: 'text',
                    text: `สถานะ: ${appt.status === 'pending' ? 'รออนุมัติ' : appt.status === 'confirmed' ? 'อนุมัติแล้ว' : appt.status}`,
                    size: 'xs',
                    color: appt.status === 'confirmed' ? '#16a34a' : '#f59e0b',
                    weight: 'bold',
                  }
                ],
              },
              footer: {
                type: 'box',
                layout: 'vertical',
                contents: [
                  {
                    type: 'button',
                    style: 'link',
                    height: 'sm',
                    action: {
                      type: 'uri',
                      label: 'ดูรายละเอียด',
                      uri: `${siteUrl}/my-appointments`,
                    },
                  }
                ],
              },
            }));

            await sendLineReplyMessage(replyToken, [
              {
                type: 'text',
                text: '🐾 นี่คือนัดหมายที่กำลังจะมาถึงของคุณครับ:',
              },
              {
                type: 'flex',
                altText: '🐾 รายการนัดหมาย PawPlan',
                contents: {
                  type: 'carousel',
                  contents: bubbles,
                },
              }
            ]);
          }
        } else if (text === 'ประวัตินัดหมาย') {
          // Send link card to /login
          await sendLineReplyMessage(replyToken, [
            {
              type: 'text',
              text: `🐾 คุณสามารถเข้าสู่ระบบเพื่อตรวจสอบประวัตินัดหมายและการรักษาย้อนหลังทั้งหมดได้ที่นี่ครับ:\n\n🔗 ${siteUrl}/login`,
            },
          ]);
        }
      }
    }

    return new NextResponse('OK', { status: 200 });
  } catch (error) {
    console.error('Error handling LINE webhook:', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
