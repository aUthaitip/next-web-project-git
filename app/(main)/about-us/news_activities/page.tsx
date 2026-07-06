'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import NewsCard from '@/components/NewsCard';
import Modal from '@/components/NewsModal';
import { useLanguage } from '@/context/LanguageContext';

interface ApiEntry {
  id: number;
  title: string;
  content: string;
  imageUrl?: string;
  published: boolean;
}

export default function NewsActivitiesPage() {
  const { t } = useLanguage();
  const [openModal, setOpenModal] = useState<null | 'modal-1' | 'modal-2' | 'modal-3' | 'modal-4' | 'modal-5' | 'modal-6'>(null);
  const [apiEntries, setApiEntries] = useState<ApiEntry[]>([]);
  const [openApiModal, setOpenApiModal] = useState<number | null>(null);

  useEffect(() => {
    console.log('NewsActivitiesPage openModal state changed:', openModal);
  }, [openModal]);

  useEffect(() => {
    console.log('NewsActivitiesPage openApiModal state changed:', openApiModal);
  }, [openApiModal]);

  useEffect(() => {
    fetch('/api/about-us?section=news_activities')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setApiEntries(data.filter((a) => a.published));
        }
      })
      .catch(console.error);
  }, []);

  return (
    <>
      <section className="content-section news-page page-animate">
        <div className="container">
          <h2 className="page-title">{t('news.title')}</h2>
          <div className="divider"></div>
          <div className="section-deco">
            <span className="decorative-bar" aria-hidden="true" />
          </div>

          {/* เนื้อหาเดิม — ไม่แตะ */}
          <div className="news-container">
            <div className="news-grid page-content">
              <NewsCard imgSrc="/assets/ข่าวสารและกิจกรรม_1.png" imgAlt="รูปภาพประกอบข่าวที่ 1" title={t('news.n1title')} description={t('news.n1desc')} onOpen={() => setOpenModal('modal-1')} />
              <NewsCard imgSrc="/assets/ข่าวสารและกิจกรรม_2.png" imgAlt="รูปภาพประกอบข่าวที่ 2" title={t('news.n2title')} description={t('news.n2desc')} onOpen={() => setOpenModal('modal-2')} />
              <NewsCard imgSrc="/assets/ข่าวสารและกิจกรรม_3.png" imgAlt="รูปภาพประกอบข่าวที่ 3" title={t('news.n3title')} description={t('news.n3desc')} onOpen={() => setOpenModal('modal-3')} />
              <NewsCard imgSrc="/assets/ข่าวสารและกิจกรรม_4.png" imgAlt="กิจกรรมบริจาคโลหิตสัตว์เลี้ยง" title={t('news.n4title')} description={t('news.n4desc')} onOpen={() => setOpenModal('modal-4')} />
              <NewsCard imgSrc="/assets/ข่าวสารและกิจกรรม_5.png" imgAlt="โปรแกรมตรวจสุขภาพสัตว์เลี้ยงประจำปี" title={t('news.n5title')} description={t('news.n5desc')} onOpen={() => setOpenModal('modal-5')} />
              <NewsCard imgSrc="/assets/ข่าวสารและกิจกรรม_6.png" imgAlt="ศูนย์กายภาพบำบัดสัตว์เลี้ยง Pawplan" title={t('news.n6title')} description={t('news.n6desc')} onOpen={() => setOpenModal('modal-6')} />
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
      </section>

      {/* Modals เดิม — ไม่แตะ */}
      {openModal === 'modal-1' && (
        <Modal onClose={() => setOpenModal(null)}>
          <Image src="/assets/ข่าวสารและกิจกรรม_1.png" alt="รูปภาพประกอบข่าวที่ 1" width={800} height={450} style={{ width: '100%', height: 'auto' }} />
          <h2>{t('news.m1title')}</h2>
          <p>{t('news.m1p1')}</p>
          <p>{t('news.m1p2')}</p>
          <p>{t('news.m1p3')}</p>
        </Modal>
      )}
      {openModal === 'modal-2' && (
        <Modal onClose={() => setOpenModal(null)}>
          <Image src="/assets/ข่าวสารและกิจกรรม_2.png" alt="รูปภาพประกอบข่าวที่ 2" width={800} height={450} style={{ width: '100%', height: 'auto' }} />
          <h2>{t('news.m2title')}</h2>
          <ul>
            <li>{t('news.m2li1')}</li>
            <li>{t('news.m2li2')}</li>
            <li>{t('news.m2li3')}</li>
          </ul>
        </Modal>
      )}
      {openModal === 'modal-3' && (
        <Modal onClose={() => setOpenModal(null)}>
          <Image src="/assets/ข่าวสารและกิจกรรม_3.png" alt="รูปภาพประกอบข่าวที่ 3" width={800} height={450} style={{ width: '100%', height: 'auto' }} />
          <h2>{t('news.m3title')}</h2>
          <p>{t('news.m3p')}</p>
        </Modal>
      )}
      {openModal === 'modal-4' && (
        <Modal onClose={() => setOpenModal(null)}>
          <Image src="/assets/ข่าวสารและกิจกรรม_4.png" alt="กิจกรรมบริจาคโลหิตสัตว์เลี้ยง" width={800} height={450} style={{ width: '100%', height: 'auto' }} />
          <h2>{t('news.m4title')}</h2>
          <p>{t('news.m4p')}</p>
        </Modal>
      )}
      {openModal === 'modal-5' && (
        <Modal onClose={() => setOpenModal(null)}>
          <Image src="/assets/ข่าวสารและกิจกรรม_5.png" alt="โปรแกรมตรวจสุขภาพสัตว์เลี้ยงประจำปี" width={800} height={450} style={{ width: '100%', height: 'auto' }} />
          <h2>{t('news.m5title')}</h2>
          <p>{t('news.m5p')}</p>
        </Modal>
      )}
      {openModal === 'modal-6' && (
        <Modal onClose={() => setOpenModal(null)}>
          <Image src="/assets/ข่าวสารและกิจกรรม_6.png" alt="ศูนย์กายภาพบำบัดสัตว์เลี้ยง Pawplan" width={800} height={450} style={{ width: '100%', height: 'auto' }} />
          <h2>{t('news.m6title')}</h2>
          <p>{t('news.m6p')}</p>
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