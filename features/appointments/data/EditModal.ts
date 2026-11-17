export interface EditModalData {
  title: string;
  subtitle: string;
  petNameLabel: string;
  petTypeLabel: string;
  petOptions: {
    dog: string;
    cat: string;
    rabbit: string;
    bird: string;
    other: string;
  };
  serviceLabel: string;
  serviceSelect: string;
  services: {
    svc1: string;
    svc2: string;
    svc3: string;
    svc4: string;
    svc5: string;
  };
  notesLabel: string;
  cancelBtn: string;
  savingBtn: string;
  confirmBtn: string;
}

export const editModalData: Record<'th' | 'en', EditModalData> = {
  th: {
    title: "แก้ไขนัดหมาย",
    subtitle: "แก้ไขข้อมูลของ",
    petNameLabel: "ชื่อสัตว์เลี้ยง",
    petTypeLabel: "ประเภทสัตว์เลี้ยง",
    petOptions: {
      dog: "🐶 สุนัข",
      cat: "🐱 แมว",
      rabbit: "🐰 กระต่าย",
      bird: "🐦 นก",
      other: "🐾 อื่นๆ"
    },
    serviceLabel: "บริการ",
    serviceSelect: "กรุณาเลือกบริการ",
    services: {
      svc1: "ตรวจสุขภาพทั่วไป",
      svc2: "ฉีดวัคซีน",
      svc3: "ทำหมัน",
      svc4: "ทันตกรรม",
      svc5: "อื่นๆ"
    },
    notesLabel: "หมายเหตุ",
    cancelBtn: "ยกเลิก",
    savingBtn: "กำลังบันทึก...",
    confirmBtn: "ยืนยัน"
  },
  en: {
    title: "Edit Appointment",
    subtitle: "Editing info for",
    petNameLabel: "Pet Name",
    petTypeLabel: "Pet Type",
    petOptions: {
      dog: "Dog",
      cat: "Cat",
      rabbit: "Rabbit",
      bird: "Bird",
      other: "Other"
    },
    serviceLabel: "Service",
    serviceSelect: "Please select a service",
    services: {
      svc1: "General Checkup",
      svc2: "Vaccination",
      svc3: "Spay/Neuter",
      svc4: "Dentistry",
      svc5: "Other"
    },
    notesLabel: "Notes",
    cancelBtn: "Cancel",
    savingBtn: "Saving...",
    confirmBtn: "Confirm"
  }
};
