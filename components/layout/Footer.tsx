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

            <div className="social-icons" style={{ marginTop: '20px' }}>
                <a href="#" className="social-link" title="Facebook"><i className="fab fa-facebook-f"></i></a>
                <a href="#" className="social-link" title="Instagram"><i className="fab fa-instagram"></i></a>
                <a href="#" className="social-link" title="Twitter"><i className="fab fa-twitter"></i></a>
                <a href="#" className="social-link line-icon" title="Line"><i className="fab fa-line"></i></a> 
            </div>
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
                <li><a href="#">{data.healthArticles}</a></li>
                <li><a href="#">{data.privacyPolicy}</a></li>
            </ul>
        </div>
      </div>
      
      <div className="container footer-bottom">
        <p>{data.copyright}</p>
      </div>
    </footer>
  );
}