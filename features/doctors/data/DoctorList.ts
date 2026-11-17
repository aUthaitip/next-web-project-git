export type DoctorListData = {
  title: string;
  subtitle: string;
};

export const doctorListData: Record<'th' | 'en', DoctorListData> = {
  th: {
    title: "ทีมสัตวแพทย์ผู้เชี่ยวชาญที่ Pawplan",
    subtitle: "ที่ Pawplan เราเชื่อว่าการดูแลที่ดีที่สุดต้องมาจากความเข้าใจและความเชี่ยวชาญเฉพาะด้าน ทีมสัตวแพทย์ของเราพร้อมวางแผนการดูแลสุขภาพที่ดีที่สุดให้กับเพื่อนรักของคุณ",
  },
  en: {
    title: "Expert Veterinary Team at Pawplan",
    subtitle: "At Pawplan, we believe the best care comes from understanding and specialized expertise. Our veterinary team is ready to plan the best healthcare for your beloved pet.",
  }
};
