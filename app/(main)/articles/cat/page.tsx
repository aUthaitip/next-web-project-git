"use client";

import { SetStateAction, useState, useEffect } from 'react';
import CategoryTabs from '@/components/CategoryTabs';
import ArticleCard from '@/components/ArticleCard';

// ข้อมูลเดิม (hardcode) — ไม่ได้แตะ
const staticArticles = [
  {
    category: "🩺 สุขภาพและการป้องกันโรค",
    title: "ภาวะไตวายในแมว: โรคเงียบที่ต้องเฝ้าระวัง",
    snippet: "ภาวะไตวาย (Chronic Kidney Disease - CKD) เป็นโรคที่พบบ่อยและเป็นสาเหตุการเสียชีวิตอันดับต้น ๆ ในแมวสูงวัย โรคนี้มักแสดงอาการเมื่อไตเสียหายไปแล้วมากกว่า 75% ทำให้การวินิจฉัยตั้งแต่เนิ่น ๆ จึงสำคัญที่สุด",
    image: "/assets/cat1.png",
  },
  {
    category: "🐈‍⬛ พฤติกรรมและการเลี้ยงดู",
    title: "ทำไมแมวถึงฉี่นอกกระบะทราย? วิธีแก้ปัญหาพฤติกรรม",
    snippet: "การฉี่ไม่เป็นที่อาจเป็นปัญหาน่าหงุดหงิดสำหรับเจ้าของ แต่แท้จริงแล้วมันคือสัญญาณที่บอกว่ามีบางอย่างผิดปกติ ซึ่งอาจเกิดจากปัญหาทางการแพทย์หรือปัญหาพฤติกรรม",
    image: "/assets/cat2.png",
  },
  {
    category: "🍲 โภชนาการอาหาร",
    title: "เช็คลิสต์! อาหารต้องห้าม 7 ชนิด ที่อันตรายถึงชีวิตสุนัข",
    snippet: "ปกป้องสุนัขของคุณให้ปลอดภัยจากอาหารอันตรายที่คุณอาจไม่รู้ เช็คลิสต์อาหาร 7 ชนิดที่ควรหลีกเลี่ยงเด็ดขาด",
    image: "/assets/cat3.png",
  },
  {
    category: "🧬 การดูแลเฉพาะช่วงวัย",
    title: "อาหารเปียกหรืออาหารเม็ด: อะไรดีกว่ากัน? ไขข้อสงสัยโภชนาการแมว",
    snippet: "คำถามยอดฮิตที่ไม่มีคำตอบตายตัว! แต่สำหรับแมว ซึ่งเป็นสัตว์ที่กินเนื้อเป็นหลัก (Obligate Carnivore) และมีสัญชาตญาณการดื่มน้ำต่ำ การเลือกอาหารจึงต้องพิจารณาปัจจัยสำคัญ",
    image: "/assets/cat4.png",
  },
  {
    category: "🏥 Pawplan Cat Friendly Space",
    title: "เราทำให้แมวรู้สึกสบายใจในห้องตรวจได้อย่างไร? (หลักการ Cat Friendly)",
    snippet: "Pawplan ได้รับการรับรอง Cat Friendly (CF) ในระดับ Gold Certification ซึ่งหมายความว่าเราเข้าใจว่าการมาคลินิกคือประสบการณ์ที่น่ากลัวสำหรับแมว เราจึงปรับปรุงทุกขั้นตอนเพื่อลดความเครียด",
    image: "/assets/cat5.png",
  },
];

const staticCategories = [
  "ทั้งหมด",
  "🩺 สุขภาพและการป้องกันโรค",
  "🐈‍⬛ พฤติกรรมและการเลี้ยงดู",
  "🍲 โภชนาการอาหาร",
  "🧬 การดูแลเฉพาะช่วงวัย",
  "🏥 Pawplan Cat Friendly Space",
  "Cat",
];

export default function CatArticlePage() {
  const [selectedCategory, setSelectedCategory] = useState('ทั้งหมด');
  const [apiArticles, setApiArticles] = useState<{ category: string; title: string; snippet: string; image: string }[]>([]);

  // ดึงบทความจาก admin CRUD
  useEffect(() => {
    fetch('/api/content?category=Cat')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          const mapped = data
            .filter((a) => a.published)
            .map((a) => ({
              category: a.category || 'Cat', 
              title: a.title,
              snippet: a.content,
              image: a.imageUrl || '/assets/cat1.png',
            }));
          setApiArticles(mapped);
        }
      })
      .catch(console.error);
  }, []);

  // รวม hardcode + API
  const allArticles = [...staticArticles, ...apiArticles];

  // categories รวม (เพิ่ม category ใหม่จาก API ถ้ามี)
  const apiCategories = apiArticles
  .map((a) => a.category)
  .filter((c, i, arr) => c && arr.indexOf(c) === i);

  const allCategories = [
  ...staticCategories,
  ...apiCategories.filter((c) => !staticCategories.includes(c)), 
];

  const handleCategoryChange = (category: SetStateAction<string>) => {
    setSelectedCategory(category);
  };

  const filteredArticles = allArticles.filter(article =>
    selectedCategory === 'ทั้งหมด' || article.category === selectedCategory
  );

  return (
    <section className="content-section dog-page page-animate">
      <div className="container">
        <h2 className="page-title">🐱 Cat Articles : บทความสำหรับแมว</h2>
        <div className="section-deco">
          <span className="decorative-bar" aria-hidden="true" />
        </div>
        <p className="intro-text page-subtitle">ข้อมูลเฉพาะสำหรับแมว โดยทีมสัตวแพทย์ที่เข้าใจพฤติกรรมของเหมียวอย่างแท้จริง มั่นใจด้วยการรับรอง Cat Friendly Gold Certification</p>

        <CategoryTabs
          categories={allCategories}
          selectedCategory={selectedCategory}
          onCategoryChange={handleCategoryChange}
        />

        <hr />

        <div className="article-card-grid page-content">
          {filteredArticles.length > 0 ? (
            filteredArticles.map((article, index) => (
              <ArticleCard key={index} article={article} />
            ))
          ) : (
            <p className="no-articles">ไม่พบข้อมูลบทความในหมวดหมู่ &quot;{selectedCategory}&quot;</p>
          )}
        </div>
      </div>
    </section>
  );
}
