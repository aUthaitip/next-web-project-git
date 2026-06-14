// app/doctors/page.tsx
'use client';

import { useEffect, useState } from 'react';
import DoctorCard from '@/components/DoctorCard';

interface Doctor {
  _id?: number;
  name: string;
  nickname?: string;
  role?: string;
  expertise?: string;
  quote?: string;
  imageSrc?: string;
}

export default function DoctorsPage() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await fetch('/api/doctors');
        if (res.ok) {
          const data = await res.json();
          setDoctors(data);
        }
      } catch (error) {
        console.error('Failed to fetch doctors:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDoctors();
  }, []);

  // เก็บ default doctors หากไม่มีใน MongoDB
  const defaultDoctors: Doctor[] = [

  ];

  const displayDoctors = doctors.length > 0 ? doctors : defaultDoctors;

  return (
    <section className="content-section doctors-page page-animate">
      <div className="container">
        <h2 className="page-title">ทีมสัตวแพทย์ผู้เชี่ยวชาญที่ Pawplan</h2>
        <div className="divider"></div>
        <p className="intro-text page-subtitle">ที่ Pawplan เราเชื่อว่าการดูแลที่ดีที่สุดต้องมาจากความเข้าใจและความเชี่ยวชาญเฉพาะด้าน ทีมสัตวแพทย์ของเราพร้อมวางแผนการดูแลสุขภาพที่ดีที่สุดให้กับเพื่อนรักของคุณ</p>

        {loading ? (
          <div className="doctor-grid page-content">
            <p>กำลังโหลด...</p>
          </div>
        ) : (
          <div className="doctor-grid page-content">
            {displayDoctors.map((doctor, index) => (
              <DoctorCard key={index} {...doctor} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}