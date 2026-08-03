export interface LocationSectionData {
  locationTitle: string;
}

export const locationSectionData: Record<'th' | 'en', LocationSectionData> = {
  th: {
    locationTitle: "แผนที่และที่ตั้ง",
  },
  en: {
    locationTitle: "Map & Location",
  }
};
