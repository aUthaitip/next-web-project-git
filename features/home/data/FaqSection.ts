export interface FaqSectionData {
  faqTitle: string;
  faq1q: string;
  faq1a: string;
  faq2q: string;
  faq2a: string;
}

export const faqSectionData: Record<'th' | 'en', FaqSectionData> = {
  th: {
    faqTitle: "คำถามที่พบบ่อย",
    faq1q: "ต้องเตรียมอะไรบ้างเมื่อต้องพาสัตว์เลี้ยงมาตรวจ?",
    faq1a: "กรุณานำประวัติสุขภาพ/วัคซีน และตัวอย่างปัสสาวะ/อุจจาระ (ถ้ามี) เพื่อการวินิจฉัยที่แม่นยำ",
    faq2q: "วิธีติดต่อฉุกเฉินในเวลากลางคืน?",
    faq2a: "ท่านสามารถโทรติดต่อเลขด่วน 24 ชม. ได้ที่เบอร์ 02-XXX-XXXX หรือช่องทาง Line Official",
  },
  en: {
    faqTitle: "Frequently Asked Questions",
    faq1q: "What should I prepare when bringing my pet for a check-up?",
    faq1a: "Please bring health/vaccination records and urine/stool samples (if available) for accurate diagnosis.",
    faq2q: "How to reach emergency services at night?",
    faq2a: "You can call our 24-hour emergency number at 02-XXX-XXXX or via Line Official.",
  }
};
