export interface LoginData {
  systemSubtitle: string;
  tabLogin: string;
  tabRegister: string;
  emailLabel: string;
  passwordLabel: string;
  loginBtn: string;
  loggingIn: string;
  noAccount: string;
  goRegister: string;
  nameLabel: string;
  namePlaceholder: string;
  phoneLabel: string;
  regPasswordLabel: string;
  regPasswordPlaceholder: string;
  confirmPasswordLabel: string;
  registerBtn: string;
  registering: string;
  hasAccount: string;
  goLogin: string;
  passwordMismatch: string;
  registerSuccess: string;
  genericError: string;
  emailPlaceholder: string;
  passwordPlaceholder: string;
  phonePlaceholder: string;
}

export const loginData: Record<'th' | 'en', LoginData> = {
  th: {
    systemSubtitle: "ระบบจัดการนัดหมายสัตว์เลี้ยง",
    tabLogin: "เข้าสู่ระบบ",
    tabRegister: "สมัครสมาชิก",
    emailLabel: "อีเมล",
    passwordLabel: "รหัสผ่าน",
    loginBtn: "เข้าสู่ระบบ",
    loggingIn: "กำลังเข้าสู่ระบบ...",
    noAccount: "ยังไม่มีบัญชี?",
    goRegister: "สมัครสมาชิก",
    nameLabel: "ชื่อ-นามสกุล",
    namePlaceholder: "สมชาย ใจดี",
    phoneLabel: "เบอร์โทรศัพท์",
    regPasswordLabel: "รหัสผ่าน",
    regPasswordPlaceholder: "อย่างน้อย 8 ตัวอักษร",
    confirmPasswordLabel: "ยืนยันรหัสผ่าน",
    registerBtn: "สมัครสมาชิก",
    registering: "กำลังสมัคร...",
    hasAccount: "มีบัญชีแล้ว?",
    goLogin: "เข้าสู่ระบบ",
    passwordMismatch: "รหัสผ่านไม่ตรงกัน",
    registerSuccess: "สมัครสมาชิกสำเร็จ! กรุณาเข้าสู่ระบบ",
    genericError: "เกิดข้อผิดพลาด",
    emailPlaceholder: "example@email.com",
    passwordPlaceholder: "••••••••",
    phonePlaceholder: "08X-XXX-XXXX"
  },
  en: {
    systemSubtitle: "Pet Appointment Management System",
    tabLogin: "Login",
    tabRegister: "Register",
    emailLabel: "Email",
    passwordLabel: "Password",
    loginBtn: "Login",
    loggingIn: "Logging in...",
    noAccount: "Don't have an account?",
    goRegister: "Register",
    nameLabel: "Full Name",
    namePlaceholder: "John Doe",
    phoneLabel: "Phone Number",
    regPasswordLabel: "Password",
    regPasswordPlaceholder: "At least 8 characters",
    confirmPasswordLabel: "Confirm Password",
    registerBtn: "Register",
    registering: "Registering...",
    hasAccount: "Already have an account?",
    goLogin: "Login",
    passwordMismatch: "Passwords do not match",
    registerSuccess: "Registration successful! Please log in.",
    genericError: "An error occurred",
    emailPlaceholder: "example@email.com",
    passwordPlaceholder: "••••••••",
    phonePlaceholder: "08X-XXX-XXXX"
  }
};
