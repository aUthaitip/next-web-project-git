"use client";

import { SetStateAction, useState, useEffect } from 'react';
import CategoryTabs from '@/components/articles/CategoryTabs';
import ArticleCard from '@/components/articles/ArticleCard';
import { useLanguage } from '@/context/LanguageContext';
import { healthTipsArticlesData } from '@/data/articles/HealthTipsArticles';

type Article = {
  id?: string;
  title: string;
  snippet?: string;
  image?: string;
  category?: string;
};

export default function HealthTipsArticles() {
  const { lang } = useLanguage();
  const data = healthTipsArticlesData[lang];

  const initialArticles: Article[] = data.initialArticles;
  const staticCategories = data.staticCategories;

  const [selectedCategory, setSelectedCategory] = useState(data.allCat);
  const [apiArticles, setApiArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  // Update selected category when language changes
  useEffect(() => {
    setSelectedCategory(data.allCat);
  }, [lang, data.allCat]);

  const handleCategoryChange = (category: SetStateAction<string>) => {
    setSelectedCategory(category);
  };

  useEffect(() => {
    fetch('/api/content?category=Health Tips')
      .then((res) => res.json())
      .then((apiData) => {
        if (Array.isArray(apiData)) {
          const mapped = apiData
            .filter((a) => a.published)
            .map((a) => ({
              id: String(a.id),
              category: data.adminCat,
              title: a.title,
              snippet: a.content,
              image: a.imageUrl || '/assets/tip1.png',
            }));
          setApiArticles(mapped);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [data.adminCat]);

  const allArticles = [...initialArticles, ...apiArticles];
  const allCategories = apiArticles.length > 0
    ? [...staticCategories, data.adminCat]
    : staticCategories;

  const filteredArticles = allArticles.filter(article =>
    selectedCategory === data.allCat || article.category === selectedCategory
  );

  return (
    <div className="container">
      <h2 className="page-title">{data.title}</h2>
      <div className="section-deco">
        <span className="decorative-bar" aria-hidden="true" />
      </div>
      <p className="intro-text page-subtitle">{data.subtitle}</p>

      <CategoryTabs
        categories={allCategories}
        selectedCategory={selectedCategory}
        onCategoryChange={handleCategoryChange as (category: string) => void}
      />

      <hr />

      <div className="article-card-grid page-content">
        {loading && <p>{data.loading}</p>}
        {filteredArticles.length > 0 ? (
          filteredArticles.map((article, index) => (
            <ArticleCard key={article.id ?? `${article.title}-${index}`} article={article as any} />
          ))
        ) : (
          !loading && <p className="no-articles">{data.noArticles} &quot;{selectedCategory}&quot;</p>
        )}
      </div>
    </div>
  );
}
