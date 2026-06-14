'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import NewsCard from '@/components/NewsCard';
import Modal from '@/components/NewsModal';

interface ApiEntry {
  id: number;
  title: string;
  content: string;
  imageUrl?: string;
  published: boolean;
}

export default function NewsActivitiesPage() {
  const [openModal, setOpenModal] = useState<null | 'modal-1' | 'modal-2' | 'modal-3' | 'modal-4' | 'modal-5' | 'modal-6'>(null);
  const [apiEntries, setApiEntries] = useState<ApiEntry[]>([]);
  const [openApiModal, setOpenApiModal] = useState<number | null>(null);

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
          <h2 className="page-title">🔔 ข่าวสารและกิจกรรม</h2>
          <div className="divider"></div>
          <div className="section-deco">
            <span className="decorative-bar" aria-hidden="true" />
          </div>

          {/* เนื้อหาเดิม — ไม่แตะ */}
          <div className="news-container">
            <div className="news-grid page-content">
              <NewsCard imgSrc="/assets/ข่าวสารและกิจกรรม_1.png" imgAlt="รูปภาพประกอบข่าวที่ 1" title='Pawplan คลินิก เปิดตัว "Smart Pet Care" นวัตกรรมใหม่' description="โรงพยาบาลสัตว์ Pawplan ยกระดับมาตรฐานการรักษาสัตว์เลี้ยง สู่ 'The Best Outcome' ด้วยการผสมผสานความเชี่ยวชาญของทีมสัตวแพทย์กับสุดยอดเทคโนโลยี..." onOpen={() => setOpenModal('modal-1')} />
              <NewsCard imgSrc="/assets/ข่าวสารและกิจกรรม_2.png" imgAlt="รูปภาพประกอบข่าวที่ 2" title='ขอเชิญร่วมงาน "Pawplan Groomer" เฟ้นหาสุดยอดช่างตัดขน' description="เปิดรับสมัครแล้ววันนี้! การประกวดตัดขนสุนัข ชิงถ้วยรางวัลเกียรติยศและเงินรางวัลมากมาย..." onOpen={() => setOpenModal('modal-2')} />
              <NewsCard imgSrc="/assets/ข่าวสารและกิจกรรม_3.png" imgAlt="รูปภาพประกอบข่าวที่ 3" title="ทีมสัตวแพทย์ Pawplan รับมอบเกียรติบัตร 'คลินิกมาตรฐาน'" description="ตอกย้ำความมุ่งมั่นในการให้บริการที่เป็นเลิศและมีคุณภาพ ปลอดภัยสำหรับสัตว์เลี้ยงทุกตัว..." onOpen={() => setOpenModal('modal-3')} />
              <NewsCard imgSrc="/assets/ข่าวสารและกิจกรรม_4.png" imgAlt="กิจกรรมบริจาคโลหิตสัตว์เลี้ยง" title='Pawplan ชวนบริจาคโลหิต "ต่อชีวิตให้เพื่อน"' description="โครงการธนาคารเลือดสำหรับสัตว์เลี้ยง เชิญชวนเจ้าของพาสัตว์เลี้ยงสุขภาพดี น้ำหนักเกิน 20 กก. มาร่วมบริจาค..." onOpen={() => setOpenModal('modal-4')} />
              <NewsCard imgSrc="/assets/ข่าวสารและกิจกรรม_5.png" imgAlt="โปรแกรมตรวจสุขภาพสัตว์เลี้ยงประจำปี" title="เริ่มแล้ว! โปรแกรมตรวจสุขภาพประจำปี 2568" description="เพราะการป้องกันดีกว่ารักษา เริ่มต้นปีใหม่ด้วยสุขภาพที่ดีของน้องๆ กับแพ็กเกจตรวจสุขภาพในราคาพิเศษ..." onOpen={() => setOpenModal('modal-5')} />
              <NewsCard imgSrc="/assets/ข่าวสารและกิจกรรม_6.png" imgAlt="ศูนย์กายภาพบำบัดสัตว์เลี้ยง Pawplan" title="เปิดแล้ว! ศูนย์กายภาพบำบัดและธาราบำบัด" description="ดูแลสัตว์เลี้ยงหลังผ่าตัด หรือมีปัญหาข้อกระดูก ด้วยสระว่ายน้ำระบบเกลือและลู่วิ่งใต้น้ำ โดยผู้เชี่ยวชาญ..." onOpen={() => setOpenModal('modal-6')} />
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
          <h2>Pawplan คลินิก เปิดตัว &quot;Smart Pet Care&quot; นวัตกรรมใหม่</h2>
          <p>โรงพยาบาลสัตว์ Pawplan มุ่งมั่นยกระดับมาตรฐานการรักษาสัตว์เลี้ยง สู่ &quot;The Best Outcome&quot; ด้วยการผสมผสานความเชี่ยวชาญของทีมสัตวแพทย์กับสุดยอดเทคโนโลยี</p>
          <p><strong>เทคโนโลยี AI ช่วยวิเคราะห์โรค:</strong> เพิ่มความแม่นยำในการวินิจฉัยตั้งแต่เริ่มต้น ทำให้การรักษาเป็นไปอย่างรวดเร็วและตรงจุด</p>
          <p><strong>ระบบจัดการคิวอัจฉริยะ (Smart Queue System):</strong> ออกแบบมาเพื่อลดเวลารอคอยอย่างมีประสิทธิภาพ</p>
        </Modal>
      )}
      {openModal === 'modal-2' && (
        <Modal onClose={() => setOpenModal(null)}>
          <Image src="/assets/ข่าวสารและกิจกรรม_2.png" alt="รูปภาพประกอบข่าวที่ 2" width={800} height={450} style={{ width: '100%', height: 'auto' }} />
          <h2>ขอเชิญร่วมงาน &quot;Pawplan Groomer&quot; เฟ้นหาสุดยอดช่างตัดขน</h2>
          <ul>
            <li>ชิงถ้วยรางวัลเกียรติยศ และเงินรางวัลรวมมูลค่ากว่า 100,000 บาท</li>
            <li>เปิดรับสมัครหลากหลายประเภท: มือใหม่ (Novice) และมืออาชีพ (Open Class)</li>
            <li>Workshop กับกรูมเมอร์ชื่อดัง</li>
          </ul>
        </Modal>
      )}
      {openModal === 'modal-3' && (
        <Modal onClose={() => setOpenModal(null)}>
          <Image src="/assets/ข่าวสารและกิจกรรม_3.png" alt="รูปภาพประกอบข่าวที่ 3" width={800} height={450} style={{ width: '100%', height: 'auto' }} />
          <h2>ทีมสัตวแพทย์ Pawplan รับมอบเกียรติบัตร &quot;คลินิกมาตรฐาน&quot;</h2>
          <p>ตอกย้ำความมุ่งมั่นในการให้บริการที่เป็นเลิศและมีคุณภาพ ปลอดภัยสำหรับสัตว์เลี้ยงทุกตัว</p>
        </Modal>
      )}
      {openModal === 'modal-4' && (
        <Modal onClose={() => setOpenModal(null)}>
          <Image src="/assets/ข่าวสารและกิจกรรม_4.png" alt="กิจกรรมบริจาคโลหิตสัตว์เลี้ยง" width={800} height={450} style={{ width: '100%', height: 'auto' }} />
          <h2>Pawplan ชวนบริจาคโลหิต &quot;ต่อชีวิตให้เพื่อน&quot;</h2>
          <p>โครงการธนาคารเลือดสำหรับสัตว์เลี้ยง — สุนัข/แมว อายุ 1-7 ปี สุขภาพดี น้ำหนักเกิน 20 กก.</p>
        </Modal>
      )}
      {openModal === 'modal-5' && (
        <Modal onClose={() => setOpenModal(null)}>
          <Image src="/assets/ข่าวสารและกิจกรรม_5.png" alt="โปรแกรมตรวจสุขภาพสัตว์เลี้ยงประจำปี" width={800} height={450} style={{ width: '100%', height: 'auto' }} />
          <h2>เริ่มแล้ว! โปรแกรมตรวจสุขภาพประจำปี 2568</h2>
          <p>แพ็กเกจรวม: ตรวจเลือด (CBC & Chemistry), ตรวจปัสสาวะ, เอ็กซเรย์ ในราคาพิเศษ</p>
        </Modal>
      )}
      {openModal === 'modal-6' && (
        <Modal onClose={() => setOpenModal(null)}>
          <Image src="/assets/ข่าวสารและกิจกรรม_6.png" alt="ศูนย์กายภาพบำบัดสัตว์เลี้ยง Pawplan" width={800} height={450} style={{ width: '100%', height: 'auto' }} />
          <h2>เปิดแล้ว! ศูนย์กายภาพบำบัดและธาราบำบัด Pawplan</h2>
          <p>สระว่ายน้ำระบบเกลือและลู่วิ่งใต้น้ำ ลดแรงกดต่อข้อต่อได้ถึง 70-90% โดยผู้เชี่ยวชาญเฉพาะทาง</p>
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