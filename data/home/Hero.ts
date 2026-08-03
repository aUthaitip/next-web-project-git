export interface HeroData {
  heroSubtitle: string;
  heroDesc: string;
  heroImageAlt: string;
}

export const heroData: Record<'th' | 'en', HeroData> = {
  th: {
    heroSubtitle: "สร้างความรู้สึกว่าคลินิกคือบ้านหลังที่สองของสัตว์เลี้ยง",
    heroDesc: "ดูแลสมาชิกครอบครัวด้วยหัวใจ วางแผนป้องกันทุกช่วงวัย เพื่อสุขภาพที่แข็งแรงและรอยยิ้มที่สดใสของเพื่อนรัก",
    heroImageAlt: "คลินิกสัตวแพทย์ Pawplan",
  },
  en: {
    heroSubtitle: "Making the clinic feel like a second home for your pets",
    heroDesc: "Caring for your family members with heart, planning prevention for every stage of life for the health and happiness of your beloved companion",
    heroImageAlt: "Pawplan veterinary clinic",
  }
};
