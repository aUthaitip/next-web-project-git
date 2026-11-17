export interface SpecializedFeaturesData {
  specializedTitle: string;
  eyeCareTitle: string;
  eyeCareDesc: string;
  neuroCenterTitle: string;
  neuroCenterDesc: string;
  cardioCenterTitle: string;
  cardioCenterDesc: string;
  diagImagingTitle: string;
  diagImagingDesc: string;
}

export const specializedFeaturesData: Record<'th' | 'en', SpecializedFeaturesData> = {
  th: {
    specializedTitle: "ศูนย์เฉพาะทางที่พร้อมให้บริการคุณ",
    eyeCareTitle: "Eye Care Center",
    eyeCareDesc: "มองเห็นความรักผ่านดวงตาที่สดใส",
    neuroCenterTitle: "Neurological Center",
    neuroCenterDesc: "ให้เขากลับมาใช้ชีวิตอย่างมีความสุขอีกครั้ง",
    cardioCenterTitle: "Cardio Center",
    cardioCenterDesc: "คลีนิคจัดการโรคหัวใจได้ทุกระยะ",
    diagImagingTitle: "Diagnostic Imaging",
    diagImagingDesc: "วินิจฉัยแม่นยำเพื่อการรักษาที่ตรงจุด",
  },
  en: {
    specializedTitle: "Specialized Centers Ready to Serve You",
    eyeCareTitle: "Eye Care Center",
    eyeCareDesc: "See love through bright, healthy eyes",
    neuroCenterTitle: "Neurological Center",
    neuroCenterDesc: "Helping them live a happy life again",
    cardioCenterTitle: "Cardio Center",
    cardioCenterDesc: "Comprehensive cardiac care at every stage",
    diagImagingTitle: "Diagnostic Imaging",
    diagImagingDesc: "Accurate diagnosis for precise treatment",
  }
};
