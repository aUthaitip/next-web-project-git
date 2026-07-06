"use client";

import { SetStateAction, useState, useEffect } from 'react';
import CategoryTabs from '@/components/CategoryTabs';
import ArticleCard from '@/components/ArticleCard';
import { useLanguage } from '@/context/LanguageContext';

type Article = {
  id?: string;
  title: string;
  snippet?: string;
  image?: string;
  category?: string;
};

export default function HealthTipsPage() {
  const { t } = useLanguage();

  const initialArticles: Article[] = [
    {
      category: t('healthTips.cat1'),
      title: t('healthTips.art1title'),
      snippet: t('healthTips.art1snippet'),
      image: "/assets/tip1.png",
    },
    {
      category: t('healthTips.cat1'),
      title: t('healthTips.art2title'),
      snippet: t('healthTips.art2snippet'),
      image: "/assets/tip2.png",
    },
    {
      category: t('healthTips.cat2'),
      title: t('healthTips.art3title'),
      snippet: t('healthTips.art3snippet'),
      image: "/assets/tip3.png",
    },
    {
      category: t('healthTips.cat3'),
      title: t('healthTips.art4title'),
      snippet: t('healthTips.art4snippet'),
      image: "/assets/tip4.png",
    },
    {
      category: t('healthTips.cat4'),
      title: t('healthTips.art5title'),
      snippet: t('healthTips.art5snippet'),
      image: "/assets/tip5.png",
    },
    {
      category: t('healthTips.cat5'),
      title: t('healthTips.art6title'),
      snippet: t('healthTips.art6snippet'),
      image: "/assets/tip6.png",
    },
  ];

  const staticCategories = [
    t('healthTips.allCat'),
    t('healthTips.cat1'),
    t('healthTips.cat2'),
    t('healthTips.cat3'),
    t('healthTips.cat4'),
    t('healthTips.cat5'),
  ];

  const [selectedCategory, setSelectedCategory] = useState(t('healthTips.allCat'));
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
              category: t('healthTips.adminCat'),
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
    ? [...staticCategories, t('healthTips.adminCat')]
    : staticCategories;

  const filteredArticles = allArticles.filter(article =>
    selectedCategory === t('healthTips.allCat') || article.category === selectedCategory
  );

  return (
    <section className="content-section dog-page page-animate">
      <div className="container">
        <h2 className="page-title">{t('healthTips.title')}</h2>
        <div className="section-deco">
          <span className="decorative-bar" aria-hidden="true" />
        </div>
        <p className="intro-text page-subtitle">{t('healthTips.subtitle')}</p>

        <CategoryTabs
          categories={allCategories}
          selectedCategory={selectedCategory}
          onCategoryChange={handleCategoryChange}
        />

        <hr />

        <div className="article-card-grid page-content">
          {loading && <p>{t('healthTips.loading')}</p>}
          {filteredArticles.length > 0 ? (
            filteredArticles.map((article, index) => (
              <ArticleCard key={article.id ?? `${article.title}-${index}`} article={article} />
            ))
          ) : (
            !loading && <p className="no-articles">{t('healthTips.noArticles')} &quot;{selectedCategory}&quot;</p>
          )}
        </div>
      </div>
    </section>
  );
}
