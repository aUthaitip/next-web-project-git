'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { historyMissionData } from '@/data/about-us/HistoryMissionContent';

interface ApiEntry {
  id: number;
  title: string;
  content: string;
  imageUrl?: string;
  published: boolean;
}

export default function HistoryMissionContent() {
  const { lang } = useLanguage();
  const data = historyMissionData[lang];

  const [apiEntries, setApiEntries] = useState<ApiEntry[]>([]);

  useEffect(() => {
    fetch('/api/about-us?section=history_mission')
      .then((res) => res.json())
      .then((result) => {
        if (Array.isArray(result)) {
          setApiEntries(result.filter((a) => a.published));
        }
      })
      .catch(console.error);
  }, []);

  return (
    <div className="max-w-[1200px] mx-auto px-5">
      
      {/* Header */}
      <div className="text-center mb-16">
        <h2 className="text-[2.8rem] text-slate-800 font-extrabold max-md:text-[2.2rem] mb-4">
          {data.title}
        </h2>
        <div className="w-20 h-1 bg-[#0d9488] mx-auto rounded-full mb-6"></div>
        <p className="text-slate-500 text-lg font-medium">{data.subtitle}</p>
      </div>

      {/* Section 1: History (Image Left, Text Right) */}
      <div className="flex max-md:flex-col items-center gap-[60px] my-12 max-md:gap-8">
        <div className="flex items-center justify-center w-[420px] max-w-full shrink-0">
          <Image
            src="/assets/5.png"
            alt="ภาพภายใน Pawplan คลินิกสัตว์เลี้ยง ที่ดูสะอาดและอบอุ่น"
            width={800}
            height={600}
            className="w-full h-auto rounded-3xl shadow-[0_10px_30px_rgba(0,0,0,0.04)] border border-slate-100 p-1 bg-white"
          />
        </div>
        
        <div className="flex-1 text-slate-600 font-medium leading-relaxed text-left text-[1.05rem] space-y-4">
          <p className="mb-4">
            <strong className="text-slate-800 text-[2rem] font-extrabold block mb-3">
              {data.clinicName}
            </strong>
            {data.p1}
          </p>
          <p>{data.p2}</p>
          <p>{data.p3}</p>
        </div>
      </div>

      {/* Section 2: Missions (List Left, Image Right) */}
      <div className="flex flex-row max-md:flex-col-reverse items-center gap-[60px] my-12 max-md:gap-8">
        
        {/* List Left */}
        <ul className="text-left list-none p-0 text-slate-600 flex-1 space-y-4">
          {data.missions.map((mission, index) => (
            <li key={index}>
              <div className="flex items-start gap-[18px] bg-white rounded-2xl border border-slate-100 shadow-[0_8px_20px_rgba(0,0,0,0.02)] p-6 hover:-translate-y-0.5 transition-all duration-300">
                <i className="fa-solid fa-paw text-[1.5rem] mt-1" style={{ color: mission.color }} />
                <div>
                  <strong className="text-slate-800 text-lg font-bold block mb-1">{mission.strong}</strong>
                  <span className="text-slate-500 text-[0.95rem] font-normal block">{mission.desc}</span>
                </div>
              </div>
            </li>
          ))}
        </ul>

        {/* Image Right */}
        <div className="w-[400px] max-w-full shrink-0 flex justify-center">
          <Image
            src="/assets/6.png"
            alt="ภาพภายในห้องตรวจ"
            width={800}
            height={600}
            className="w-full h-auto rounded-3xl shadow-[0_10px_30px_rgba(0,0,0,0.04)] border border-slate-100 p-1 bg-white"
          />
        </div>

      </div>

      {/* ส่วนเพิ่มเติมจาก Admin CRUD */}
      {apiEntries.length > 0 && (
        <div className="mt-16">
          <div className="flex items-center gap-4 mb-10">
            <h3 className="text-2xl font-bold text-slate-800">{data.adminTitle}</h3>
            <div className="flex-1 h-px bg-slate-200"></div>
          </div>
          <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-[30px] max-md:grid-cols-1">
            {apiEntries.map((entry) => (
              <div key={entry.id} className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-[0_10px_25px_rgba(0,0,0,0.02)] hover:-translate-y-1 transition-all duration-300 p-6">
                {entry.imageUrl && (
                  <img src={entry.imageUrl} alt={entry.title} className="w-full rounded-xl mb-4 object-cover max-h-[180px]" />
                )}
                <h4 className="text-slate-800 font-bold text-lg mb-2">{entry.title}</h4>
                <p className="text-slate-500 text-sm leading-relaxed" style={{ whiteSpace: 'pre-wrap' }}>{entry.content}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
