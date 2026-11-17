export interface HeaderData {
  nav: {
    home: string;
    aboutUs: string;
    historyMission: string;
    newsActivities: string;
    awardsAccreditations: string;
    contactUs: string;
    services: string;
    bookAppointment: string;
    petCare: string;
    shop: string;
    clinicDoctors: string;
    medicalServices: string;
    veterinaryTeam: string;
    articles: string;
    dogArticles: string;
    catArticles: string;
    healthTips: string;
    login: string;
    myAppointments: string;
    logout: string;
    editProfile: string;
  };
  common: {
    switchToEnglish: string;
    switchToThai: string;
    menu: string;
  };
}

export const headerData: Record<'th' | 'en', HeaderData> = {
  th: {
    nav: {
      home: "หน้าแรก",
      aboutUs: "เกี่ยวกับเรา",
      historyMission: "ประวัติและพันธกิจ",
      newsActivities: "ข่าวสารและกิจกรรม",
      awardsAccreditations: "รางวัลและการรับรอง",
      contactUs: "ติดต่อเรา",
      services: "บริการ",
      bookAppointment: "จองนัดหมาย",
      petCare: "Pawplan Pet Care",
      shop: "Pawplan Shop",
      clinicDoctors: "คลินิกและแพทย์",
      medicalServices: "บริการทางการแพทย์",
      veterinaryTeam: "ทีมสัตวแพทย์",
      articles: "บทความ",
      dogArticles: "บทความสุนัข",
      catArticles: "บทความแมว",
      healthTips: "เคล็ดลับสุขภาพ",
      login: "เข้าสู่ระบบ",
      myAppointments: "นัดหมายของฉัน",
      logout: "ออกจากระบบ",
      editProfile: "แก้ไขโปรไฟล์"
    },
    common: {
      switchToEnglish: "Switch to English",
      switchToThai: "เปลี่ยนเป็นไทย",
      menu: "เมนู"
    }
  },
  en: {
    nav: {
      home: "Home",
      aboutUs: "About Us",
      historyMission: "History & Mission",
      newsActivities: "News & Activities",
      awardsAccreditations: "Awards & Accreditations",
      contactUs: "Contact Us",
      services: "Services",
      bookAppointment: "Book Appointment",
      petCare: "Pawplan Pet Care",
      shop: "Pawplan Shop",
      clinicDoctors: "Clinic & Doctors",
      medicalServices: "Medical Services",
      veterinaryTeam: "Veterinary Team",
      articles: "Articles",
      dogArticles: "Dog Articles",
      catArticles: "Cat Articles",
      healthTips: "Health Tips",
      login: "Login",
      myAppointments: "My Appointments",
      logout: "Logout",
      editProfile: "Edit Profile"
    },
    common: {
      switchToEnglish: "Switch to English",
      switchToThai: "เปลี่ยนเป็นไทย",
      menu: "Menu"
    }
  }
};
