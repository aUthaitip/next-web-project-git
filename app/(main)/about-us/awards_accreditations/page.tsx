'use client';
import { useEffect, useState } from 'react';
import AwardsSlider from '@/components/AwardsSlider';

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
        <h2 className="page-title">🏆 รางวัลและการรับรอง</h2>
        <div className="divider"></div>
        <p className="intro-text page-subtitle">มุ่งสู่ความเป็นเลิศ ในการดูแลสุขภาพและยกระดับคุณภาพชีวิตสัตว์เลี้ยง</p>
        <AwardsSlider apiEntries={apiEntries} />
      </div>
    </section>
  );
}