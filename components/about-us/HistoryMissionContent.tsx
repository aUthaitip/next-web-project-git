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
    <div className="history-mission-content mx-auto w-full max-w-[1140px] pt-4 pb-7 flex flex-col items-center gap-16 md:gap-[clamp(64px,8vw,88px)]">
        <div className="flex flex-col items-center gap-4 ">
          <p className="mb-3 inline-flex items-center gap-2 text-[0.78rem] font-bold uppercase tracking-[0.12em] text-[var(--accent-blue)]">
            {data.subtitle}
          </p>
          <h2 className="!m-0 !text-[clamp(2rem,4vw,3rem)] !leading-[1.2] !tracking-[-0.04em] !text-[var(--accent-blue)]">
            {data.title}
          </h2>
          <span className="mx-auto mt-[22px] block h-1 w-[58px] rounded-full bg-[linear-gradient(90deg,var(--main-blue),var(--accent-blue))]" aria-hidden="true" />
        </div>

      <section className="grid grid-cols-1 items-center gap-8 w-full md:grid-cols-2 md:gap-[clamp(32px,6vw,80px)]">
        <div className="relative isolate">
          <span className="absolute -right-3.5 -bottom-3.5 -z-10 h-3/4 w-3/4 rounded-[28px] bg-[rgba(52,173,186,0.14)]" aria-hidden="true" />
          <Image
            src="/assets/5.png"
            alt="Pawplan คลินิกสัตว์เลี้ยง"
            width={800}
            height={600}
            className="block aspect-[4/3] w-full rounded-3xl border border-[rgba(52,173,186,0.18)] object-cover shadow-[0_20px_42px_rgba(36,143,155,0.16)]"
            priority
          />
        </div>
        <div className="text-center md:text-left px-4 md:px-6">
          <span className="mb-3 inline-flex items-center gap-2 text-[0.78rem] font-bold uppercase tracking-[0.12em] text-[var(--accent-blue)]">
            <span className="h-0.5 w-6 rounded-full bg-[var(--main-blue)]" aria-hidden="true" />
            Our story
          </span>
          <h3 className="mb-[18px] text-[clamp(1.6rem,2.6vw,2.15rem)] tracking-[-0.025em] text-[var(--text-dark)]">
            {data.clinicName}
          </h3>
          <div className="grid gap-[15px] text-[1rem] leading-[1.85] text-[var(--text-muted)]">
            <p>{data.p1}</p>
            <p>{data.p2}</p>
            <p>{data.p3}</p>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 items-center gap-8 w-full md:grid-cols-2 md:gap-[clamp(32px,6vw,80px)]">
        <div className="order-2 text-center md:text-left md:order-1 px-4 md:px-6">
          <span className="mb-6 inline-flex items-center gap-2 text-[0.78rem] font-bold uppercase tracking-[0.12em] text-[var(--accent-blue)]">
            <span className="h-0.5 w-6 rounded-full bg-[var(--main-blue)]" aria-hidden="true" />
            Our commitment
          </span>
          <ul className="m-0 list-none divide-y divide-[rgba(52,173,186,0.16)] border-y border-[rgba(52,173,186,0.16)] p-0">
            {data.missions.map((mission) => (
              <li
                key={mission.strong}
                className="group grid grid-cols-[48px_1fr] items-center  text-left transition-colors duration-300 hover:bg-[rgba(52,173,186,0.05)] py-6 sm:px-3"
              >
                <span
                  className="inline-flex h-12 w-12 items-center justify-center rounded-full text-[1.05rem] transition-transform duration-300 group-hover:scale-110"
                  style={{ backgroundColor: `${mission.color}16`, color: mission.color }}
                  aria-hidden="true"
                >
                  <i className="fa-solid fa-paw" />
                </span>
                <div className="pt-0.5">
                  <h4 className="mb-2 text-[1rem] leading-[1.45] text-[var(--text-dark)] transition-colors duration-300 group-hover:text-[var(--accent-blue)]">{mission.strong}</h4>
                  <p className="m-0 text-[0.9rem] leading-[1.7] text-[var(--text-muted)]">{mission.desc}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className="relative isolate order-1 md:order-2">
          <span className="absolute -bottom-3.5 -left-3.5 -z-10 h-3/4 w-3/4 rounded-[28px] bg-[rgba(52,173,186,0.14)]" aria-hidden="true" />
          <Image
            src="/assets/6.png"
            alt="ห้องตรวจ"
            width={800}
            height={600}
            className="block aspect-[4/3] w-full rounded-3xl border border-[rgba(52,173,186,0.18)] object-cover shadow-[0_20px_42px_rgba(36,143,155,0.16)]"
          />
        </div>
      </section>
      

      {apiEntries.length > 0 && (
        <section className="border-t border-[rgba(52,173,186,0.2)] pt-[54px]">
          <h3 className="mb-7 text-center text-[1.35rem] text-[var(--accent-blue)]">{data.adminTitle}</h3>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {apiEntries.map((entry) => (
              <article key={entry.id} className="overflow-hidden rounded-[18px] border border-[rgba(52,173,186,0.14)] bg-white p-[22px] text-center shadow-[0_8px_20px_rgba(36,143,155,0.07)]">
                {entry.imageUrl && (
                  <div className="-mx-[22px] -mt-[22px] mb-[18px] h-[170px] overflow-hidden">
                    <img src={entry.imageUrl} alt={entry.title} className="block h-full w-full object-cover" />
                  </div>
                )}
                <h4 className="mb-2 text-[1.05rem] text-[var(--text-dark)]">{entry.title}</h4>
                <p className="m-0 text-[0.9rem] leading-[1.65] text-[var(--text-muted)]" style={{ whiteSpace: 'pre-wrap' }}>{entry.content}</p>
              </article>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
