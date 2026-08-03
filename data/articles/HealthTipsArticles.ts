export type ArticleDef = {
  category: string;
  title: string;
  snippet: string;
  image: string;
};

export type HealthTipsArticlesData = {
  title: string;
  subtitle: string;
  loading: string;
  noArticles: string;
  allCat: string;
  adminCat: string;
  initialArticles: ArticleDef[];
  staticCategories: string[];
};

export const healthTipsArticlesData: Record<'th' | 'en', HealthTipsArticlesData> = {
  th: {
    title: "Wellness Tips: เคล็ดลับสุขภาพและชีวิตยืนยาว",
    subtitle: "คู่มือการดูแลสัตว์เลี้ยงอย่างเข้าใจ เพื่อสุขภาพกายและใจที่ดีในทุกวัน เรียนรู้เคล็ดลับที่สัตวแพทย์ Pawplan อยากให้คุณรู้",
    loading: "กำลังโหลด...",
    noArticles: "ไม่พบข้อมูลบทความในหมวดหมู่",
    allCat: "ทั้งหมด",
    adminCat: "📝 บทความจาก Admin",
    initialArticles: [
      { category: "🦷 สุขภาพช่องปากและฟัน", title: "5 ขั้นตอนง่าย ๆ ในการแปรงฟันสุนัขและแมว", snippet: "โรคปริทันต์ (Periodontal Disease) เป็นภัยเงียบที่พบในสัตว์เลี้ยงกว่า 80% ที่มีอายุ 3 ปีขึ้นไป การแปรงฟันทุกวันคือการป้องกันที่ดีที่สุด แต่ทำอย่างไรให้ง่ายและสัตว์เลี้ยงยอมให้ความร่วมมือ?", image: "/assets/tip1.png" },
      { category: "🦷 สุขภาพช่องปากและฟัน", title: "อาหารและขนมช่วยขัดฟัน: ใช้ได้ผลจริงหรือไม่?", snippet: "ขนมขัดฟัน (Dental Chews) และอาหารสูตรดูแลช่องปาก (Dental Diets) เป็นตัวเลือกยอดนิยม แต่สิ่งเหล่านี้สามารถทดแทนการแปรงฟันได้จริงหรือ? มาฟังคำแนะนำจากสัตวแพทย์ Pawplan", image: "/assets/tip2.png" },
      { category: "⚖️ การควบคุมน้ำหนัก", title: "เช็คด่วน! สัตว์เลี้ยงของคุณแค่อวบหรือเข้าข่ายโรคอ้วน?", snippet: "โรคอ้วนนำไปสู่ปัญหาสุขภาพร้ายแรง เช่น เบาหวาน ข้อเสื่อม และโรคหัวใจ การประเมินน้ำหนักด้วย Body Condition Score (BCS) จึงสำคัญกว่าตัวเลขบนเครื่องชั่ง", image: "/assets/tip3.png" },
      { category: "💉 การป้องกันประจำปี", title: "โปรแกรมวัคซีนที่ครบถ้วน สำหรับสัตว์เลี้ยงในประเทศไทย", snippet: "การฉีดวัคซีนไม่ใช่แค่เรื่องของกฎหมาย (วัคซีนพิษสุนัขบ้า) แต่เป็นเกราะป้องกันโรคติดต่อร้ายแรงที่พบบ่อยในสภาพอากาศเขตร้อนของประเทศไทย", image: "/assets/tip4.png" },
      { category: "🧠 สุขภาพจิตและพฤติกรรม", title: "วิธีจัดสภาพแวดล้อมให้สัตว์เลี้ยงไม่เบื่อเมื่อต้องอยู่ลำพัง", snippet: "สัตว์เลี้ยงที่อยู่ลำพังอาจเกิดความเครียด นำไปสู่พฤติกรรมทำลายข้าวของ หรือภาวะซึมเศร้า การเสริมสร้างสภาพแวดล้อม (Environmental Enrichment) จึงสำคัญ", image: "/assets/tip5.png" },
      { category: "🌡️ การปฐมพยาบาลเบื้องต้น", title: "กล่องปฐมพยาบาลสัตว์เลี้ยง: สิ่งที่ต้องมีติดบ้านไว้เสมอ", snippet: "อุบัติเหตุเกิดขึ้นได้เสมอ การเตรียมชุดปฐมพยาบาลเบื้องต้นจะช่วยให้คุณรับมือกับเหตุฉุกเฉิน หรืออาการบาดเจ็บเล็กน้อยได้อย่างทันท่วงทีก่อนถึงมือหมอ", image: "/assets/tip6.png" },
    ],
    staticCategories: ["ทั้งหมด", "🦷 สุขภาพช่องปากและฟัน", "⚖️ การควบคุมน้ำหนัก", "💉 การป้องกันประจำปี", "🧠 สุขภาพจิตและพฤติกรรม", "🌡️ การปฐมพยาบาลเบื้องต้น"]
  },
  en: {
    title: "Wellness Tips: Health & Longevity",
    subtitle: "A thoughtful pet care guide for physical and mental well-being every day. Learn tips that Pawplan vets want you to know.",
    loading: "Loading...",
    noArticles: "No articles found in category",
    allCat: "All",
    adminCat: "📝 Articles from Admin",
    initialArticles: [
      { category: "🦷 Oral & Dental Health", title: "5 Easy Steps to Brush Your Dog's or Cat's Teeth", snippet: "Periodontal Disease is a silent threat found in over 80% of pets aged 3 and above. Daily brushing is the best prevention — but how do you make it easy and get your pet to cooperate?", image: "/assets/tip1.png" },
      { category: "🦷 Oral & Dental Health", title: "Dental Chews & Dental Diets: Do They Really Work?", snippet: "Dental Chews and Dental Diets are popular choices, but can they truly replace brushing? Hear from Pawplan veterinarians.", image: "/assets/tip2.png" },
      { category: "⚖️ Weight Management", title: "Evaluating Pet Obesity: Is Your Pet \"Chubby\" or Overweight?", snippet: "Excess weight leads to serious health problems like diabetes, arthritis, and heart disease. Weight assessment using Body Condition Score (BCS) matters more than just scale weight.", image: "/assets/tip3.png" },
      { category: "💉 Annual Prevention", title: "Complete Vaccination Schedule for Pets in Thailand", snippet: "Vaccination is not just a legal requirement (rabies vaccine) — it's the most important shield against serious infectious diseases in Thailand's tropical climate.", image: "/assets/tip4.png" },
      { category: "🧠 Mental Health & Behavior", title: "How to Enrich Your Pet's Environment So They Never Get Bored", snippet: "Pets left alone for long periods may develop boredom leading to destructive behavior or anxiety. Environmental enrichment that stimulates natural instincts is vital for mental health.", image: "/assets/tip5.png" },
      { category: "🌡️ Basic First Aid", title: "Pet First Aid Kit: What Must It Include?", snippet: "Accidents happen. Having a ready first aid kit for your pet can help manage injuries before reaching the clinic.", image: "/assets/tip6.png" },
    ],
    staticCategories: ["All", "🦷 Oral & Dental Health", "⚖️ Weight Management", "💉 Annual Prevention", "🧠 Mental Health & Behavior", "🌡️ Basic First Aid"]
  }
};
