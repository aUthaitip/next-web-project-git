export interface ProfileFormData {
  title: string;
  subtitle: string;
  nameLabel: string;
  emailLabel: string;
  phoneLabel: string;
  changePasswordTitle: string;
  currentPasswordLabel: string;
  newPasswordLabel: string;
  confirmPasswordLabel: string;
  saveBtn: string;
  savingBtn: string;
  backBtn: string;
  requiredFields: string;
  passwordMismatch: string;
  passwordTooShort: string;
  loadError: string;
  uploadingText: string;
  uploadFailed: string;
  imageFileOnly: string;
  uploadSuccess: string;
  saveError: string;
  updateSuccess: string;
  connectError: string;
  loading: string;
  removePhoto: string;
}

export const profileFormData: Record<'th' | 'en', ProfileFormData> = {
  th: {
    title: "โปรไฟล์ส่วนตัว",
    subtitle: "จัดการข้อมูลส่วนตัวและรหัสผ่านของคุณ",
    nameLabel: "ชื่อ-นามสกุล",
    emailLabel: "อีเมล",
    phoneLabel: "เบอร์โทรศัพท์",
    changePasswordTitle: "เปลี่ยนรหัสผ่าน",
    currentPasswordLabel: "รหัสผ่านปัจจุบัน",
    newPasswordLabel: "รหัสผ่านใหม่",
    confirmPasswordLabel: "ยืนยันรหัสผ่านใหม่",
    saveBtn: "บันทึกข้อมูล",
    savingBtn: "กำลังบันทึก...",
    backBtn: "ย้อนกลับ",
    requiredFields: "กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วน",
    passwordMismatch: "รหัสผ่านใหม่ไม่ตรงกัน",
    passwordTooShort: "รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร",
    loadError: "ไม่สามารถโหลดข้อมูลผู้ใช้ได้",
    uploadingText: "กำลังอัปโหลด...",
    uploadFailed: "อัปโหลดรูปภาพล้มเหลว",
    imageFileOnly: "กรุณาอัปโหลดไฟล์รูปภาพเท่านั้น",
    uploadSuccess: "อัปโหลดรูปภาพสำเร็จ",
    saveError: "บันทึกข้อมูลไม่สำเร็จ",
    updateSuccess: "อัปเดตข้อมูลสำเร็จ",
    connectError: "เกิดข้อผิดพลาดในการเชื่อมต่อ",
    loading: "กำลังโหลด...",
    removePhoto: "ลบรูปภาพ"
  },
  en: {
    title: "My Profile",
    subtitle: "Manage your personal information and password",
    nameLabel: "Full Name",
    emailLabel: "Email Address",
    phoneLabel: "Phone Number",
    changePasswordTitle: "Change Password",
    currentPasswordLabel: "Current Password",
    newPasswordLabel: "New Password",
    confirmPasswordLabel: "Confirm New Password",
    saveBtn: "Save Changes",
    savingBtn: "Saving...",
    backBtn: "Back",
    requiredFields: "Please fill in all required fields",
    passwordMismatch: "Passwords do not match",
    passwordTooShort: "Password must be at least 8 characters",
    loadError: "Failed to load user profile",
    uploadingText: "Uploading...",
    uploadFailed: "Failed to upload image",
    imageFileOnly: "Please upload image files only",
    uploadSuccess: "Image uploaded successfully",
    saveError: "Failed to save profile",
    updateSuccess: "Profile updated successfully",
    connectError: "Connection error occurred",
    loading: "Loading...",
    removePhoto: "Remove Photo"
  }
};
