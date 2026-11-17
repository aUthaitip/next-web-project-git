// data/about-us/NewsActivitiesContent.ts
// แยก content ออกจาก component เพื่อให้จัดการ th/en ได้ง่าย

export interface NewsItem {
  id: 'modal-1' | 'modal-2' | 'modal-3' | 'modal-4' | 'modal-5' | 'modal-6';
  imgSrc: string;
  imgAlt: string;
  title: string;
  description: string;
}

export interface NewsModalContent {
  id: 'modal-1' | 'modal-2' | 'modal-3' | 'modal-4' | 'modal-5' | 'modal-6';
  imgSrc: string;
  imgAlt: string;
  title: string;
  paragraphs?: string[];
  listItems?: string[];
}

export interface NewsActivitiesData {
  title: string;
  readMore: string;
  newsItems: NewsItem[];
  modals: NewsModalContent[];
}

export const newsActivitiesData: Record<'th' | 'en', NewsActivitiesData> = {
  th: {
    title: '🔔 ข่าวสารและกิจกรรม',
    readMore: 'ดูเพิ่มเติม',
    newsItems: [
      {
        id: 'modal-1',
        imgSrc: '/assets/ข่าวสารและกิจกรรม_1.png',
        imgAlt: 'รูปภาพประกอบข่าวที่ 1',
        title: 'Pawplan คลินิก เปิดตัว "Smart Pet Care" นวัตกรรมใหม่',
        description:
          'โรงพยาบาลสัตว์ Pawplan ยกระดับมาตรฐานการรักษาสัตว์เลี้ยง สู่ \'The Best Outcome\' ด้วยการผสมผสานความเชี่ยวชาญของทีมสัตวแพทย์กับสุดยอดเทคโนโลยี...',
      },
      {
        id: 'modal-2',
        imgSrc: '/assets/ข่าวสารและกิจกรรม_2.png',
        imgAlt: 'รูปภาพประกอบข่าวที่ 2',
        title: 'ขอเชิญร่วมงาน "Pawplan Groomer" เฟ้นหาสุดยอดช่างตัดขน',
        description: 'เปิดรับสมัครแล้ววันนี้! การประกวดตัดขนสุนัข ชิงถ้วยรางวัลเกียรติยศและเงินรางวัลมากมาย...',
      },
      {
        id: 'modal-3',
        imgSrc: '/assets/ข่าวสารและกิจกรรม_3.png',
        imgAlt: 'รูปภาพประกอบข่าวที่ 3',
        title: "ทีมสัตวแพทย์ Pawplan รับมอบเกียรติบัตร 'คลินิกมาตรฐาน'",
        description: 'ตอกย้ำความมุ่งมั่นในการให้บริการที่เป็นเลิศและมีคุณภาพ ปลอดภัยสำหรับสัตว์เลี้ยงทุกตัว...',
      },
      {
        id: 'modal-4',
        imgSrc: '/assets/ข่าวสารและกิจกรรม_4.png',
        imgAlt: 'กิจกรรมบริจาคโลหิตสัตว์เลี้ยง',
        title: 'Pawplan ชวนบริจาคโลหิต "ต่อชีวิตให้เพื่อน"',
        description:
          'โครงการธนาคารเลือดสำหรับสัตว์เลี้ยง เชิญชวนเจ้าของพาสัตว์เลี้ยงสุขภาพดี น้ำหนักเกิน 20 กก. มาร่วมบริจาค...',
      },
      {
        id: 'modal-5',
        imgSrc: '/assets/ข่าวสารและกิจกรรม_5.png',
        imgAlt: 'โปรแกรมตรวจสุขภาพสัตว์เลี้ยงประจำปี',
        title: 'เริ่มแล้ว! โปรแกรมตรวจสุขภาพประจำปี 2568',
        description:
          'เพราะการป้องกันดีกว่ารักษา เริ่มต้นปีใหม่ด้วยสุขภาพที่ดีของน้องๆ กับแพ็กเกจตรวจสุขภาพในราคาพิเศษ...',
      },
      {
        id: 'modal-6',
        imgSrc: '/assets/ข่าวสารและกิจกรรม_6.png',
        imgAlt: 'ศูนย์กายภาพบำบัดสัตว์เลี้ยง Pawplan',
        title: 'เปิดแล้ว! ศูนย์กายภาพบำบัดและธาราบำบัด',
        description:
          'ดูแลสัตว์เลี้ยงหลังผ่าตัด หรือมีปัญหาข้อกระดูก ด้วยสระว่ายน้ำระบบเกลือและลู่วิ่งใต้น้ำ โดยผู้เชี่ยวชาญ...',
      },
    ],
    modals: [
      {
        id: 'modal-1',
        imgSrc: '/assets/ข่าวสารและกิจกรรม_1.png',
        imgAlt: 'รูปภาพประกอบข่าวที่ 1',
        title: 'Pawplan คลินิก เปิดตัว "Smart Pet Care" นวัตกรรมใหม่',
        paragraphs: [
          'โรงพยาบาลสัตว์ Pawplan มุ่งมั่นยกระดับมาตรฐานการรักษาสัตว์เลี้ยง สู่ "The Best Outcome" ด้วยการผสมผสานความเชี่ยวชาญของทีมสัตวแพทย์กับสุดยอดเทคโนโลยี',
          'เทคโนโลยี AI ช่วยวิเคราะห์โรค: เพิ่มความแม่นยำในการวินิจฉัยตั้งแต่เริ่มต้น ทำให้การรักษาเป็นไปอย่างรวดเร็วและตรงจุด',
          'ระบบจัดการคิวอัจฉริยะ (Smart Queue System): ออกแบบมาเพื่อลดเวลารอคอยอย่างมีประสิทธิภาพ',
        ],
      },
      {
        id: 'modal-2',
        imgSrc: '/assets/ข่าวสารและกิจกรรม_2.png',
        imgAlt: 'รูปภาพประกอบข่าวที่ 2',
        title: 'ขอเชิญร่วมงาน "Pawplan Groomer" เฟ้นหาสุดยอดช่างตัดขน',
        listItems: [
          'ชิงถ้วยรางวัลเกียรติยศ และเงินรางวัลรวมมูลค่ากว่า 100,000 บาท',
          'เปิดรับสมัครหลากหลายประเภท: มือใหม่ (Novice) และมืออาชีพ (Open Class)',
          'Workshop กับกรูมเมอร์ชื่อดัง',
        ],
      },
      {
        id: 'modal-3',
        imgSrc: '/assets/ข่าวสารและกิจกรรม_3.png',
        imgAlt: 'รูปภาพประกอบข่าวที่ 3',
        title: "ทีมสัตวแพทย์ Pawplan รับมอบเกียรติบัตร 'คลินิกมาตรฐาน'",
        paragraphs: ['ตอกย้ำความมุ่งมั่นในการให้บริการที่เป็นเลิศและมีคุณภาพ ปลอดภัยสำหรับสัตว์เลี้ยงทุกตัว'],
      },
      {
        id: 'modal-4',
        imgSrc: '/assets/ข่าวสารและกิจกรรม_4.png',
        imgAlt: 'กิจกรรมบริจาคโลหิตสัตว์เลี้ยง',
        title: 'Pawplan ชวนบริจาคโลหิต "ต่อชีวิตให้เพื่อน"',
        paragraphs: ['โครงการธนาคารเลือดสำหรับสัตว์เลี้ยง — สุนัข/แมว อายุ 1-7 ปี สุขภาพดี น้ำหนักเกิน 20 กก.'],
      },
      {
        id: 'modal-5',
        imgSrc: '/assets/ข่าวสารและกิจกรรม_5.png',
        imgAlt: 'โปรแกรมตรวจสุขภาพสัตว์เลี้ยงประจำปี',
        title: 'เริ่มแล้ว! โปรแกรมตรวจสุขภาพประจำปี 2568',
        paragraphs: ['แพ็กเกจรวม: ตรวจเลือด (CBC & Chemistry), ตรวจปัสสาวะ, เอ็กซเรย์ ในราคาพิเศษ'],
      },
      {
        id: 'modal-6',
        imgSrc: '/assets/ข่าวสารและกิจกรรม_6.png',
        imgAlt: 'ศูนย์กายภาพบำบัดสัตว์เลี้ยง Pawplan',
        title: 'เปิดแล้ว! ศูนย์กายภาพบำบัดและธาราบำบัด Pawplan',
        paragraphs: ['สระว่ายน้ำระบบเกลือและลู่วิ่งใต้น้ำ ลดแรงกดต่อข้อต่อได้ถึง 70-90% โดยผู้เชี่ยวชาญเฉพาะทาง'],
      },
    ],
  },
  en: {
    title: '🔔 News & Activities',
    readMore: 'Read More',
    newsItems: [
      {
        id: 'modal-1',
        imgSrc: '/assets/ข่าวสารและกิจกรรม_1.png',
        imgAlt: 'News image 1',
        title: 'Pawplan Clinic Launches "Smart Pet Care" Innovation',
        description:
          "Pawplan Veterinary Hospital elevates pet care standards toward 'The Best Outcome' by combining veterinary expertise with cutting-edge technology...",
      },
      {
        id: 'modal-2',
        imgSrc: '/assets/ข่าวสารและกิจกรรม_2.png',
        imgAlt: 'News image 2',
        title: 'Join "Pawplan Groomer" — Search for the Ultimate Groomer',
        description: 'Open for registration now! Dog grooming competition with prestigious trophies and prizes...',
      },
      {
        id: 'modal-3',
        imgSrc: '/assets/ข่าวสารและกิจกรรม_3.png',
        imgAlt: 'News image 3',
        title: "Pawplan Veterinary Team Receives 'Standard Clinic' Certificate",
        description: 'Reaffirming commitment to excellent, quality service that is safe for all pets...',
      },
      {
        id: 'modal-4',
        imgSrc: '/assets/ข่าวสารและกิจกรรม_4.png',
        imgAlt: 'Pet blood donation event',
        title: 'Pawplan Invites Blood Donation — "Give Life to a Friend"',
        description: 'Pet blood bank project — inviting owners to bring healthy pets over 20 kg to donate...',
      },
      {
        id: 'modal-5',
        imgSrc: '/assets/ข่าวสารและกิจกรรม_5.png',
        imgAlt: 'Annual pet health check program',
        title: 'Now Open! Annual Health Check Program 2025',
        description: 'Prevention is better than cure. Start the new year with your pet\'s health with special package prices...',
      },
      {
        id: 'modal-6',
        imgSrc: '/assets/ข่าวสารและกิจกรรม_6.png',
        imgAlt: 'Pawplan Physical Therapy Center',
        title: 'Now Open! Physical Therapy & Hydrotherapy Center',
        description:
          'Care for pets post-surgery or with joint issues with a salt-system pool and underwater treadmill by specialists...',
      },
    ],
    modals: [
      {
        id: 'modal-1',
        imgSrc: '/assets/ข่าวสารและกิจกรรม_1.png',
        imgAlt: 'News image 1',
        title: 'Pawplan Clinic Launches "Smart Pet Care" Innovation',
        paragraphs: [
          'Pawplan Veterinary Hospital is committed to elevating pet care standards toward "The Best Outcome" by combining veterinary expertise with cutting-edge technology',
          'AI-assisted disease analysis: Increases diagnostic accuracy from the start for faster, more precise treatment',
          'Smart Queue System: Designed to effectively reduce waiting times',
        ],
      },
      {
        id: 'modal-2',
        imgSrc: '/assets/ข่าวสารและกิจกรรม_2.png',
        imgAlt: 'News image 2',
        title: 'Join "Pawplan Groomer" — Search for the Ultimate Groomer',
        listItems: [
          'Compete for prestigious trophies and prize money totaling over 100,000 Baht',
          'Open to multiple categories: Novice and Open Class professionals',
          'Workshop with renowned groomers',
        ],
      },
      {
        id: 'modal-3',
        imgSrc: '/assets/ข่าวสารและกิจกรรม_3.png',
        imgAlt: 'News image 3',
        title: "Pawplan Veterinary Team Receives 'Standard Clinic' Certificate",
        paragraphs: ['Reaffirming commitment to excellent, quality service that is safe for all pets'],
      },
      {
        id: 'modal-4',
        imgSrc: '/assets/ข่าวสารและกิจกรรม_4.png',
        imgAlt: 'Pet blood donation event',
        title: 'Pawplan Invites Blood Donation — "Give Life to a Friend"',
        paragraphs: ['Pet blood bank project — dogs/cats aged 1-7 years, healthy, weighing over 20 kg'],
      },
      {
        id: 'modal-5',
        imgSrc: '/assets/ข่าวสารและกิจกรรม_5.png',
        imgAlt: 'Annual pet health check program',
        title: 'Now Open! Annual Health Check Program 2025',
        paragraphs: ['Package includes: Blood test (CBC & Chemistry), urinalysis, X-ray at special prices'],
      },
      {
        id: 'modal-6',
        imgSrc: '/assets/ข่าวสารและกิจกรรม_6.png',
        imgAlt: 'Pawplan Physical Therapy Center',
        title: 'Now Open! Physical Therapy & Hydrotherapy Center',
        paragraphs: ['Salt-system pool and underwater treadmill reduce joint pressure by 70-90%, by specialized therapists'],
      },
    ],
  },
};
