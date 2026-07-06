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
import { useLanguage } from '@/context/LanguageContext';

export default function HomePage() {
  const { t } = useLanguage();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const services = [
    { icon: <Stethoscope size={32} className="text-[#248f9b]" />, title: t('home.svc1Title'), description: t('home.svc1Desc') },
    { icon: <Brain size={32} className="text-[#248f9b]" />, title: t('home.svc2Title'), description: t('home.svc2Desc') },
    { icon: <HeartPulse size={32} className="text-[#248f9b]" />, title: t('home.svc3Title'), description: t('home.svc3Desc') },
    { icon: <Bath size={32} className="text-[#248f9b]" />, title: t('home.svc4Title'), description: t('home.svc4Desc') },
    { icon: <HandPlatter size={32} className="text-[#248f9b]" />, title: t('home.svc5Title'), description: t('home.svc5Desc') },
  ];

  const faqData = [
    { q: t('home.faq1q'), a: t('home.faq1a') },
    { q: t('home.faq2q'), a: t('home.faq2a') },
  ];

  // ข้อมูลสำหรับ Team Section (Quick CTA Team)
  const quickTeam = [
    { name: t('home.team1Name'), role: t('home.team1Role'), imageSrc: '/assets/June.png' },
    { name: t('home.team2Name'), role: t('home.team2Role'), imageSrc: '/assets/Nut.png' },
    { name: t('home.team3Name'), role: t('home.team3Role'), imageSrc: '/assets/Ari.png' },
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

        if (!res.ok) throw new Error(t('home.sendError'));

        alert(t('home.sendSuccess'));
        setForm({
          name: '',
          phone: '',
          email: '',
          service: '',
          message: '',
        });
      } catch (err) {
        alert(t('home.sendError'));
      }
    };

  return (
    <div className="homepage-wrapper">

      <section className="hero hero-premium">
        <div className="container hero-layout">
          <div className="hero-content">
            <h1 className="hero-title">Pawplan</h1>
            <p className="hero-subtitle">{t('home.heroSubtitle')}</p>
            <p className="hero-description">
              {t('home.heroDesc')}
            </p>
          </div>

          <div className="hero-image-wrapper">
            <div className="hero-image-container">
              <img
                src="/assets/1.png"
                alt={t('home.heroImageAlt')}
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
              <h2 style={{ textAlign: 'left', marginBottom: '50px' }}>{t('home.specializedTitle')}</h2>
              <div className="feature-grid">

                {/* CARD 1: Eye Care Center - โครงสร้างสมบูรณ์ */}
                <Link href="#" className="feature-card">
                  <div className="feature-icon-wrapper">
                    <span className="feature-icon">
                      <Eye size={60} strokeWidth={2} className="text-blue-500" />
                    </span>
                    <div className="feature-content">
                      <h3>{t('home.eyeCareTitle')}</h3>
                      <p>{t('home.eyeCareDesc')}</p>
                    </div>
                  </div>
                  <div className="feature-image-wrapper">
                    <img src="/assets/2.png" alt={t('home.eyeCareTitle')} />
                  </div>
                </Link>

                {/* CARD 2: Neurological Center */}
                <Link href="#" className="feature-card">
                  <div className="feature-icon-wrapper">
                    <span className="feature-icon">
                      <Brain size={60} strokeWidth={2} className="text-blue-500" />
                    </span>
                    <div className="feature-content">
                      <h3>{t('home.neuroCenterTitle')}</h3>
                      <p>{t('home.neuroCenterDesc')}</p>
                    </div>
                  </div>
                  <div className="feature-image-wrapper">
                    <img src="/assets/3.png" alt={t('home.neuroCenterTitle')} />
                  </div>
                </Link>

                {/* CARD 3: Cardio Center */}
                <Link href="#" className="feature-card">
                  <div className="feature-icon-wrapper">
                    <span className="feature-icon">
                      <HeartPulse size={60} strokeWidth={2} className="text-blue-500" />
                    </span>
                    <div className="feature-content">
                      <h3>{t('home.cardioCenterTitle')}</h3>
                      <p>{t('home.cardioCenterDesc')}</p>
                    </div>
                  </div>
                  <div className="feature-image-wrapper">
                    <img src="/assets/4.png" alt={t('home.cardioCenterTitle')} />
                  </div>
                </Link>

                {/* CARD 4: Diagnostic Imaging */}
                <Link href="#" className="feature-card">
                  <div className="feature-icon-wrapper">
                    <span className="feature-icon">
                      <Radiation size={60} strokeWidth={2} />
                    </span>
                    <div className="feature-content">
                      <h3>{t('home.diagImagingTitle')}</h3>
                      <p>{t('home.diagImagingDesc')}</p>
                    </div>
                  </div>
                  <div className="feature-image-wrapper">
                    <img src="/assets/2.png" alt={t('home.diagImagingTitle')} />
                  </div>
                </Link>
              </div>

            </section>

            {/* 3. Medical Services */}
            <section id="services" className="services-section">
              <div className="container">
                <h2 className="section-title">{t('home.servicesTitle')}</h2>
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
                    <img src="/assets/4.png" alt={t('home.aboutImageAlt')} />
                  </div>
                  <div className="clinic-text">
                    <h2>{t('home.aboutTitle')}</h2>
                    <p>{t('home.aboutText')}</p>
                    <ul>
                      <li>{t('home.aboutLi1')}</li>
                      <li>{t('home.aboutLi2')}</li>
                      <li>{t('home.aboutLi3')}</li>
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
                      <h3>{t('home.ctaOnlineTitle')}</h3>
                    </div>
                    <p>{t('home.ctaOnlineDesc')}</p>
                    <Link href="/appointment" className="btn-primary-blue">{t('home.ctaOnlineBtn')}</Link>
                  </div>

                  {/* Box 2: ฉุกเฉิน (มีขอบแดงด้านบน) */}
                  <div className="cta-card emergency-border">
                    <div className="cta-header">
                      <PhoneCall size={28} className="text-red-500" />
                      <h3>{t('home.ctaEmergencyTitle')}</h3>
                    </div>
                    <div className="emergency-info">
                      <span className="phone-num">02-XXX-XXXX</span>
                      <span className="badge-red">{t('home.ctaEmergencyBadge')}</span>
                    </div>
                    <p className="sub-text">{t('home.ctaEmergencyDesc')}</p>
                  </div>

                  {/* Box 3: บริการยอดนิยม */}
                  <div className="cta-card">
                    <div className="cta-header">
                      <Star size={28} className="text-yellow-500" />
                      <h3>{t('home.ctaPopularTitle')}</h3>
                    </div>
                    <ul className="cta-link-list">
                      <li><Link href="#"><ArrowRight size={16} /> {t('home.ctaLink1')}</Link></li>
                      <li><Link href="#"><ArrowRight size={16} /> {t('home.ctaLink2')}</Link></li>
                      <li><Link href="#"><ArrowRight size={16} /> {t('home.ctaLink3')}</Link></li>
                    </ul>
                  </div>

                </div>
              </div>
            </section>

            {/* -------------------- 7. Testimonials, Gallery, Location, FAQ, Contact Form -------------------- */}
            <section id="location" className="container section-location">
              <h2>{t('home.locationTitle')}</h2>
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
                <h2 className="section-header-left">{t('home.faqTitle')}</h2>
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
            <section id="contact" className="contact-section">
              <div className="container">
                <div className="contact-card-wrapper">

                  {/* ฝั่งซ้าย: ข้อมูลการติดต่อ */}
                  <div className="contact-info-panel">
                    <div className="info-content">
                      <h2>{t('home.contactTitle')}</h2>
                      <p className="subtitle">{t('home.contactSubtitle')}</p>

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
                          placeholder={t('home.namePlaceholder')}
                          required 
                          value={form.name}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="input-group">
                        <input 
                          type="tel" 
                          name="phone" 
                          placeholder={t('home.phonePlaceholder')}
                          required 
                          value={form.phone}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="input-group full-width">
                        <input 
                          type="email" 
                          name="email" 
                          placeholder={t('home.emailPlaceholder')}
                          required
                          value={form.email}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="input-group full-width">
                        <select defaultValue="">
                        <option value="" disabled>
                          {t('home.selectService')}
                        </option>
                        <option value="checkup">{t('home.svcCheckup')}</option>
                        <option value="emergency">{t('home.svcEmergency')}</option>
                        <option value="grooming">{t('home.svcGrooming')}</option>
                        </select>
                      </div>
                      <div className="input-group full-width">
                        <textarea 
                          name="message" 
                          placeholder={t('home.notesPlaceholder')}
                          rows={4}
                          value={form.message}
                          onChange={handleChange}
                        ></textarea>
                        
                      </div>
                    </div>

                    <button type="submit" className="btn-send-now">
                      <span>{t('home.sendBtn')}</span>
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