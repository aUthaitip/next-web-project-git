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
    <div className="max-w-[1200px] mx-auto px-6">
      
      {/* Header */}
      <div className="text-center mb-16">
        <h2 className="text-[2.6rem] text-slate-800 font-bold tracking-tight mb-3">
          {data.title}
        </h2>
        <div className="w-16 h-1 bg-[#0d9488] mx-auto rounded-full mb-5"></div>
        <p className="text-slate-500 text-[1.05rem] font-normal">{data.subtitle}</p>
      </div>

      {/* Section 1: History (Stacked on Tablet/Mobile, Side-by-Side on Desktop >= 1024px) */}
      <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16 my-16">
        <div className="w-full lg:w-[45%] flex justify-center shrink-0">
          <Image
            src="/assets/5.png"
            alt="Pawplan คลินิกสัตว์เลี้ยง"
            width={800}
            height={600}
            className="w-full max-w-[500px] lg:max-w-full h-auto rounded-2xl border border-slate-100 shadow-sm object-cover"
            priority
          />
        </div>
        
        <div className="flex-1 text-center lg:text-left space-y-4 max-w-[700px] lg:max-w-none mx-auto">
          <h3 className="text-[1.8rem] text-slate-800 font-bold tracking-tight">
            {data.clinicName}
          </h3>
          <div className="text-slate-500 text-[1rem] leading-relaxed space-y-4">
            <p>{data.p1}</p>
            <p>{data.p2}</p>
            <p>{data.p3}</p>
          </div>
        </div>
      </div>

      {/* Section 2: Missions (Stacked on Tablet/Mobile, Side-by-Side on Desktop >= 1024px) */}
      <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16 my-24">
        
        {/* List (2 columns on tablet/desktop, 1 column on mobile) */}
        <div className="flex-1 w-full max-w-[750px] lg:max-w-none mx-auto">
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-5 p-0 list-none m-0">
            {data.missions.map((mission, index) => (
              <li key={index} className="h-full">
                <div className="flex flex-col sm:flex-row items-start gap-4 bg-white rounded-xl border border-slate-100 p-6 shadow-sm h-full hover:border-[#0d9488]/30 transition-all duration-300">
                  <div className="p-2.5 rounded-lg flex items-center justify-center shrink-0 mb-3 sm:mb-0" style={{ backgroundColor: `${mission.color}10`, color: mission.color }}>
                    <i className="fa-solid fa-paw text-[1.2rem]" />
                  </div>
                  <div>
                    <h4 className="text-slate-800 text-[1.05rem] font-bold mb-1 max-sm:text-center">{mission.strong}</h4>
                    <p className="text-slate-500 text-[0.88rem] leading-relaxed max-sm:text-center">{mission.desc}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Image */}
        <div className="w-full lg:w-[40%] flex justify-center shrink-0">
          <Image
            src="/assets/6.png"
            alt="ห้องตรวจ"
            width={800}
            height={600}
            className="w-full max-w-[500px] lg:max-w-full h-auto rounded-2xl border border-slate-100 shadow-sm object-cover"
          />
        </div>

      </div>

      {/* ส่วนเพิ่มเติมจาก Admin CRUD */}
      {apiEntries.length > 0 && (
        <div className="mt-20 border-t border-slate-100 pt-12">
          <div className="flex items-center gap-4 mb-10">
            <h3 className="text-xl font-bold text-slate-800">{data.adminTitle}</h3>
            <div className="flex-1 h-px bg-slate-100"></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {apiEntries.map((entry) => (
              <div key={entry.id} className="bg-white border border-slate-100 rounded-xl overflow-hidden shadow-sm flex flex-col h-full">
                {entry.imageUrl && (
                  <div className="relative w-full h-[160px] overflow-hidden border-b border-slate-100">
                    <img src={entry.imageUrl} alt={entry.title} className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="p-5 flex-1 flex flex-col">
                  <h4 className="text-slate-800 font-bold text-[1.05rem] mb-2 leading-snug">{entry.title}</h4>
                  <p className="text-slate-500 text-[0.88rem] leading-relaxed flex-1" style={{ whiteSpace: 'pre-wrap' }}>{entry.content}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
