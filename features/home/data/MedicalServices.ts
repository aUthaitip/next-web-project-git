export interface MedicalServicesData {
  svc1Title: string;
  svc1Desc: string;
  svc2Title: string;
  svc2Desc: string;
  svc3Title: string;
  svc3Desc: string;
  svc4Title: string;
  svc4Desc: string;
  svc5Title: string;
  svc5Desc: string;
  servicesTitle: string;
}

export const medicalServicesData: Record<'th' | 'en', MedicalServicesData> = {
  th: {
    svc1Title: "เวชศาสตร์ป้องกัน",
    svc1Desc: "การฉีดวัคซีน, ตรวจสุขภาพประจำปี และการให้คำปรึกษาด้านโภชนาการ",
    svc2Title: "คลินิกทันตกรรมย่อย",
    svc2Desc: "บริการขูดหินปูน ดูแลช่องปาก และป้องกันโรคเหงือก",
    svc3Title: "คลินิกโรคหัวใจ",
    svc3Desc: "วินิจฉัยและรักษาโรคหัวใจในสัตว์เลี้ยง",
    svc4Title: "Pawplan Pet Care",
    svc4Desc: "บริการอาบน้ำ ตัดขน และบริการฝากเลี้ยงระยะสั้น",
    svc5Title: "Other Services",
    svc5Desc: "ฝังไมโครชิป และบริการอื่นๆ ที่ตอบโจทย์คุณ",
    servicesTitle: "บริการทางการแพทย์พื้นฐาน",
  },
  en: {
    svc1Title: "Preventive Medicine",
    svc1Desc: "Vaccinations, annual health check-ups, and nutritional consultations",
    svc2Title: "Dental Clinic",
    svc2Desc: "Scaling, oral care, and gum disease prevention",
    svc3Title: "Cardiology Clinic",
    svc3Desc: "Diagnosis and treatment of heart conditions in pets",
    svc4Title: "Pawplan Pet Care",
    svc4Desc: "Bathing, grooming, and short-term pet boarding services",
    svc5Title: "Other Services",
    svc5Desc: "Microchip implantation and other services tailored for you",
    servicesTitle: "Core Medical Services",
  }
};
