// data/about-us/AwardsAccreditationsContent.ts
// แยก content ออกจาก component เพื่อให้จัดการ th/en ได้ง่าย

export interface Award {
  imageSrc: string;
  imageAlt: string;
  title: string;
  description: string;
}

export interface AwardsAccreditationsData {
  title: string;
  subtitle: string;
  slides: Award[][];
}

export const awardsAccreditationsData: Record<'th' | 'en', AwardsAccreditationsData> = {
  th: {
    title: '🏆 รางวัลและการรับรอง',
    subtitle: 'มุ่งสู่ความเป็นเลิศ ในการดูแลสุขภาพและยกระดับคุณภาพชีวิตสัตว์เลี้ยง',
    slides: [
      // Slide 1 (Grid 1)
      [
        {
          imageSrc: 'รางวัล1.png',
          imageAlt: 'Accredited Veterinary Hospital',
          title: 'การรับรองมาตรฐานสถานพยาบาลสัตว์',
          description:
            'Pawplan คลินิก ได้ผ่านการรับรองมาตรฐานสถานพยาบาลสัตว์ จากสภาวิชาชีพการสัตวแพทย์ มั่นใจได้ในความสะอาด ปลอดภัยของสถานที่ และเครื่องมือที่ทันสมัยตามหลักมาตรฐานสากล',
        },
        {
          imageSrc: 'รางวัล2.png',
          imageAlt: "Pet Owner's Choice Award",
          title: 'รางวัลคลินิกขวัญใจเจ้าของสัตว์เลี้ยง',
          description:
            'ได้รับการโหวตจากเจ้าของสัตว์เลี้ยง ให้เป็นคลินิกที่ให้บริการยอดเยี่ยมและดูแลเอาใจใส่เสมือนเป็นสมาชิกในครอบครัว ประจำปี 2024 จากเว็บไซต์เกี่ยวกับสัตว์เลี้ยงชั้นนำ',
        },
        {
          imageSrc: 'รางวัล3.png',
          imageAlt: 'Cat-Friendly Clinic',
          title: 'การรับรอง "คลินิกที่เป็นมิตรต่อแมว"',
          description:
            'ได้รับการรับรองมาตรฐาน Gold จากองค์กร International Society of Feline Medicine - ISFM โดยมีการจัดสรรพื้นที่รอตรวจ ห้องตรวจ และขั้นตอนการรักษาที่ช่วยลดความเครียดให้แก่น้องแมวโดยเฉพาะ',
        },
      ],
      // Slide 2 (Grid 2)
      [
        {
          imageSrc: 'รางวัล4.png',
          imageAlt: 'Award',
          title: 'ทีมสัตวแพทย์ผู้เชี่ยวชาญเฉพาะทาง',
          description:
            'ทีมสัตวแพทย์ของเราประกอบด้วยผู้เชี่ยวชาญที่ได้รับการรับรองวุฒิบัตรเฉพาะทางในด้านต่างๆ เช่น อายุรกรรม, ศัลยกรรมกระดูก, โรคผิวหนัง เพื่อการวินิจฉัยและการรักษาที่แม่นยำที่สุด',
        },
        {
          imageSrc: 'รางวัล5.png',
          imageAlt: 'Award',
          title: 'มาตรฐานห้องปฏิบัติการ (Lab) ภายใน',
          description:
            'ได้รับการรับรองมาตรฐานห้องปฏิบัติการ ISO สำหรับการตรวจเลือดและวินิจฉัยโรคภายในคลินิก ทำให้ได้ผลที่รวดเร็ว แม่นยำ และช่วยให้การรักษามีประสิทธิภาพสูงสุด',
        },
        {
          imageSrc: 'รางวัล6.png',
          imageAlt: 'Award',
          title: 'รางวัลการบริการลูกค้ายอดเยี่ยม',
          description:
            'ได้รับรางวัลด้านการบริการลูกค้าที่เป็นเลิศ จาก องค์กรประเมินผล สะท้อนถึงความมุ่งมั่นของเราในการสื่อสารที่ชัดเจน ให้ข้อมูลครบถ้วน และการให้บริการที่สร้างความประทับใจให้แก่เจ้าของสัตว์เลี้ยง',
        },
      ],
    ],
  },
  en: {
    title: '🏆 Awards & Accreditations',
    subtitle: 'Striving for excellence in pet healthcare and improving the quality of life for every animal',
    slides: [
      // Slide 1 (Grid 1)
      [
        {
          imageSrc: 'รางวัล1.png',
          imageAlt: 'Accredited Veterinary Hospital',
          title: 'Veterinary Hospital Accreditation',
          description:
            'Pawplan Clinic has been accredited by the Veterinary Council of Thailand, ensuring cleanliness, safety, and modern equipment meeting international standards.',
        },
        {
          imageSrc: 'รางวัล2.png',
          imageAlt: "Pet Owner's Choice Award",
          title: "Pet Owners' Favorite Clinic Award",
          description:
            "Voted by pet owners as the clinic providing outstanding service and family-like care in 2024, recognized by a leading pet website.",
        },
        {
          imageSrc: 'รางวัล3.png',
          imageAlt: 'Cat-Friendly Clinic',
          title: '"Cat-Friendly Clinic" Certification',
          description:
            'Awarded Gold certification by the International Society of Feline Medicine (ISFM) for dedicated waiting areas, exam rooms, and procedures designed to reduce stress in cats.',
        },
      ],
      // Slide 2 (Grid 2)
      [
        {
          imageSrc: 'รางวัล4.png',
          imageAlt: 'Award',
          title: 'Specialized Veterinary Team',
          description:
            'Our veterinary team includes board-certified specialists in fields such as internal medicine, orthopedic surgery, and dermatology for the most accurate diagnosis and treatment.',
        },
        {
          imageSrc: 'รางวัล5.png',
          imageAlt: 'Award',
          title: 'In-House Laboratory (ISO Standard)',
          description:
            'ISO-certified in-house laboratory for blood tests and disease diagnosis, delivering fast, accurate results for the most effective treatment.',
        },
        {
          imageSrc: 'รางวัล6.png',
          imageAlt: 'Award',
          title: 'Outstanding Customer Service Award',
          description:
            'Recognized for exceptional customer service by an independent evaluation organization, reflecting our commitment to clear communication, thorough information, and memorable service for pet owners.',
        },
      ],
    ],
  },
};
