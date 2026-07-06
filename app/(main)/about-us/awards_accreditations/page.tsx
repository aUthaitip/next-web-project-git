'use client';
import { useEffect, useState } from 'react';
import AwardsSlider from '@/components/AwardsSlider';
import { useLanguage } from '@/context/LanguageContext';

interface ApiEntry {
  id: number;
  section: string;
  title: string;
  content: string;
  imageUrl?: string;
  published: boolean;
  sortOrder: number;
}

export default function AwardsPage() {
  const { t } = useLanguage();
  const [apiEntries, setApiEntries] = useState<ApiEntry[]>([]);

  useEffect(() => {
    fetch('/api/about-us?section=awards_accreditation')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setApiEntries(data.filter((a) => a.published));
        }
      })
      .catch(console.error);
  }, []);

  return (
    <section className="content-section awards_accreditations-page page-animate">
      <div className="content-container">
        <h2 className="page-title">{t('awards.title')}</h2>
        <div className="divider"></div>
        <p className="intro-text page-subtitle">{t('awards.subtitle')}</p>
        <AwardsSlider apiEntries={apiEntries} />
      </div>
    </section>
  );
}