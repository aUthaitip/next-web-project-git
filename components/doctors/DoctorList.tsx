'use client';

import { useEffect, useState } from 'react';
import DoctorCard from '@/components/doctors/DoctorCard';
import { useLanguage } from '@/context/LanguageContext';
import { doctorListData } from '@/data/doctors/DoctorList';

interface Doctor {
  id?: number;
  name: string;
  role?: string;
  specialty?: string;
  expertise?: string;
  imageUrl?: string;
  bio?: string;
  availableDays?: string[];
}

export default function DoctorList() {
  const { lang } = useLanguage();
  const data = doctorListData[lang];
  
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetch('/api/doctors')
      .then((r) => r.json())
      .then((apiData) => setDoctors(Array.isArray(apiData) ? apiData : []))
      .catch(() => setDoctors([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = doctors.filter((d) => {
    const q = search.toLowerCase();
    return (
      d.name.toLowerCase().includes(q) ||
      (d.specialty || d.expertise || d.role || '').toLowerCase().includes(q)
    );
  });

  return (
    <div className="dr-page">
      {/* Hero */}
      <div className="dr-hero">
        <div className="dr-hero__badge">ทีมสัตวแพทย์</div>
        <h1 className="dr-hero__title">{data.title}</h1>
        <p className="dr-hero__sub">{data.subtitle}</p>

        {/* Search */}
        <div className="dr-search">
          <svg className="dr-search__icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
          <input
            className="dr-search__input"
            placeholder="ค้นหาชื่อแพทย์ หรือ ความเชี่ยวชาญ..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="dr-grid">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="dr-skeleton" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="dr-empty">
          <div className="dr-empty__icon">🔍</div>
          <h3>{search ? 'ไม่พบแพทย์ที่ค้นหา' : 'ยังไม่มีข้อมูลแพทย์'}</h3>
          <p>{search ? `ไม่พบผลลัพธ์สำหรับ "${search}"` : 'กรุณาติดต่อเจ้าหน้าที่'}</p>
        </div>
      ) : (
        <div className="dr-grid">
          {filtered.map((doc, i) => (
            <DoctorCard key={doc.id ?? i} {...doc} />
          ))}
        </div>
      )}
    </div>
  );
}
