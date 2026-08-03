'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import NewsCard from '@/components/about-us/NewsCard';
import Modal from '@/components/about-us/NewsModal';
import { useLanguage } from '@/context/LanguageContext';
import { newsActivitiesData } from '@/data/about-us/NewsActivitiesContent';

interface ApiEntry {
  id: number;
  title: string;
  content: string;
  imageUrl?: string;
  published: boolean;
}

type ModalId = 'modal-1' | 'modal-2' | 'modal-3' | 'modal-4' | 'modal-5' | 'modal-6';

export default function NewsActivitiesContent() {
  const { lang } = useLanguage();
  const data = newsActivitiesData[lang];

  const [openModal, setOpenModal] = useState<null | ModalId>(null);
  const [apiEntries, setApiEntries] = useState<ApiEntry[]>([]);
  const [openApiModal, setOpenApiModal] = useState<number | null>(null);

  useEffect(() => {
    fetch('/api/about-us?section=news_activities')
      .then((res) => res.json())
      .then((result) => {
        if (Array.isArray(result)) {
          setApiEntries(result.filter((a) => a.published));
        }
      })
      .catch(console.error);
  }, []);

  const activeModal = data.modals.find((m) => m.id === openModal);

  return (
    <>
      <div className="container">
        <h2 className="page-title">{data.title}</h2>
        <div className="divider"></div>
        <div className="section-deco">
          <span className="decorative-bar" aria-hidden="true" />
        </div>

        {/* News Cards */}
        <div className="news-container">
          <div className="news-grid page-content">
            {data.newsItems.map((item) => (
              <NewsCard
                key={item.id}
                imgSrc={item.imgSrc}
                imgAlt={item.imgAlt}
                title={item.title}
                description={item.description}
                readMore={data.readMore}
                onOpen={() => setOpenModal(item.id)}
              />
            ))}
          </div>
        </div>

        {/* ส่วนเพิ่มเติมจาก Admin CRUD */}
        {apiEntries.length > 0 && (
          <div style={{ marginTop: 48 }}>
            <div className="news-grid">
              {apiEntries.map((entry) => (
                <NewsCard
                  key={entry.id}
                  imgSrc={entry.imageUrl || '/assets/ข่าวสารและกิจกรรม_1.png'}
                  imgAlt={entry.title}
                  title={entry.title}
                  description={entry.content.length > 100 ? entry.content.slice(0, 100) + '...' : entry.content}
                  onOpen={() => setOpenApiModal(entry.id)}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Modal จาก data */}
      {activeModal && (
        <Modal onClose={() => setOpenModal(null)}>
          <Image
            src={activeModal.imgSrc}
            alt={activeModal.imgAlt}
            width={800}
            height={450}
            style={{ width: '100%', height: 'auto' }}
          />
          <h2>{activeModal.title}</h2>
          {activeModal.paragraphs?.map((p, i) => <p key={i}>{p}</p>)}
          {activeModal.listItems && (
            <ul>
              {activeModal.listItems.map((item, i) => <li key={i}>{item}</li>)}
            </ul>
          )}
        </Modal>
      )}

      {/* Modal สำหรับ API entries */}
      {openApiModal !== null && (() => {
        const entry = apiEntries.find((e) => e.id === openApiModal);
        if (!entry) return null;
        return (
          <Modal onClose={() => setOpenApiModal(null)}>
            {entry.imageUrl && (
              <img src={entry.imageUrl} alt={entry.title} style={{ width: '100%', borderRadius: 8, marginBottom: 16 }} />
            )}
            <h2>{entry.title}</h2>
            <p style={{ whiteSpace: 'pre-wrap' }}>{entry.content}</p>
          </Modal>
        );
      })()}
    </>
  );
}
