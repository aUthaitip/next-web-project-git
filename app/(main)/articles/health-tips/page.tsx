"use client";

import { SetStateAction, useState, useEffect } from 'react';
import CategoryTabs from '@/components/CategoryTabs';
import ArticleCard from '@/components/ArticleCard';

type Article = {
  id?: string;
  title: string;
  snippet?: string;
  image?: string;
  category?: string;
};

// ข้อมูลเดิม (hardcode) — ไม่ได้แตะ
const initialArticles: Article[] = [
  {
    category: "🦷 สุขภาพช่องปากและฟัน",
    title: "5 ขั้นตอนง่าย ๆ ในการแปรงฟันสุนัขและแมว",
    snippet: "โรคปริทันต์ (Periodontal Disease) เป็นภัยเงียบที่พบในสัตว์เลี้ยงกว่า 80% ที่มีอายุ 3 ปีขึ้นไป การแปรงฟันทุกวันคือการป้องกันที่ดีที่สุด แต่ทำอย่างไรให้ง่ายและสัตว์เลี้ยงยอมให้ความร่วมมือ?",
    image: "/assets/tip1.png",
  },
  {
    category: "🦷 สุขภาพช่องปากและฟัน",
    title: "อาหารและขนมช่วยขัดฟัน: ใช้ได้ผลจริงหรือไม่?",
    snippet: "ขนมขัดฟัน (Dental Chews) และอาหารสูตรดูแลช่องปาก (Dental Diets) เป็นตัวเลือกยอดนิยม แต่สิ่งเหล่านี้สามารถทดแทนการแปรงฟันได้จริงหรือ? มาฟังคำแนะนำจากสัตวแพทย์ Pawplan",
    image: "/assets/tip2.png",
  },
  {
    category: "⚖️ การควบคุมน้ำหนัก",
    title: "ประเมินภาวะอ้วนในสัตว์เลี้ยง: ลูกของคุณ 'อวบ' หรือ 'อ้วน' เกินไป?",
    snippet: "ภาวะน้ำหนักเกินนำไปสู่ปัญหาสุขภาพร้ายแรง เช่น โรคเบาหวาน โรคข้ออักเสบ และโรคหัวใจ การประเมินน้ำหนักจึงสำคัญกว่าแค่การขึ้นชั่งน้ำหนัก โดยใช้หลัก Body Condition Score (BCS)",
    image: "/assets/tip3.png",
  },
  {
    category: "💉 การป้องกันประจำปี",
    title: "ตารางวัคซีนที่ครบถ้วนสำหรับสัตว์เลี้ยงในเมืองไทย",
    snippet: "การฉีดวัคซีนไม่ใช่แค่เรื่องของการปฏิบัติตามกฎหมาย (วัคซีนพิษสุนัขบ้า) แต่คือเกราะป้องกันที่สำคัญที่สุดจากโรคติดต่อร้ายแรงในสภาพอากาศเขตร้อนของประเทศไทย",
    image: "/assets/tip4.png",
  },
  {
    category: "🧠 สุขภาพจิตและพฤติกรรม",
    title: "จัดสภาพแวดล้อม (Enrichment) อย่างไรให้สัตว์เลี้ยงไม่เบื่อ",
    snippet: "สัตว์เลี้ยงที่ถูกปล่อยให้อยู่ลำพังเป็นเวลานานอาจเกิดความเบื่อหน่าย ซึ่งนำไปสู่พฤติกรรมทำลายข้าวของ หรือภาวะเครียด (Anxiety) การจัดสภาพแวดล้อมที่กระตุ้นสัญชาตญาณจึงสำคัญต่อสุขภาพจิต",
    image: "/assets/tip5.png",
  },
  {
    category: "🌡️ การปฐมพยาบาลเบื้องต้น",
    title: "กล่องยาฉุกเฉิน (First Aid Kit) สำหรับสัตว์เลี้ยง: ต้องมีอะไรบ้าง?",
    snippet: "อุบัติเหตุเกิดขึ้นได้เสมอ การมีชุดปฐมพยาบาลเบื้องต้นสำหรับสัตว์เลี้ยงที่พร้อมใช้งานจะช่วยบรรเทาอาการบาดเจ็บเบื้องต้นก่อนนำส่งคลินิกได้",
    image: "/assets/tip6.png",
  },
];

const staticCategories = [
  "ทั้งหมด",
  "🦷 สุขภาพช่องปากและฟัน",
  "⚖️ การควบคุมน้ำหนัก",
  "💉 การป้องกันประจำปี",
  "🧠 สุขภาพจิตและพฤติกรรม",
  "🌡️ การปฐมพยาบาลเบื้องต้น",
];

export default function HealthTipsPage() {
  const [selectedCategory, setSelectedCategory] = useState('ทั้งหมด');
  const [apiArticles, setApiArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  const handleCategoryChange = (category: SetStateAction<string>) => {
    setSelectedCategory(category);
  };

  useEffect(() => {
    fetch('/api/content?category=Health Tips')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          const mapped = data
            .filter((a) => a.published)
            .map((a) => ({
              id: String(a.id),
              category: '📝 บทความจาก Admin',
              title: a.title,
              snippet: a.content,
              image: a.imageUrl || '/assets/tip1.png',
            }));
          setApiArticles(mapped);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const allArticles = [...initialArticles, ...apiArticles];
  const allCategories = apiArticles.length > 0
    ? [...staticCategories, '📝 บทความจาก Admin']
    : staticCategories;

  const filteredArticles = allArticles.filter(article =>
    selectedCategory === 'ทั้งหมด' || article.category === selectedCategory
  );

  return (
    <section className="content-section dog-page page-animate">
      <div className="container">
        <h2 className="page-title">Wellness Tips: เคล็ดลับสุขภาพและชีวิตยืนยาว</h2>
        <div className="section-deco">
          <span className="decorative-bar" aria-hidden="true" />
        </div>
        <p className="intro-text page-subtitle">คู่มือการดูแลสัตว์เลี้ยงอย่างเข้าใจ เพื่อสุขภาพกายและใจที่ดีในทุกวัน เรียนรู้เคล็ดลับที่สัตวแพทย์ Pawplan อยากให้คุณรู้</p>

        <CategoryTabs
          categories={allCategories}
          selectedCategory={selectedCategory}
          onCategoryChange={handleCategoryChange}
        />

        <hr />

        <div className="article-card-grid page-content">
          {loading && <p>กำลังโหลด...</p>}
          {filteredArticles.length > 0 ? (
            filteredArticles.map((article, index) => (
              <ArticleCard key={article.id ?? `${article.title}-${index}`} article={article} />
            ))
          ) : (
            !loading && <p className="no-articles">ไม่พบข้อมูลบทความในหมวดหมู่ &quot;{selectedCategory}&quot;</p>
          )}
        </div>
      </div>
    </section>
  );
}
