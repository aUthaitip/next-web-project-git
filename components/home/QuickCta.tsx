import Link from 'next/link';
import { Calendar, PhoneCall, Star, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function QuickCta() {
  const { t } = useLanguage();
  return (
    <section id="quick-cta" className="cta-clean-section">
      <div className="container">
        <div className="cta-grid">
          <div className="cta-card">
            <div className="cta-header">
              <Calendar size={28} className="text-blue-600" />
              <h3>{t('home.ctaOnlineTitle')}</h3>
            </div>
            <p>{t('home.ctaOnlineDesc')}</p>
            <Link href="/appointment" className="btn-primary-blue">{t('home.ctaOnlineBtn')}</Link>
          </div>

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
  );
}
