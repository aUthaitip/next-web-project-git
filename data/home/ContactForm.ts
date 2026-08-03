export interface ContactFormData {
  sendError: string;
  sendSuccess: string;
  contactTitle: string;
  contactSubtitle: string;
  namePlaceholder: string;
  phonePlaceholder: string;
  emailPlaceholder: string;
  selectService: string;
  svcCheckup: string;
  svcEmergency: string;
  svcGrooming: string;
  notesPlaceholder: string;
  sendBtn: string;
}

export const contactFormData: Record<'th' | 'en', ContactFormData> = {
  th: {
    sendError: "เกิดข้อผิดพลาด กรุณาลองใหม่",
    sendSuccess: "ส่งข้อความเรียบร้อยแล้ว",
    contactTitle: "ติดต่อเรา",
    contactSubtitle: "เราพร้อมดูแลสัตว์เลี้ยงตัวโปรดของคุณ ตลอดเวลาทำการ",
    namePlaceholder: "ชื่อ-นามสกุล",
    phonePlaceholder: "เบอร์โทรศัพท์",
    emailPlaceholder: "อีเมล",
    selectService: "เลือกบริการที่ต้องการ",
    svcCheckup: "วัคซีน/ตรวจสุขภาพ",
    svcEmergency: "ฉุกเฉิน",
    svcGrooming: "ตัดขน/อาบน้ำ",
    notesPlaceholder: "รายละเอียดเพิ่มเติม...",
    sendBtn: "ส่งข้อความ",
  },
  en: {
    sendError: "An error occurred. Please try again.",
    sendSuccess: "Message sent successfully",
    contactTitle: "Contact Us",
    contactSubtitle: "We are ready to care for your beloved pet during business hours.",
    namePlaceholder: "Full Name",
    phonePlaceholder: "Phone Number",
    emailPlaceholder: "Email",
    selectService: "Select desired service",
    svcCheckup: "Vaccine / Health Check",
    svcEmergency: "Emergency",
    svcGrooming: "Grooming / Bathing",
    notesPlaceholder: "Additional details...",
    sendBtn: "Send Message",
  }
};
