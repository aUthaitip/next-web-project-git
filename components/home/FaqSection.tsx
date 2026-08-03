'use client';
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { faqSectionData } from '@/data/home/FaqSection';

export default function FaqSection() {
  const { lang } = useLanguage();
  const data = faqSectionData[lang];
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const faqData = [
    { q: data.faq1q, a: data.faq1a },
    { q: data.faq2q, a: data.faq2a },
  ];

  return (
    <section className="faq-section">
      <div className="container">
        <h2 className="section-header-left">{data.faqTitle}</h2>
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
