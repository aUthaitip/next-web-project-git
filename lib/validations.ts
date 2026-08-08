import { z } from 'zod';

export const contactSchema = z.object({
  name: z.string().min(1, 'กรุณากรอกชื่อ'),
  phone: z.string().min(1, 'กรุณากรอกเบอร์โทรศัพท์'),
  email: z.string().email('รูปแบบอีเมลไม่ถูกต้อง').optional().or(z.literal('')),
  service: z.string().optional(),
  message: z.string().optional(),
});
