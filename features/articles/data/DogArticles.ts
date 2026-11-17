export type ArticleDef = {
  category: string;
  title: string;
  snippet: string;
  image: string;
};

export type DogArticlesData = {
  title: string;
  subtitle: string;
  loading: string;
  noArticles: string;
  allCat: string;
  adminCat: string;
  initialArticles: ArticleDef[];
  staticCategories: string[];
};

export const dogArticlesData: Record<'th' | 'en', DogArticlesData> = {
  th: {
    title: "🐶 Dog Articles : บทความสำหรับสุนัข",
    subtitle: "ข้อมูลสุขภาพและการเลี้ยงดูที่เชื่อถือได้จากสัตวแพทย์ Pawplan เพื่อคุณภาพชีวิตที่ดีที่สุดของเพื่อนซี้สี่ขาของคุณ",
    loading: "กำลังโหลด...",
    noArticles: "ไม่พบข้อมูลบทความในหมวดหมู่",
    allCat: "ทั้งหมด",
    adminCat: "📝 บทความ",
    initialArticles: [
      { category: "🐕 สุขภาพและการป้องกันโรค", title: "ภัยเงียบจากพยาธิหนอนหัวใจ: ป้องกันดีกว่ารักษา", snippet: "พยาธิหนอนหัวใจเป็นภัยร้ายที่คร่าชีวิตสุนัขได้ หากไม่ได้รับการป้องกันและรักษาที่ถูกต้อง ทำความเข้าใจอาการและการป้องกันเพื่อปกป้องเพื่อนรักของคุณ", image: "/assets/dog1.png" },
      { category: "🐕 สุขภาพและการป้องกันโรค", title: "วัคซีนจำเป็นสำหรับสุนัข: สิ่งที่เจ้าของมือใหม่ต้องรู้", snippet: "คู่มือฉบับสมบูรณ์สำหรับเจ้าของสุนัขมือใหม่เกี่ยวกับการฉีดวัคซีนที่จำเป็น เพื่อปกป้องลูกสุนัขของคุณจากโรคร้ายแรงต่างๆ", image: "/assets/dog2.png" },
      { category: "💊 โภชนาการอาหาร", title: "เช็คลิสต์! อาหารต้องห้าม 7 ชนิด ที่อันตรายถึงชีวิตสุนัข", snippet: "ปกป้องสุนัขของคุณให้ปลอดภัยจากอาหารอันตรายที่คุณอาจไม่รู้ เช็คลิสต์อาหาร 7 ชนิดที่ควรหลีกเลี่ยงเด็ดขาด", image: "/assets/dog3.png" },
      { category: "🦴 การดูแลเฉพาะช่วงวัย", title: "คู่มือการดูแลลูกสุนัข 3 เดือนแรก: วัคซีน อาหาร และการเข้าสังคม", snippet: "เริ่มต้นชีวิตที่ดีให้กับลูกสุนัขด้วยคู่มือการดูแลที่ครอบคลุมในช่วง 3 เดือนแรก ทั้งเรื่องวัคซีน โภชนาการ และการฝึกเข้าสังคม", image: "/assets/dog4.png" },
      { category: "🛁 การดูแลทั่วไปและการเลี้ยงดู", title: "วิธีแปรงฟันสุนัขง่าย ๆ ป้องกันหินปูน โดยไม่ต้องดมยา", snippet: "การดูแลสุขภาพช่องปากเป็นสิ่งสำคัญ เรียนรู้วิธีแปรงฟันสุนัขอย่างถูกวิธี เพื่อป้องกันปัญหาสุขภาพช่องปากและลดความจำเป็นในการวางยาสลบ", image: "/assets/dog5.png" },
      { category: "🩺 คลินิกพิเศษ", title: "5 สัญญาณเตือนโรคไตในสุนัขสูงวัย", snippet: "โรคไตเป็นโรคที่พบบ่อยในสุนัขสูงวัย เรียนรู้ 5 สัญญาณเตือนสำคัญ เพื่อการวินิจฉัยและการรักษาที่รวดเร็ว", image: "/assets/dog6.png" },
    ],
    staticCategories: ["ทั้งหมด", "🐕 สุขภาพและการป้องกันโรค", "💊 โภชนาการอาหาร", "🦴 การดูแลเฉพาะช่วงวัย", "🛁 การดูแลทั่วไปและการเลี้ยงดู", "🩺 คลินิกพิเศษ"]
  },
  en: {
    title: "🐶 Dog Articles",
    subtitle: "Reliable health and care information from Pawplan veterinarians for the best quality of life for your four-legged companion",
    loading: "Loading...",
    noArticles: "No articles found in category",
    allCat: "All",
    adminCat: "📝 Articles",
    initialArticles: [
      { category: "🐕 Health & Disease Prevention", title: "The Silent Threat of Heartworm: Prevention is Better than Cure", snippet: "Heartworm is a deadly threat that can kill dogs if not properly prevented and treated. Understand the symptoms and prevention to protect your beloved companion.", image: "/assets/dog1.png" },
      { category: "🐕 Health & Disease Prevention", title: "Essential Vaccines for Dogs: What New Owners Must Know", snippet: "A complete guide for new dog owners about essential vaccinations to protect your puppy from serious diseases.", image: "/assets/dog2.png" },
      { category: "💊 Nutrition & Diet", title: "Checklist! 7 Forbidden Foods Deadly to Dogs", snippet: "Keep your dog safe from dangerous foods you may not know about. The 7 foods to strictly avoid.", image: "/assets/dog3.png" },
      { category: "🦴 Age-Specific Care", title: "First 3-Month Puppy Care Guide: Vaccines, Nutrition & Socialization", snippet: "Start your puppy's life right with a comprehensive care guide covering the first 3 months — vaccines, nutrition, and socialization training.", image: "/assets/dog4.png" },
      { category: "🛁 General Care & Grooming", title: "Easy Dog Teeth Brushing — Prevent Tartar Without Anesthesia", snippet: "Oral health care is essential. Learn the correct way to brush your dog's teeth to prevent dental problems and reduce the need for sedation.", image: "/assets/dog5.png" },
      { category: "🩺 Special Clinics", title: "5 Warning Signs of Kidney Disease in Senior Dogs", snippet: "Kidney disease is common in older dogs. Learn 5 key warning signs for fast diagnosis and treatment.", image: "/assets/dog6.png" },
    ],
    staticCategories: ["All", "🐕 Health & Disease Prevention", "💊 Nutrition & Diet", "🦴 Age-Specific Care", "🛁 General Care & Grooming", "🩺 Special Clinics"]
  }
};
