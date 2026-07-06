'use client';

// components/Footer.tsx
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer id="contact">
      <div className="container footer-grid">
        <div>
            <h4>{t('footer.clinicName')}</h4>
            <p className="contact-info">{t('footer.tagline')}</p>
            <p>{t('footer.address')}</p>
        </div>
        
        <div>
            <h4>{t('footer.contactUs')}</h4>
            <ul className="contact-list">
                <li className="contact-info">{t('footer.phone')}</li>
                <li>{t('footer.email')}</li>
                <li>{t('footer.lineId')}</li>
            </ul>

            <div className="social-icons" style={{ marginTop: '20px' }}>
                <a href="#" className="social-link" title="Facebook"><i className="fab fa-facebook-f"></i></a>
                <a href="#" className="social-link" title="Instagram"><i className="fab fa-instagram"></i></a>
                <a href="#" className="social-link" title="Twitter"><i className="fab fa-twitter"></i></a>
                <a href="#" className="social-link line-icon" title="Line"><i className="fab fa-line"></i></a> 
            </div>
        </div>
        
        <div>
            <h4>{t('footer.hours')}</h4>
            <p>{t('footer.hoursMonFri')}</p>
            <p>{t('footer.hoursSat')}</p>
            <p>{t('footer.hoursSun')}</p>
        </div>
        
        <div>
            <h4>{t('footer.quickLinks')}</h4>
            <ul>
                <li><Link href="/appointment">{t('footer.bookAppointment')}</Link></li>
                <li><a href="#">{t('footer.healthArticles')}</a></li>
                <li><a href="#">{t('footer.privacyPolicy')}</a></li>
            </ul>
        </div>
      </div>
      
      <div className="container footer-bottom">
        <p>{t('footer.copyright')}</p>
      </div>
    </footer>
  );
}