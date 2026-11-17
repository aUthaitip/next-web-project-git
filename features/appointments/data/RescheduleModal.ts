export interface RescheduleModalData {
  title: string;
  newDateLabel: string;
  newTimeLabel: string;
  cancelBtn: string;
  savingBtn: string;
  confirmBtn: string;
}

export const rescheduleModalData: Record<'th' | 'en', RescheduleModalData> = {
  th: {
    title: "เลื่อนนัดหมาย",
    newDateLabel: "วันที่ใหม่",
    newTimeLabel: "เวลาใหม่",
    cancelBtn: "ยกเลิก",
    savingBtn: "กำลังบันทึก...",
    confirmBtn: "ยืนยัน"
  },
  en: {
    title: "Reschedule Appointment",
    newDateLabel: "New Date",
    newTimeLabel: "New Time",
    cancelBtn: "Cancel",
    savingBtn: "Saving...",
    confirmBtn: "Confirm"
  }
};
