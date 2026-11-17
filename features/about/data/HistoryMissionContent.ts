// data/about-us/HistoryMissionContent.ts
// แยก content ออกจาก component เพื่อให้จัดการ th/en ได้ง่าย

export interface Mission {
  color: string;
  strongKey: string;
  descKey: string;
}

export interface HistoryMissionData {
  title: string;
  subtitle: string;
  clinicName: string;
  p1: string;
  p2: string;
  p3: string;
  adminTitle: string;
  missions: {
    color: string;
    strong: string;
    desc: string;
  }[];
}

export const historyMissionData: Record<'th' | 'en', HistoryMissionData> = {
  th: {
    title: '📄 ประวัติและพันธกิจ',
    subtitle: 'รู้จัก Pawplan คลินิกสัตว์เลี้ยง',
    clinicName: 'Pawplan คลินิกสัตว์เลี้ยง',
    p1: 'ก่อตั้งขึ้นด้วยความรักและความเข้าใจอย่างลึกซึ้งในความผูกพันระหว่างคนกับสัตว์เลี้ยง สพ.ญ. ปาริฉัตร วงศ์วาน (ผู้บริหาร) และทีมงาน ได้ร่วมกันสร้างสรรค์พื้นที่ที่ไม่ได้เป็นเพียงแค่คลินิก แต่เป็นเหมือน "บ้านหลังที่สอง" ที่อบอุ่นและปลอดภัยสำหรับสัตว์เลี้ยงที่คุณรัก',
    p2: 'เราเชื่อว่าสุขภาพที่ดีของสัตว์เลี้ยงต้องเริ่มต้นจากการดูแลที่ใส่ใจและได้มาตรฐาน Pawplan จึงมุ่งมั่นที่จะเป็นส่วนหนึ่งในการวางแผนและดูแลสุขภาพที่ดีที่สุดให้สัตว์เลี้ยงของคุณ ด้วยการให้บริการตรวจวินิจฉัยและรักษาพยาบาลที่ครอบคลุม โดยมีสัตวแพทย์ผู้เชี่ยวชาญและบุคลากรที่เปี่ยมด้วยประสบการณ์ พร้อมด้วยเครื่องมือและอุปกรณ์ทางการแพทย์ที่ทันสมัย เพื่อให้การรักษาเป็นไปอย่างมีประสิทธิภาพ',
    p3: 'ตั้งแต่วันแรกที่เปิดทำการ Pawplan ได้ยึดมั่นในพันธกิจ ที่จะมอบการดูแลสุขภาพสัตว์เลี้ยงด้วยมาตรฐานระดับสูง ควบคู่ไปกับการสร้างความสัมพันธ์ที่อบอุ่นและเป็นกันเองกับเจ้าของ เพื่อให้คุณมั่นใจว่าสัตว์เลี้ยงของคุณจะได้รับสิ่งที่ดีที่สุดเสมอ',
    adminTitle: '📝 ข้อมูลเพิ่มเติมจากคลินิก',
    missions: [
      {
        color: '#0d9488',
        strong: 'มอบการดูแลที่ได้มาตรฐาน:',
        desc: 'ให้บริการตรวจวินิจฉัยและรักษาพยาบาลด้วยมาตรฐานวิชาชีพชั้นสูง พร้อมเทคโนโลยีทางการแพทย์ที่ทันสมัย',
      },
      {
        color: '#0ea5e9',
        strong: 'เน้นการป้องกันและวางแผนสุขภาพ:',
        desc: 'มุ่งเน้นการให้ความรู้และคำปรึกษาแก่เจ้าของ เพื่อป้องกันโรค และวางแผนการดูแลสุขภาพสัตว์เลี้ยงในระยะยาวอย่างเหมาะสมกับช่วงวัย',
      },
      {
        color: '#8b5cf6',
        strong: 'สร้างสภาพแวดล้อมที่อบอุ่นและเป็นกันเอง:',
        desc: 'ให้สัตว์เลี้ยงและเจ้าของรู้สึกสบายใจ ปลอดภัย และได้รับการต้อนรับอย่างอบอุ่นจากทีมงานของเรา',
      },
      {
        color: '#ec4899',
        strong: 'รักและใส่ใจเหมือนสมาชิกในครอบครัว:',
        desc: 'ปฏิบัติต่อสัตว์เลี้ยงทุกตัวด้วยความรัก ความเมตตา และความเข้าใจ ในฐานะสมาชิกคนสำคัญในครอบครัวของคุณ',
      },
    ],
  },
  en: {
    title: '📄 History & Mission',
    subtitle: 'Get to Know Pawplan Pet Clinic',
    clinicName: 'Pawplan Pet Clinic',
    p1: 'Founded with deep love and understanding of the bond between humans and their pets, Dr. Parichat Wongwan and the team created a space that is not just a clinic, but a warm and safe "second home" for your beloved animals.',
    p2: 'We believe good pet health starts with attentive, professional care. Pawplan is committed to being part of planning and delivering the best healthcare for your pet — with comprehensive diagnostic and treatment services, experienced specialists, and modern medical equipment for effective treatment.',
    p3: 'Since opening day, Pawplan has remained committed to providing high-standard pet healthcare alongside warm, friendly relationships with owners, so you can always trust that your pet receives the very best.',
    adminTitle: '📝 Additional Information from the Clinic',
    missions: [
      {
        color: '#0d9488',
        strong: 'Providing Standard-of-Care:',
        desc: 'Delivering diagnostic and treatment services at the highest professional standards with modern medical technology',
      },
      {
        color: '#0ea5e9',
        strong: 'Emphasizing Prevention & Health Planning:',
        desc: 'Focused on educating and advising owners to prevent disease and plan long-term pet healthcare appropriate for each life stage',
      },
      {
        color: '#8b5cf6',
        strong: 'Creating a Warm, Welcoming Environment:',
        desc: 'Making pets and owners feel comfortable, safe, and warmly welcomed by our team',
      },
      {
        color: '#ec4899',
        strong: 'Loving Care Like Family:',
        desc: 'Treating every pet with love, compassion, and understanding as an important member of your family',
      },
    ],
  },
};
