// app/page.tsx

'use client';
import { useState } from 'react';
import Link from 'next/link';
import ServiceCard from '@/components/ServiceCard';
import DoctorCard from '@/components/DoctorCard';
import {
  Eye, Brain, HeartPulse, Radiation, Stethoscope, Bath,
  HandPlatter, Calendar, ArrowRight, PhoneCall, Star, ChevronDown,
  Send, MessageSquare, Mail
} from 'lucide-react';
export default function HomePage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const services = [
    { icon: <Stethoscope size={32} className="text-[#248f9b]" />, title: "เวชศาสตร์ป้องกัน", description: "การฉีดวัคซีน, ตรวจสุขภาพประจำปี และการให้คำปรึกษาด้านโภชนาการ" },
    { icon: <Brain size={32} className="text-[#248f9b]" />, title: "คลินิกทันตกรรมย่อย", description: "บริการขูดหินปูน ดูแลช่องปาก และป้องกันโรคเหงือก" },
    { icon: <HeartPulse size={32} className="text-[#248f9b]" />, title: "คลินิกโรคหัวใจ", description: "วินิจฉัยและรักษาโรคหัวใจในสัตว์เลี้ยง" },
    { icon: <Bath size={32} className="text-[#248f9b]" />, title: "Pawplan Pet Care", description: "บริการอาบน้ำ ตัดขน และบริการฝากเลี้ยงระยะสั้น" },
    { icon: <HandPlatter size={32} className="text-[#248f9b]" />, title: "Other Services", description: "ฝังไมโครชิป และบริการอื่นๆ ที่ตอบโจทย์คุณ" },
  ];

  const faqData = [
    { q: "ต้องเตรียมอะไรบ้างเมื่อต้องพาสัตว์เลี้ยงมาตรวจ?", a: "กรุณานำประวัติสุขภาพ/วัคซีน และตัวอย่างปัสสาวะ/อุจจาระ (ถ้ามี) เพื่อการวินิจฉัยที่แม่นยำ" },
    { q: "วิธีติดต่อฉุกเฉินในเวลากลางคืน?", a: "ท่านสามารถโทรติดต่อเลขด่วน 24 ชม. ได้ที่เบอร์ 02-XXX-XXXX หรือช่องทาง Line Official" }
  ];

  // ข้อมูลสำหรับ Team Section (Quick CTA Team)
  const quickTeam = [
    // ข้อมูลเหล่านี้ถูกใช้เพื่อเติมเต็ม <article class="vet-card">
    { name: "สพ.ญ. ปาริฉัตร วงศ์วาน", role: "สัตวแพทย์หลัก / เวชศาสตร์ป้องกัน", imageSrc: "/assets/June.png" },
    { name: "สพ.ดร. ณัฐพงศ์ ศิริรัตน์", role: "ทันตกรรม", imageSrc: "/assets/Nut.png" },
    { name: "สพ.อริยา พงษ์ไพศาล", role: "โรคผิวหนังและภูมิแพ้", imageSrc: "/assets/Ari.png" },
  ];
      const [form, setForm] = useState({
      name: '',
      phone: '',
      email: '',
      service: '',
      message: '',
    });

    const handleChange = (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
      >
    ) => {
      const { name, value } = e.target;
      setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();

      try {
        const res = await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        });

        if (!res.ok) throw new Error('ส่งไม่สำเร็จ');

        alert('ส่งข้อความเรียบร้อยแล้ว');
        setForm({
          name: '',
          phone: '',
          email: '',
          service: '',
          message: '',
        });
      } catch (err) {
        alert('เกิดข้อผิดพลาด กรุณาลองใหม่');
      }
    };

  return (
    <div className="homepage-wrapper">

      <section className="hero hero-premium">
        <div className="container hero-layout">
          <div className="hero-content">
            <h1 className="hero-title">Pawplan</h1>
            <p className="hero-subtitle">สร้างความรู้สึกว่าคลินิกคือบ้านหลังที่สองของสัตว์เลี้ยง</p>
            <p className="hero-description">
              ดูแลสมาชิกครอบครัวด้วยหัวใจ วางแผนป้องกันทุกช่วงวัย
              เพื่อสุขภาพที่แข็งแรงและรอยยิ้มที่สดใสของเพื่อนรัก
            </p>
          </div>

          <div className="hero-image-wrapper">
            <div className="hero-image-container">
              <img
                src="/assets/1.png"
                alt="Pawplan Veterinary Clinic"
                className="hero-image"
              />
              <div className="hero-image-glow"></div>
            </div>
          </div>
        </div>
      </section>

      <div className="main-content-layout">
        <div className="container main-grid">
          <main className="primary-content">

            {/* -------------------- 2. Specialized Features -------------------- */}
            <section className="specialized-features" style={{ paddingTop: 0 }}>
              <h2 style={{ textAlign: 'left', marginBottom: '50px' }}>ศูนย์เฉพาะทางที่พร้อมให้บริการคุณ</h2>
              <div className="feature-grid">

                {/* CARD 1: Eye Care Center - โครงสร้างสมบูรณ์ */}
                <Link href="#" className="feature-card">
                  <div className="feature-icon-wrapper">
                    <span className="feature-icon">
                      <Eye size={60} strokeWidth={2} className="text-blue-500" />
                    </span>
                    <div className="feature-content">
                      <h3>Eye Care Center</h3>
                      <p>มองเห็นความรักผ่านดวงตาที่สดใส</p>
                    </div>
                  </div>
                  <div className="feature-image-wrapper">
                    <img src="/assets/2.png" alt="Eye Care Center" />
                  </div>
                </Link>

                {/* CARD 2: Neurological Center */}
                <Link href="#" className="feature-card">
                  <div className="feature-icon-wrapper">
                    <span className="feature-icon">
                      <Brain size={60} strokeWidth={2} className="text-blue-500" />
                    </span>
                    <div className="feature-content">
                      <h3>Neurological Center</h3>
                      <p>ให้เขากลับมาใช้ชีวิตอย่างมีความสุขอีกครั้ง</p>
                    </div>
                  </div>
                  <div className="feature-image-wrapper">
                    <img src="/assets/3.png" alt="Neurological Center" />
                  </div>
                </Link>

                {/* CARD 3: Cardio Center */}
                <Link href="#" className="feature-card">
                  <div className="feature-icon-wrapper">
                    <span className="feature-icon">
                      <HeartPulse size={60} strokeWidth={2} className="text-blue-500" />
                    </span>
                    <div className="feature-content">
                      <h3>Cardio Center</h3>
                      <p>คลีนิคจัดการโรคหัวใจได้ทุกระยะ</p>
                    </div>
                  </div>
                  <div className="feature-image-wrapper">
                    <img src="/assets/4.png" alt="Cardio Center" />
                  </div>
                </Link>

                {/* CARD 4: Diagnostic Imaging */}
                <Link href="#" className="feature-card">
                  <div className="feature-icon-wrapper">
                    <span className="feature-icon">
                      <Radiation size={60} strokeWidth={2} />
                    </span>
                    <div className="feature-content">
                      <h3>Diagnostic Imaging</h3>
                      <p>วินิจฉัยแม่นยำเพื่อการรักษาที่ตรงจุด</p>
                    </div>
                  </div>
                  <div className="feature-image-wrapper">
                    <img src="/assets/2.png" alt="Diagnostic Imaging" />
                  </div>
                </Link>
              </div>

            </section>

            {/* 3. Medical Services */}
            <section id="services" className="services-section">
              <div className="container">
                <h2 className="section-title">บริการทางการแพทย์พื้นฐาน</h2>
                <div className="service-grid">
                  {services.map((service, index) => (
                    <ServiceCard key={index} {...service} />
                  ))}
                </div>
              </div>
            </section>

            {/* -------------------- 4. About Clinic -------------------- */}
            <section className="about-clinic">
              <div className="container" style={{ padding: 0 }}>
                <div className="clinic-info">
                  <div className="clinic-image">
                    <img src="/assets/4.png" alt="ทีมสัตวแพทย์ Pawplan" />
                  </div>
                  <div className="clinic-text">
                    <h2>การดูแลที่ใส่ใจ เริ่มต้นที่ความเข้าใจ</h2>
                    <p>ทีมแพทย์ของเรานำโดย **สพ.ญ. ปาริฉัตร วงศ์วาน (หมอจูน)** ผู้มีประสบการณ์กว่า 10 ปี เราเน้นการดูแลแบบ **Pawplan** คือการวางแผนสุขภาพในระยะยาว ไม่ใช่เพียงแค่การรักษาอาการป่วยฉุกเฉินเท่านั้น</p>
                    <ul>
                      <li>แพทย์เวชปฏิบัติหลักประจำคลินิก</li>
                      <li>ระบบนัดหมายที่แม่นยำ</li>
                      <li>เครื่องมือวินิจฉัยพื้นฐานครบครัน (X-ray, Lab)</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            <div className="divider"></div>

            {/* 5. Quick CTA */}
            <section id="quick-cta" className="cta-clean-section">
              <div className="container">
                <div className="cta-grid">

                  {/* Box 1: นัดหมาย */}
                  <div className="cta-card">
                    <div className="cta-header">
                      <Calendar size={28} className="text-blue-600" />
                      <h3>นัดหมายออนไลน์</h3>
                    </div>
                    <p>จองเวลาพบสัตวแพทย์ได้ทันที เลือกบริการและวันที่สะดวก</p>
                    <Link href="/appointment" className="btn-primary-blue">จองนัดหมาย</Link>
                  </div>

                  {/* Box 2: ฉุกเฉิน (มีขอบแดงด้านบน) */}
                  <div className="cta-card emergency-border">
                    <div className="cta-header">
                      <PhoneCall size={28} className="text-red-500" />
                      <h3>ฉุกเฉิน/ติดต่อด่วน</h3>
                    </div>
                    <div className="emergency-info">
                      <span className="phone-num">02-XXX-XXXX</span>
                      <span className="badge-red">โทรด่วน 24 ชม.</span>
                    </div>
                    <p className="sub-text">บริการฉุกเฉินและแผนการรักษาเร่งด่วน</p>
                  </div>

                  {/* Box 3: บริการยอดนิยม */}
                  <div className="cta-card">
                    <div className="cta-header">
                      <Star size={28} className="text-yellow-500" />
                      <h3>บริการยอดนิยม</h3>
                    </div>
                    <ul className="cta-link-list">
                      <li><Link href="#"><ArrowRight size={16} /> วัคซีน & เวชศาสตร์ป้องกัน</Link></li>
                      <li><Link href="#"><ArrowRight size={16} /> Grooming & Boarding</Link></li>
                      <li><Link href="#"><ArrowRight size={16} /> โปรไฟล์สัตวแพทย์</Link></li>
                    </ul>
                  </div>

                </div>
              </div>
            </section>

            {/* -------------------- 7. Testimonials, Gallery, Location, FAQ, Contact Form -------------------- */}
            <section id="location" className="container section-location">
              <h2>แผนที่และที่ตั้ง</h2>
              <div className="map-wrap">
                <iframe
                  src="https://www.google.com/maps?q=Rangsit+University&output=embed"
                  width="100%"
                  height={300}
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                ></iframe>
              </div>
            </section>


            {/* FAQ Section  */}
            <section className="faq-section">
              <div className="container">
                <h2 className="section-header-left">คำถามที่พบบ่อย</h2>
                <div className="header-line"></div>
                {faqData.map((item, index) => (
                  <div key={index} className={`faq-item-box ${openFaq === index ? 'active' : ''}`}>
                    <button className="faq-question-btn" onClick={() => toggleFaq(index)}>
                      {item.q}
                      <ChevronDown className="faq-chevron" />
                    </button>
                    <div className="faq-answer-content">
                      <p>{item.a}</p>
                    </div>
                  </div>
                ))}

              </div>
            </section>

            {/* -------------------- Contact Form Section -------------------- */}
            <section className="contact-section">
              <div className="container">
                <div className="contact-card-wrapper">

                  {/* ฝั่งซ้าย: ข้อมูลการติดต่อ */}
                  <div className="contact-info-panel">
                    <div className="info-content">
                      <h2>ติดต่อเรา</h2>
                      <p className="subtitle">เราพร้อมดูแลสัตว์เลี้ยงตัวโปรดของคุณ ตลอดเวลาทำการ</p>

                      <div className="meta-info-list">
                        <div className="info-item">
                          <div className="icon-box"><Mail size={20} /></div>
                          <span>pawplan@gmail.com</span>
                        </div>
                        <div className="info-item">
                          <div className="icon-box"><MessageSquare size={20} /></div>
                          <span>@pawplanclinic</span>
                        </div>
                      </div>
                    </div>
                  
                    <div className="decoration-circle"></div>
                  </div>

                  {/* ฝั่งขวา: ฟอร์มกรอกข้อมูล */}
                  <form className="modern-form-body" onSubmit={handleSubmit}>
                    <div className="form-input-grid">
                      <div className="input-group">
                        <input 
                          type="text" 
                          name="name" 
                          placeholder="ชื่อ-นามสกุล" 
                          required 
                          value={form.name}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="input-group">
                        <input 
                          type="tel" 
                          name="phone" 
                          placeholder="เบอร์โทรศัพท์" 
                          required 
                          value={form.phone}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="input-group full-width">
                        <input 
                          type="email" 
                          name="email" 
                          placeholder="อีเมล" 
                          required
                          value={form.email}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="input-group full-width">
                        <select defaultValue="">
                        <option value="" disabled>
                          เลือกบริการที่ต้องการ
                        </option>
                        <option value="checkup">วัคซีน/ตรวจสุขภาพ</option>
                        <option value="emergency">ฉุกเฉิน</option>
                        <option value="grooming">ตัดขน/อาบน้ำ</option>
                        </select>
                      </div>
                      <div className="input-group full-width">
                        <textarea 
                          name="message" 
                          placeholder="รายละเอียดเพิ่มเติม..." 
                          rows={4}
                          value={form.message}
                          onChange={handleChange}
                        ></textarea>
                        
                      </div>
                    </div>

                    <button type="submit" className="btn-send-now">
                      <span>ส่งข้อความ</span>
                      <Send size={16} className="send-icon" />
                    </button>

                  </form>

                </div>
              </div>
            </section>

          </main>
        </div>
      </div>
    </div>
  );
}