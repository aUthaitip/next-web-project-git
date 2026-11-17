export interface QuickCtaData {
  ctaOnlineTitle: string;
  ctaOnlineDesc: string;
  ctaOnlineBtn: string;
  ctaEmergencyTitle: string;
  ctaEmergencyBadge: string;
  ctaEmergencyDesc: string;
  ctaPopularTitle: string;
  ctaLink1: string;
  ctaLink2: string;
  ctaLink3: string;
}

export const quickCtaData: Record<'th' | 'en', QuickCtaData> = {
  th: {
    ctaOnlineTitle: "นัดหมายออนไลน์",
    ctaOnlineDesc: "จองเวลาพบสัตวแพทย์ได้ทันที เลือกบริการและวันที่สะดวก",
    ctaOnlineBtn: "จองนัดหมาย",
    ctaEmergencyTitle: "ฉุกเฉิน/ติดต่อด่วน",
    ctaEmergencyBadge: "โทรด่วน 24 ชม.",
    ctaEmergencyDesc: "บริการฉุกเฉินและแผนการรักษาเร่งด่วน",
    ctaPopularTitle: "บริการยอดนิยม",
    ctaLink1: "วัคซีน & เวชศาสตร์ป้องกัน",
    ctaLink2: "Grooming & Boarding",
    ctaLink3: "โปรไฟล์สัตวแพทย์",
  },
  en: {
    ctaOnlineTitle: "Online Appointment",
    ctaOnlineDesc: "Book a vet appointment instantly. Choose your service and preferred date.",
    ctaOnlineBtn: "Book Appointment",
    ctaEmergencyTitle: "Emergency / Urgent Contact",
    ctaEmergencyBadge: "24-Hour Hotline",
    ctaEmergencyDesc: "Emergency services and urgent treatment plans",
    ctaPopularTitle: "Popular Services",
    ctaLink1: "Vaccines & Preventive Medicine",
    ctaLink2: "Grooming & Boarding",
    ctaLink3: "Veterinarian Profiles",
  }
};
