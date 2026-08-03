'use client';

import { useEffect } from 'react';
import { useParams, notFound } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
import DogArticles from '@/components/articles/DogArticles';

export default function DogArticleLangPage() {
  const params = useParams();
  const lang = params.lang as string;
  const { setLang } = useLanguage();

  useEffect(() => {
    if (lang === 'th' || lang === 'en') {
      setLang(lang);
    }
  }, [lang, setLang]);

  if (lang !== 'th' && lang !== 'en') {
    notFound();
  }

  return (
    <section className="content-section dog-page page-animate">
      <DogArticles />
    </section>
  );
}
