"use client";

import { SetStateAction, useState, useEffect } from 'react';
import CategoryTabs from '@/components/articles/CategoryTabs';
import ArticleCard from '@/components/articles/ArticleCard';
import { useLanguage } from '@/context/LanguageContext';

export default function CatArticles() {
  const { t } = useLanguage();

  const staticArticles = [
    {
      category: t('catArticles.cat1'),
      title: t('catArticles.art1title'),
      snippet: t('catArticles.art1snippet'),
      image: "/assets/cat1.png",
    },
    {
      category: t('catArticles.cat2'),
      title: t('catArticles.art2title'),
      snippet: t('catArticles.art2snippet'),
      image: "/assets/cat2.png",
    },
    {
      category: t('catArticles.cat3'),
      title: t('catArticles.art3title'),
      snippet: t('catArticles.art3snippet'),
      image: "/assets/cat3.png",
    },
    {
      category: t('catArticles.cat4'),
      title: t('catArticles.art4title'),
      snippet: t('catArticles.art4snippet'),
      image: "/assets/cat4.png",
    },
    {
      category: t('catArticles.cat5'),
      title: t('catArticles.art5title'),
      snippet: t('catArticles.art5snippet'),
      image: "/assets/cat5.png",
    },
  ];

  const staticCategories = [
    t('catArticles.allCat'),
    t('catArticles.cat1'),
    t('catArticles.cat2'),
    t('catArticles.cat3'),
    t('catArticles.cat4'),
    t('catArticles.cat5'),
    'Cat',
  ];

  const [selectedCategory, setSelectedCategory] = useState(t('catArticles.allCat'));
  const [apiArticles, setApiArticles] = useState<{ category: string; title: string; snippet: string; image: string }[]>([]);

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

  const allArticles = [...staticArticles, ...apiArticles];

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
    selectedCategory === t('catArticles.allCat') || article.category === selectedCategory
  );

  return (
    <div className="container">
      <h2 className="page-title">{t('catArticles.title')}</h2>
      <div className="section-deco">
        <span className="decorative-bar" aria-hidden="true" />
      </div>
      <p className="intro-text page-subtitle">{t('catArticles.subtitle')}</p>

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
          <p className="no-articles">{t('catArticles.noArticles')} &quot;{selectedCategory}&quot;</p>
        )}
      </div>
    </div>
  );
}
