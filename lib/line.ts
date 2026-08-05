import crypto from 'crypto';

const LINE_CHANNEL_ACCESS_TOKEN = process.env.LINE_CHANNEL_ACCESS_TOKEN;
const LINE_CHANNEL_SECRET = process.env.LINE_CHANNEL_SECRET;

/**
 * Sends a push message to a specific LINE user using the LINE Messaging API.
 */
export async function sendLinePushMessage(to: string, messages: any[]) {
  if (!LINE_CHANNEL_ACCESS_TOKEN) {
    console.warn('LINE_CHANNEL_ACCESS_TOKEN is not configured. Skipping push message.');
    return false;
  }

  try {
    const response = await fetch('https://api.line.me/v2/bot/message/push', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${LINE_CHANNEL_ACCESS_TOKEN}`,
      },
      body: JSON.stringify({
        to,
        messages,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`LINE Push API error: Status ${response.status} - ${errorText}`);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Failed to send LINE push message:', error);
    return false;
  }
}

/**
 * Sends a reply message to a replyToken (used in webhooks).
 */
export async function sendLineReplyMessage(replyToken: string, messages: any[]) {
  if (!LINE_CHANNEL_ACCESS_TOKEN) {
    console.warn('LINE_CHANNEL_ACCESS_TOKEN is not configured. Skipping reply message.');
    return false;
  }

  try {
    const response = await fetch('https://api.line.me/v2/bot/message/reply', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${LINE_CHANNEL_ACCESS_TOKEN}`,
      },
      body: JSON.stringify({
        replyToken,
        messages,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`LINE Reply API error: Status ${response.status} - ${errorText}`);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Failed to send LINE reply message:', error);
    return false;
  }
}

/**
 * Verifies the signature of the incoming LINE Webhook request.
 */
export function verifyLineSignature(body: string, signature: string): boolean {
  if (!LINE_CHANNEL_SECRET) {
    console.warn('LINE_CHANNEL_SECRET is not configured. Skipping signature verification.');
    return true; // Return true in dev if secret isn't set, or handle strictly
  }

  const hash = crypto
    .createHmac('SHA256', LINE_CHANNEL_SECRET)
    .update(body)
    .digest('base64');

  return hash === signature;
}

/**
 * Returns a beautiful Flex Message template for booking success confirmation.
 */
export function getLineFlexTemplateForAppointment(appointment: any, siteUrl: string) {
  return {
    type: 'flex',
    altText: '🐾 ยืนยันการจองนัดหมาย PawPlan',
    contents: {
      type: 'bubble',
      size: 'mega',
      header: {
        type: 'box',
        layout: 'vertical',
        backgroundColor: '#0d9488',
        paddingAll: '20px',
        contents: [
          {
            type: 'text',
            text: 'จองนัดหมายสำเร็จ! 🎉',
            weight: 'bold',
            color: '#ffffff',
            size: 'lg',
          },
          {
            type: 'text',
            text: 'ระบบได้รับการจองของคุณเรียบร้อยแล้ว',
            color: '#ccfbf1',
            size: 'xs',
            margin: 'sm',
          }
        ],
      },
      body: {
        type: 'box',
        layout: 'vertical',
        paddingAll: '20px',
        spacing: 'md',
        contents: [
          {
            type: 'text',
            text: 'รายละเอียดการจอง',
            weight: 'bold',
            size: 'md',
            color: '#111827',
          },
          {
            type: 'box',
            layout: 'vertical',
            spacing: 'sm',
            contents: [
              {
                type: 'box',
                layout: 'horizontal',
                contents: [
                  { type: 'text', text: 'สัตว์เลี้ยง', color: '#6b7280', size: 'sm', flex: 2 },
                  { type: 'text', text: `${appointment.petName} (${appointment.petType})`, color: '#374151', size: 'sm', weight: 'bold', flex: 4 }
                ],
              },
              {
                type: 'box',
                layout: 'horizontal',
                contents: [
                  { type: 'text', text: 'บริการ', color: '#6b7280', size: 'sm', flex: 2 },
                  { type: 'text', text: appointment.service, color: '#374151', size: 'sm', flex: 4 }
                ],
              },
              {
                type: 'box',
                layout: 'horizontal',
                contents: [
                  { type: 'text', text: 'วันที่', color: '#6b7280', size: 'sm', flex: 2 },
                  { type: 'text', text: appointment.date, color: '#374151', size: 'sm', flex: 4 }
                ],
              },
              {
                type: 'box',
                layout: 'horizontal',
                contents: [
                  { type: 'text', text: 'เวลา', color: '#6b7280', size: 'sm', flex: 2 },
                  { type: 'text', text: `${appointment.time} น.`, color: '#374151', size: 'sm', flex: 4 }
                ],
              }
            ],
          }
        ],
      },
      footer: {
        type: 'box',
        layout: 'vertical',
        spacing: 'sm',
        contents: [
          {
            type: 'button',
            style: 'primary',
            color: '#0d9488',
            action: {
              type: 'uri',
              label: 'ดูนัดหมายของฉัน',
              uri: `${siteUrl}/my-appointments`,
            },
          }
        ],
      },
    },
  };
}

/**
 * Returns a beautiful Flex Message template for the 1-day reminder with "Acknowledge" button.
 */
export function getLineFlexTemplateForReminder(appointment: any, siteUrl: string) {
  return {
    type: 'flex',
    altText: '🐾 แจ้งเตือนนัดหมายพรุ่งนี้ PawPlan',
    contents: {
      type: 'bubble',
      size: 'mega',
      header: {
        type: 'box',
        layout: 'vertical',
        backgroundColor: '#f59e0b',
        paddingAll: '20px',
        contents: [
          {
            type: 'text',
            text: 'แจ้งเตือนนัดหมายวันพรุ่งนี้! ⏰',
            weight: 'bold',
            color: '#ffffff',
            size: 'lg',
          },
          {
            type: 'text',
            text: 'อีก 1 วันจะถึงวันนัดหมายของคุณ',
            color: '#fef3c7',
            size: 'xs',
            margin: 'sm',
          }
        ],
      },
      body: {
        type: 'box',
        layout: 'vertical',
        paddingAll: '20px',
        spacing: 'md',
        contents: [
          {
            type: 'text',
            text: 'กรุณาตรวจสอบและกดยืนยันการรับทราบด้านล่าง',
            weight: 'bold',
            size: 'sm',
            color: '#374151',
            wrap: true,
          },
          {
            type: 'box',
            layout: 'vertical',
            spacing: 'sm',
            margin: 'md',
            contents: [
              {
                type: 'box',
                layout: 'horizontal',
                contents: [
                  { type: 'text', text: 'สัตว์เลี้ยง', color: '#6b7280', size: 'sm', flex: 2 },
                  { type: 'text', text: `${appointment.petName} (${appointment.petType})`, color: '#374151', size: 'sm', weight: 'bold', flex: 4 }
                ],
              },
              {
                type: 'box',
                layout: 'horizontal',
                contents: [
                  { type: 'text', text: 'บริการ', color: '#6b7280', size: 'sm', flex: 2 },
                  { type: 'text', text: appointment.service, color: '#374151', size: 'sm', flex: 4 }
                ],
              },
              {
                type: 'box',
                layout: 'horizontal',
                contents: [
                  { type: 'text', text: 'วัน/เวลา', color: '#6b7280', size: 'sm', flex: 2 },
                  { type: 'text', text: `${appointment.date} @ ${appointment.time} น.`, color: '#374151', size: 'sm', flex: 4 }
                ],
              }
            ],
          }
        ],
      },
      footer: {
        type: 'box',
        layout: 'vertical',
        spacing: 'sm',
        contents: [
          {
            type: 'button',
            style: 'primary',
            color: '#0d9488',
            action: {
              type: 'uri',
              label: '✅ กดรับทราบการนัดหมาย',
              uri: `${siteUrl}/appointments/acknowledge/${appointment.id}`,
            },
          },
          {
            type: 'button',
            style: 'link',
            color: '#6b7280',
            action: {
              type: 'uri',
              label: 'รายละเอียดเว็บไซต์',
              uri: `${siteUrl}/my-appointments`,
            },
          }
        ],
      },
    },
  };
}

/**
 * Returns a beautiful Flex Message template for appointment completion.
 */
export function getLineFlexTemplateForCompletion(appointment: any, siteUrl: string) {
  return {
    type: 'flex',
    altText: '🐾 เสร็จสิ้นการรักษา/บริการ PawPlan',
    contents: {
      type: 'bubble',
      size: 'mega',
      header: {
        type: 'box',
        layout: 'vertical',
        backgroundColor: '#0d9488',
        paddingAll: '20px',
        contents: [
          {
            type: 'text',
            text: 'เสร็จสิ้นบริการเรียบร้อยแล้ว! 🎉',
            weight: 'bold',
            color: '#ffffff',
            size: 'lg',
          },
          {
            type: 'text',
            text: 'ขอบคุณที่มอบความไว้วางใจให้ PawPlan ดูแลสัตว์เลี้ยงของคุณ',
            color: '#ccfbf1',
            size: 'xs',
            wrap: true,
            margin: 'sm',
          }
        ],
      },
      body: {
        type: 'box',
        layout: 'vertical',
        paddingAll: '20px',
        spacing: 'md',
        contents: [
          {
            type: 'text',
            text: 'รายละเอียดประวัติการเข้ารับบริการ',
            weight: 'bold',
            size: 'md',
            color: '#111827',
          },
          {
            type: 'box',
            layout: 'vertical',
            spacing: 'sm',
            contents: [
              {
                type: 'box',
                layout: 'horizontal',
                contents: [
                  { type: 'text', text: 'สัตว์เลี้ยง', color: '#6b7280', size: 'sm', flex: 2 },
                  { type: 'text', text: `${appointment.petName} (${appointment.petType})`, color: '#374151', size: 'sm', weight: 'bold', flex: 4 }
                ],
              },
              {
                type: 'box',
                layout: 'horizontal',
                contents: [
                  { type: 'text', text: 'บริการ', color: '#6b7280', size: 'sm', flex: 2 },
                  { type: 'text', text: appointment.service, color: '#374151', size: 'sm', flex: 4 }
                ],
              },
              {
                type: 'box',
                layout: 'horizontal',
                contents: [
                  { type: 'text', text: 'วันที่มา', color: '#6b7280', size: 'sm', flex: 2 },
                  { type: 'text', text: appointment.date, color: '#374151', size: 'sm', flex: 4 }
                ],
              },
              {
                type: 'box',
                layout: 'horizontal',
                contents: [
                  { type: 'text', text: 'ชำระเงิน', color: '#6b7280', size: 'sm', flex: 2 },
                  { type: 'text', text: 'ชำระเงินเสร็จสิ้น', color: '#16a34a', size: 'sm', weight: 'bold', flex: 4 }
                ],
              }
            ],
          }
        ],
      },
      footer: {
        type: 'box',
        layout: 'vertical',
        spacing: 'sm',
        contents: [
          {
            type: 'button',
            style: 'primary',
            color: '#0d9488',
            action: {
              type: 'uri',
              label: 'ดูประวัติการรักษาทั้งหมด',
              uri: `${siteUrl}/my-appointments`,
            },
          }
        ],
      },
    },
  };
}

/**
 * Returns a beautiful Flex Message template for follow-up suggested appointments.
 */
export function getLineFlexTemplateForSuggestedAppointment(appointment: any, siteUrl: string) {
  return {
    type: 'flex',
    altText: '🐾 แพทย์เสนอนัดหมายใหม่สำหรับสัตว์เลี้ยงของคุณ PawPlan',
    contents: {
      type: 'bubble',
      size: 'mega',
      header: {
        type: 'box',
        layout: 'vertical',
        backgroundColor: '#0d9488',
        paddingAll: '20px',
        contents: [
          {
            type: 'text',
            text: 'แพทย์เสนอนัดหมายใหม่ 📅',
            weight: 'bold',
            color: '#ffffff',
            size: 'lg',
          },
          {
            type: 'text',
            text: 'คลินิกได้สร้างข้อเสนอนัดหมายการเข้ารับบริการครั้งถัดไปให้คุณ',
            color: '#ccfbf1',
            size: 'xs',
            wrap: true,
            margin: 'sm',
          }
        ],
      },
      body: {
        type: 'box',
        layout: 'vertical',
        paddingAll: '20px',
        spacing: 'md',
        contents: [
          {
            type: 'text',
            text: 'กรุณาตรวจสอบและกดยืนยันเพื่อบันทึกการนัดหมาย',
            weight: 'bold',
            size: 'sm',
            color: '#374151',
            wrap: true,
          },
          {
            type: 'box',
            layout: 'vertical',
            spacing: 'sm',
            margin: 'md',
            contents: [
              {
                type: 'box',
                layout: 'horizontal',
                contents: [
                  { type: 'text', text: 'สัตว์เลี้ยง', color: '#6b7280', size: 'sm', flex: 2 },
                  { type: 'text', text: `${appointment.petName} (${appointment.petType})`, color: '#374151', size: 'sm', weight: 'bold', flex: 4 }
                ],
              },
              {
                type: 'box',
                layout: 'horizontal',
                contents: [
                  { type: 'text', text: 'บริการ', color: '#6b7280', size: 'sm', flex: 2 },
                  { type: 'text', text: appointment.service, color: '#374151', size: 'sm', flex: 4 }
                ],
              },
              {
                type: 'box',
                layout: 'horizontal',
                contents: [
                  { type: 'text', text: 'วัน/เวลา', color: '#6b7280', size: 'sm', flex: 2 },
                  { type: 'text', text: `${appointment.date} @ ${appointment.time} น.`, color: '#374151', size: 'sm', flex: 4 }
                ],
              }
            ],
          }
        ],
      },
      footer: {
        type: 'box',
        layout: 'vertical',
        spacing: 'sm',
        contents: [
          {
            type: 'button',
            style: 'primary',
            color: '#0d9488',
            action: {
              type: 'uri',
              label: '✅ กดยืนยันการนัดหมาย',
              uri: `${siteUrl}/my-appointments`,
            },
          }
        ],
      },
    },
  };
}
