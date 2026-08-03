"use client";

import { SetStateAction, useState, useEffect } from 'react';
import CategoryTabs from '@/components/articles/CategoryTabs';
import ArticleCard from '@/components/articles/ArticleCard';
import { useLanguage } from '@/context/LanguageContext';
import { catArticlesData } from '@/data/articles/CatArticles';

export default function CatArticles() {
  const { lang } = useLanguage();
  const data = catArticlesData[lang];

  const staticArticles = data.staticArticles;
  const staticCategories = data.staticCategories;

  const [selectedCategory, setSelectedCategory] = useState(data.allCat);
  const [apiArticles, setApiArticles] = useState<{ category: string; title: string; snippet: string; image: string }[]>([]);

  useEffect(() => {
    setSelectedCategory(data.allCat);
  }, [lang, data.allCat]);

  useEffect(() => {
    fetch('/api/content?category=Cat')
      .then((res) => res.json())
      .then((apiData) => {
        if (Array.isArray(apiData)) {
          const mapped = apiData
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
        {filteredArticles.length > 0 ? (
          filteredArticles.map((article, index) => (
            <ArticleCard key={index} article={article as any} />
          ))
        ) : (
          <p className="no-articles">{data.noArticles} &quot;{selectedCategory}&quot;</p>
        )}
      </div>
    </div>
  );
}
