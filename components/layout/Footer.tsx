'use client';

// components/Footer.tsx
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { footerData } from '@/data/layout/Footer';

export default function Footer() {
  const { lang } = useLanguage();
  const data = footerData[lang];

  return (
    <footer id="contact">
      <div className="container footer-grid">
        <div>
            <h4>{data.clinicName}</h4>
            <p className="contact-info">{data.tagline}</p>
            <p>{data.address}</p>
        </div>
        
        <div>
            <h4>{data.contactUs}</h4>
            <ul className="contact-list">
                <li className="contact-info">{data.phone}</li>
                <li>{data.email}</li>
                <li>{data.lineId}</li>
            </ul>
        </div>
        
        <div>
            <h4>{data.hours}</h4>
            <p>{data.hoursMonFri}</p>
            <p>{data.hoursSat}</p>
            <p>{data.hoursSun}</p>
        </div>
        
        <div>
            <h4>{data.quickLinks}</h4>
            <ul>
                <li><Link href="/appointment">{data.bookAppointment}</Link></li>
                <li><Link href="/articles/health-tips">{data.healthArticles}</Link></li>
                <li><Link href="/#contact">{data.privacyPolicy}</Link></li>
            </ul>
        </div>
      </div>
      
      <div className="container footer-bottom">
        <p>{data.copyright}</p>
      </div>
    </footer>
  );
}