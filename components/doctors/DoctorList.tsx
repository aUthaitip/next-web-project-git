'use client';

import { useEffect, useState } from 'react';
import DoctorCard from '@/components/doctors/DoctorCard';
import { useLanguage } from '@/context/LanguageContext';
import { doctorListData } from '@/data/doctors/DoctorList';

interface Doctor {
  id?: number;
  name: string;
  nameEn?: string | null;
  role?: string;
  specialty?: string;
  expertise?: string;
  expertiseEn?: string | null;
  imageUrl?: string;
  bio?: string;
  bioEn?: string | null;
  availableDays?: string[];
}

const KEYWORD_MAP: Record<string, string[]> = {
  // หัวใจ (Cardiology)
  'หัวใจ': ['cardio', 'heart', 'หัวใจ', 'cardiovascular'],
  'heart': ['cardio', 'heart', 'หัวใจ'],
  'หลอดเลือด': ['cardio', 'heart', 'หัวใจ', 'cardiovascular', 'หลอดเลือด'],

  // ทางเดินอาหาร (Gastrointestinal / Digestive)
  'ทางเดินอาหาร': ['gastro', 'digest', 'ทางเดินอาหาร', 'gastrointestinal', 'stomach', 'กระเพาะ', 'ลำไส้'],
  'gastro': ['gastro', 'digest', 'ทางเดินอาหาร', 'gastrointestinal'],
  'digestive': ['gastro', 'digest', 'ทางเดินอาหาร', 'gastrointestinal'],
  'กระเพาะ': ['gastro', 'digest', 'ทางเดินอาหาร', 'gastrointestinal', 'stomach', 'กระเพาะ', 'ลำไส้'],
  'ลำไส้': ['gastro', 'digest', 'ทางเดินอาหาร', 'gastrointestinal', 'stomach', 'กระเพาะ', 'ลำไส้'],

  // ดวงตา (Ophthalmology)
  'ตา': ['ophthalm', 'eye', 'ตา', 'จักษุ'],
  'eye': ['ophthalm', 'eye', 'ตา', 'จักษุ'],
  'จักษุ': ['ophthalm', 'eye', 'ตา', 'จักษุ'],

  // ผิวหนัง (Dermatology)
  'ผิวหนัง': ['dermatolog', 'skin', 'ผิวหนัง', 'แพ้'],
  'skin': ['dermatolog', 'skin', 'ผิวหนัง'],
  'คัน': ['dermatolog', 'skin', 'ผิวหนัง', 'คัน', 'แพ้'],

  // กระดูกและข้อ (Orthopedics)
  'กระดูก': ['orthoped', 'bone', 'กระดูก', 'ข้อต่อ', 'ข้อเสื่อม'],
  'ข้อ': ['orthoped', 'bone', 'กระดูก', 'ข้อต่อ', 'ข้อเสื่อม'],
  'bone': ['orthoped', 'bone', 'กระดูก'],

  // ระบบประสาท (Neurology)
  'ประสาท': ['neuro', 'brain', 'ประสาท', 'สมอง', 'ชัก'],
  'สมอง': ['neuro', 'brain', 'ประสาท', 'สมอง', 'ชัก'],
  'ชัก': ['neuro', 'brain', 'ประสาท', 'สมอง', 'ชัก'],
  'neuro': ['neuro', 'brain', 'ประสาท', 'สมอง'],

  // ฉุกเฉินและวิกฤต (Emergency / Critical Care)
  'ฉุกเฉิน': ['emergency', 'critical', 'ฉุกเฉิน', 'วิกฤต', 'icu'],
  'วิกฤต': ['emergency', 'critical', 'ฉุกเฉิน', 'วิกฤต', 'icu'],
  'icu': ['emergency', 'critical', 'ฉุกเฉิน', 'วิกฤต', 'icu'],
  'emergency': ['emergency', 'critical', 'ฉุกเฉิน', 'วิกฤต'],

  // ศัลยกรรม (Surgery)
  'ศัลยกรรม': ['surgery', 'surgical', 'ผ่าตัด', 'ศัลยกรรม', 'ทำหมัน'],
  'ผ่าตัด': ['surgery', 'surgical', 'ผ่าตัด', 'ศัลยกรรม', 'ทำหมัน'],
  'ทำหมัน': ['surgery', 'surgical', 'ผ่าตัด', 'ศัลยกรรม', 'ทำหมัน'],
  'surgery': ['surgery', 'surgical', 'ผ่าตัด', 'ศัลยกรรม'],

  // อายุรกรรม (Internal Medicine)
  'อายุรกรรม': ['medicine', 'internal', 'อายุรกรรม'],
  'medicine': ['medicine', 'internal', 'อายุรกรรม'],

  // ทันตกรรม (Dentistry)
  'ฟัน': ['dental', 'tooth', 'dentistry', 'teeth', 'เหงือก', 'ช่องปาก', 'ขูดหินปูน'],
  'ทันตกรรม': ['dental', 'tooth', 'dentistry', 'teeth', 'เหงือก', 'ช่องปาก', 'ขูดหินปูน'],
  'เหงือก': ['dental', 'tooth', 'dentistry', 'teeth', 'เหงือก', 'ช่องปาก', 'ขูดหินปูน'],
  'ปาก': ['dental', 'tooth', 'dentistry', 'teeth', 'เหงือก', 'ช่องปาก', 'ขูดหินปูน'],
  'dental': ['dental', 'tooth', 'dentistry', 'teeth'],

  // ไตและระบบปัสสาวะ (Nephrology / Urology)
  'ไต': ['kidney', 'renal', 'urology', 'nephro', 'ไต', 'ทางเดินปัสสาวะ', 'นิ่ว'],
  'ปัสสาวะ': ['kidney', 'renal', 'urology', 'nephro', 'ไต', 'ทางเดินปัสสาวะ', 'นิ่ว'],
  'นิ่ว': ['kidney', 'renal', 'urology', 'nephro', 'ไต', 'ทางเดินปัสสาวะ', 'นิ่ว'],
  'kidney': ['kidney', 'renal', 'urology', 'nephro'],

  // มะเร็งและเนื้องอก (Oncology)
  'มะเร็ง': ['cancer', 'oncolog', 'tumor', 'มะเร็ง', 'เนื้องอก'],
  'เนื้องอก': ['cancer', 'oncolog', 'tumor', 'มะเร็ง', 'เนื้องอก'],
  'cancer': ['cancer', 'oncolog', 'tumor'],

  // สัตว์พิเศษ (Exotic Pets)
  'สัตว์พิเศษ': ['exotic', 'pocket', 'reptile', 'rabbit', 'bird', 'สัตว์พิเศษ', 'สัตว์แปลก', 'กระต่าย', 'นก', 'หนู'],
  'สัตว์แปลก': ['exotic', 'pocket', 'reptile', 'rabbit', 'bird', 'สัตว์พิเศษ', 'สัตว์แปลก', 'กระต่าย', 'นก', 'หนู'],
  'กระต่าย': ['exotic', 'pocket', 'rabbit', 'กระต่าย'],
  'นก': ['exotic', 'bird', 'นก'],
  'exotic': ['exotic', 'pocket', 'สัตว์พิเศษ', 'สัตว์แปลก'],

  // วัคซีนและการป้องกัน (Vaccination / Preventive)
  'วัคซีน': ['vaccin', 'immuniz', 'วัคซีน', 'ป้องกัน'],
  'ป้องกัน': ['prevent', 'vaccin', 'ป้องกัน', 'เวชศาสตร์ป้องกัน'],
  'vaccine': ['vaccin', 'prevent'],

  // การตรวจทั่วไป / ตรวจสุขภาพ (General Checkup)
  'ตรวจสุขภาพ': ['checkup', 'general', 'ตรวจสุขภาพ', 'ทั่วไป'],
  'ทั่วไป': ['general', 'ทั่วไป', 'สุขภาพ'],
  'checkup': ['checkup', 'general', 'ตรวจสุขภาพ'],

  // สายพันธุ์หลัก (Cats / Dogs)
  'แมว': ['cat', 'feline', 'แมว'],
  'สุนัข': ['dog', 'canine', 'หมา', 'สุนัข'],
  'หมา': ['dog', 'canine', 'หมา', 'สุนัข'],
};

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
    const q = search.toLowerCase().trim();
    if (!q) return true;

    // Combine all searchable text fields
    const searchString = [
      d.name,
      d.nameEn || '',
      d.expertise || '',
      d.expertiseEn || '',
      d.bio || '',
      d.bioEn || '',
      d.specialty || '',
      d.role || ''
    ].join(' ').toLowerCase();

    // 1. Try exact/direct matching first
    if (searchString.includes(q)) return true;

    // 2. Expand queries using the keyword map
    for (const [key, synonyms] of Object.entries(KEYWORD_MAP)) {
      if (q.includes(key) || key.includes(q)) {
        const matchesSynonym = synonyms.some(syn => searchString.includes(syn.toLowerCase()));
        if (matchesSynonym) return true;
      }
    }

    return false;
  });

  return (
    <div className="dr-page">
      {/* Hero */}
      <div className="dr-hero">
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
