export interface AboutClinicData {
  aboutImageAlt: string;
  aboutTitle: string;
  aboutText: string;
  aboutLi1: string;
  aboutLi2: string;
  aboutLi3: string;
}

export const aboutClinicData: Record<'th' | 'en', AboutClinicData> = {
  th: {
    aboutImageAlt: "ทีมสัตวแพทย์ Pawplan",
    aboutTitle: "การดูแลที่ใส่ใจ เริ่มต้นที่ความเข้าใจ",
    aboutText: "ทีมแพทย์ของเรานำโดย สพ.ญ. ปาริฉัตร วงศ์วาน (หมอจูน) ผู้มีประสบการณ์กว่า 10 ปี เราเน้นการดูแลแบบ Pawplan คือการวางแผนสุขภาพในระยะยาว ไม่ใช่เพียงแค่การรักษาอาการป่วยฉุกเฉินเท่านั้น",
    aboutLi1: "แพทย์เวชปฏิบัติหลักประจำคลินิก",
    aboutLi2: "ระบบนัดหมายที่แม่นยำ",
    aboutLi3: "เครื่องมือวินิจฉัยพื้นฐานครบครัน (X-ray, Lab)",
  },
  en: {
    aboutImageAlt: "Pawplan veterinary team",
    aboutTitle: "Caring with Heart, Starting with Understanding",
    aboutText: "Our team is led by Dr. Parichat Wongwan (Dr. June) with over 10 years of experience. We focus on the Pawplan approach — long-term health planning, not just emergency treatment.",
    aboutLi1: "Dedicated general practitioners at the clinic",
    aboutLi2: "Precise appointment scheduling system",
    aboutLi3: "Essential diagnostic equipment (X-ray, Lab)",
  }
};
