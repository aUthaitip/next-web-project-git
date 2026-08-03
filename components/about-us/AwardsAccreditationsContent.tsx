'use client';
import { useEffect, useState } from 'react';
import AwardsSlider from '@/components/about-us/AwardsSlider';
import { useLanguage } from '@/context/LanguageContext';
import { awardsAccreditationsData } from '@/data/about-us/AwardsAccreditationsContent';

interface ApiEntry {
  id: number;
  section: string;
  title: string;
  content: string;
  imageUrl?: string;
  published: boolean;
  sortOrder: number;
}

export default function AwardsAccreditationsContent() {
  const { lang } = useLanguage();
  const data = awardsAccreditationsData[lang];

  const [apiEntries, setApiEntries] = useState<ApiEntry[]>([]);

  useEffect(() => {
    fetch('/api/about-us?section=awards_accreditation')
      .then((res) => res.json())
      .then((result) => {
        if (Array.isArray(result)) {
          setApiEntries(result.filter((a) => a.published));
        }
      })
      .catch(console.error);
  }, []);

  return (
    <div className="content-container">
      <h2 className="page-title">{data.title}</h2>
      <div className="divider"></div>
      <p className="intro-text page-subtitle">{data.subtitle}</p>
      <AwardsSlider slides={data.slides} apiEntries={apiEntries} />
    </div>
  );
}
