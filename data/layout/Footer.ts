export interface FooterData {
  clinicName: string;
  tagline: string;
  address: string;
  contactUs: string;
  phone: string;
  email: string;
  lineId: string;
  hours: string;
  hoursMonFri: string;
  hoursSat: string;
  hoursSun: string;
  quickLinks: string;
  bookAppointment: string;
  healthArticles: string;
  privacyPolicy: string;
  copyright: string;
}

export const footerData: Record<'th' | 'en', FooterData> = {
  th: {
    clinicName: "🐾 Pawplan คลินิก",
    tagline: "วางแผนสุขภาพที่ดีที่สุด",
    address: "เลขที่ 99/9 ถ.สุขใจ เขตสุขุมวิท กรุงเทพฯ",
    contactUs: "ติดต่อเรา",
    phone: "📞 โทร: 02-XXX-XXXX",
    email: "📧 pawplanclinic@gmail.com",
    lineId: "Line ID: @pawplan",
    hours: "เวลาทำการ",
    hoursMonFri: "จันทร์ - ศุกร์: 10:00 - 20:00 น.",
    hoursSat: "เสาร์: 11:00 - 20:00 น.",
    hoursSun: "ปิดทุกวันอาทิตย์",
    quickLinks: "ลิงก์ด่วน",
    bookAppointment: "จองนัดหมาย",
    healthArticles: "บทความสุขภาพ",
    privacyPolicy: "นโยบายความเป็นส่วนตัว",
    copyright: "© 2025 Pawplan Clinic. All rights reserved."
  },
  en: {
    clinicName: "🐾 Pawplan Clinic",
    tagline: "Plan the best health for your pet",
    address: "99/9 Sukhumvit Soi, Bangkok, Thailand",
    contactUs: "Contact Us",
    phone: "📞 Tel: 02-XXX-XXXX",
    email: "📧 pawplanclinic@gmail.com",
    lineId: "Line ID: @pawplan",
    hours: "Opening Hours",
    hoursMonFri: "Mon - Fri: 10:00 - 20:00",
    hoursSat: "Sat: 11:00 - 20:00",
    hoursSun: "Closed every Sunday",
    quickLinks: "Quick Links",
    bookAppointment: "Book Appointment",
    healthArticles: "Health Articles",
    privacyPolicy: "Privacy Policy",
    copyright: "© 2025 Pawplan Clinic. All rights reserved."
  }
};
