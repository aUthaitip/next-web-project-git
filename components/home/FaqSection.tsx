'use client';
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function FaqSection() {
  const { t } = useLanguage();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const faqData = [
    { q: t('home.faq1q'), a: t('home.faq1a') },
    { q: t('home.faq2q'), a: t('home.faq2a') },
  ];

  return (
    <section className="faq-section">
      <div className="container">
        <h2 className="section-header-left">{t('home.faqTitle')}</h2>
        <div className="header-line"></div>
        {faqData.map((item, index) => (
          <div key={index} className={`faq-item-box ${openFaq === index ? 'active' : ''}`}>
            <button className="faq-question-btn" onClick={() => toggleFaq(index)} type="button">
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
  );
}
