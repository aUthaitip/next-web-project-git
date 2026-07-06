"use client";

import React, { useEffect, useState } from 'react';
import CategoryTabs from '@/components/CategoryTabs';
import ArticleCard from '@/components/ArticleCard';
import { useLanguage } from '@/context/LanguageContext';

type Article = {
  id?: string;
  title: string;
  snippet?: string;
  image?: string;
  date?: string;
  category?: string;
  link?: string;
};

export default function DogArticlePage() {
  const { t } = useLanguage();

  const initialArticles: Article[] = [
    {
      category: t('dogArticles.cat1'),
      title: t('dogArticles.art1title'),
      snippet: t('dogArticles.art1snippet'),
      image: "/assets/dog1.png",
    },
    {
      category: t('dogArticles.cat1'),
      title: t('dogArticles.art2title'),
      snippet: t('dogArticles.art2snippet'),
      image: "/assets/dog2.png",
    },
    {
      category: t('dogArticles.cat2'),
      title: t('dogArticles.art3title'),
      snippet: t('dogArticles.art3snippet'),
      image: "/assets/dog3.png",
    },
    {
      category: t('dogArticles.cat3'),
      title: t('dogArticles.art4title'),
      snippet: t('dogArticles.art4snippet'),
      image: "/assets/dog4.png",
    },
    {
      category: t('dogArticles.cat4'),
      title: t('dogArticles.art5title'),
      snippet: t('dogArticles.art5snippet'),
      image: "/assets/dog5.png",
    },
    {
      category: t('dogArticles.cat5'),
      title: t('dogArticles.art6title'),
      snippet: t('dogArticles.art6snippet'),
      image: "/assets/dog6.png",
    },
  ];

  const staticCategories = [
    t('dogArticles.allCat'),
    t('dogArticles.cat1'),
    t('dogArticles.cat2'),
    t('dogArticles.cat3'),
    t('dogArticles.cat4'),
    t('dogArticles.cat5'),
  ];

  const [selectedCategory, setSelectedCategory] = useState(t('dogArticles.allCat'));
  const [apiArticles, setApiArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };

  useEffect(() => {
    fetch('/api/content?category=Dog')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          const mapped = data
            .filter((a) => a.published)
            .map((a) => ({
              id: String(a.id),
              category: t('dogArticles.adminCat'),
              title: a.title,
              snippet: a.content,
              image: a.imageUrl || '/assets/dog1.png',
            }));
          setApiArticles(mapped);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const allArticles = [...initialArticles, ...apiArticles];
  const allCategories = apiArticles.length > 0
    ? [...staticCategories, t('dogArticles.adminCat')]
    : staticCategories;

  const filteredArticles = allArticles.filter(article =>
    selectedCategory === t('dogArticles.allCat') || article.category === selectedCategory
  );

  return (
    <section className="content-section dog-page page-animate">
      <div className="container">
        <h2 className="page-title">{t('dogArticles.title')}</h2>
        <div className="section-deco">
          <span className="decorative-bar" aria-hidden="true" />
        </div>
        <p className="intro-text page-subtitle">{t('dogArticles.subtitle')}</p>

        <CategoryTabs
          categories={allCategories}
          selectedCategory={selectedCategory}
          onCategoryChange={handleCategoryChange}
        />

        <hr />

        <div className="article-card-grid page-content">
          {loading && <p>{t('dogArticles.loading')}</p>}
          {filteredArticles.length > 0 ? (
            filteredArticles.map((article, index) => (
              <ArticleCard key={article.id ?? `${article.title}-${index}`} article={article} />
            ))
          ) : (
            !loading && <p className="no-articles">{t('dogArticles.noArticles')} &quot;{selectedCategory}&quot;</p>
          )}
        </div>
      </div>
    </section>
  );
}
