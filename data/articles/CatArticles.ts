export type ArticleDef = {
  category: string;
  title: string;
  snippet: string;
  image: string;
};

export type CatArticlesData = {
  title: string;
  subtitle: string;
  noArticles: string;
  allCat: string;
  staticArticles: ArticleDef[];
  staticCategories: string[];
};

export const catArticlesData: Record<'th' | 'en', CatArticlesData> = {
  th: {
    title: "🐱 Cat Articles : บทความสำหรับแมว",
    subtitle: "ข้อมูลเฉพาะสำหรับแมว โดยทีมสัตวแพทย์ที่เข้าใจพฤติกรรมของเหมียวอย่างแท้จริง มั่นใจด้วยการรับรอง Cat Friendly Gold Certification",
    noArticles: "ไม่พบข้อมูลบทความในหมวดหมู่",
    allCat: "ทั้งหมด",
    staticArticles: [
      { category: "🩺 สุขภาพและการป้องกันโรค", title: "ภาวะไตวายในแมว: โรคเงียบที่ต้องเฝ้าระวัง", snippet: "ภาวะไตวาย (Chronic Kidney Disease - CKD) เป็นโรคที่พบบ่อยและเป็นสาเหตุการเสียชีวิตอันดับต้น ๆ ในแมวสูงวัย โรคนี้มักแสดงอาการเมื่อไตเสียหายไปแล้วมากกว่า 75% ทำให้การวินิจฉัยตั้งแต่เนิ่น ๆ จึงสำคัญที่สุด", image: "/assets/cat1.png" },
      { category: "🐈‍⬛ พฤติกรรมและการเลี้ยงดู", title: "ทำไมแมวถึงฉี่นอกกระบะทราย? วิธีแก้ปัญหาพฤติกรรม", snippet: "การฉี่ไม่เป็นที่อาจเป็นปัญหาน่าหงุดหงิดสำหรับเจ้าของ แต่แท้จริงแล้วมันคือสัญญาณที่บอกว่ามีบางอย่างผิดปกติ ซึ่งอาจเกิดจากปัญหาทางการแพทย์หรือปัญหาพฤติกรรม", image: "/assets/cat2.png" },
      { category: "🍲 โภชนาการอาหาร", title: "เช็คลิสต์! อาหารต้องห้าม 7 ชนิด ที่อันตรายถึงแมว", snippet: "ปกป้องแมวของคุณให้ปลอดภัยจากอาหารอันตรายที่คุณอาจไม่รู้ เช็คลิสต์อาหาร 7 ชนิดที่ควรหลีกเลี่ยงเด็ดขาด", image: "/assets/cat3.png" },
      { category: "🧬 การดูแลเฉพาะช่วงวัย", title: "อาหารเปียกหรืออาหารเม็ด: อะไรดีกว่ากัน? ไขข้อสงสัยโภชนาการแมว", snippet: "คำถามยอดฮิตที่ไม่มีคำตอบตายตัว! แต่สำหรับแมว ซึ่งเป็นสัตว์ที่กินเนื้อเป็นหลัก (Obligate Carnivore) และมีสัญชาตญาณการดื่มน้ำต่ำ การเลือกอาหารจึงต้องพิจารณาปัจจัยสำคัญ", image: "/assets/cat4.png" },
      { category: "🏥 Pawplan Cat Friendly Space", title: "เราทำให้แมวรู้สึกสบายใจในห้องตรวจได้อย่างไร? (หลักการ Cat Friendly)", snippet: "Pawplan ได้รับการรับรอง Cat Friendly (CF) ในระดับ Gold Certification ซึ่งหมายความว่าเราเข้าใจว่าการมาคลินิกคือประสบการณ์ที่น่ากลัวสำหรับแมว เราจึงปรับปรุงทุกขั้นตอนเพื่อลดความเครียด", image: "/assets/cat5.png" },
    ],
    staticCategories: ["ทั้งหมด", "🩺 สุขภาพและการป้องกันโรค", "🐈‍⬛ พฤติกรรมและการเลี้ยงดู", "🍲 โภชนาการอาหาร", "🧬 การดูแลเฉพาะช่วงวัย", "🏥 พื้นที่สำหรับแมวโดยเฉพาะ",]
  },
  en: {
    title: "🐱 Cat Articles",
    subtitle: "Cat-specific information from veterinarians who truly understand feline behavior, backed by Cat Friendly Gold Certification",
    noArticles: "No articles found in category",
    allCat: "All",
    staticArticles: [
      { category: "🩺 Health & Disease Prevention", title: "Kidney Failure in Cats: The Silent Disease to Watch", snippet: "Chronic Kidney Disease (CKD) is common and a leading cause of death in senior cats. It often shows symptoms only when over 75% of kidney function is lost, making early diagnosis critical.", image: "/assets/cat1.png" },
      { category: "🐈‍⬛ Behavior & Care", title: "Why Is My Cat Urinating Outside the Litter Box? Behavior Solutions", snippet: "Inappropriate elimination can be frustrating, but it's actually a signal that something is wrong — whether medical or behavioral.", image: "/assets/cat2.png" },
      { category: "🍲 Nutrition & Diet", title: "Checklist! 7 Foods Dangerous to Cats", snippet: "Keep your cat safe from dangerous foods you may not know about. The 7 items to strictly avoid.", image: "/assets/cat3.png" },
      { category: "🧬 Age-Specific Care", title: "Wet or Dry Food: Which is Better? Cat Nutrition Explained", snippet: "A popular question with no single answer! For cats as obligate carnivores with low thirst instincts, food choice requires careful consideration of key factors.", image: "/assets/cat4.png" },
      { category: "🏥 Pawplan Cat Friendly Space", title: "How We Make Cats Comfortable in the Exam Room (Cat Friendly Principles)", snippet: "Pawplan is Cat Friendly Gold Certified, meaning we understand that clinic visits are scary for cats. We improve every step to reduce stress.", image: "/assets/cat5.png" },
    ],
    staticCategories: ["All", "🩺 Health & Disease Prevention", "🐈‍⬛ Behavior & Care", "🍲 Nutrition & Diet", "🧬 Age-Specific Care", "🏥 Pawplan Cat Friendly Space",]
  }
};
