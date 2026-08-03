import Link from 'next/link';
import { Calendar, PhoneCall, Star, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { quickCtaData } from '@/data/home/QuickCta';

export default function QuickCta() {
  const { lang } = useLanguage();
  const data = quickCtaData[lang];
  return (
    <section id="quick-cta" className="cta-clean-section">
      <div className="container">
        <div className="cta-grid">
          <div className="cta-card">
            <div className="cta-header">
              <Calendar size={28} className="text-blue-600" />
              <h3>{data.ctaOnlineTitle}</h3>
            </div>
            <p>{data.ctaOnlineDesc}</p>
            <Link href="/appointment" className="btn-primary-blue">{data.ctaOnlineBtn}</Link>
          </div>

          <div className="cta-card emergency-border">
            <div className="cta-header">
              <PhoneCall size={28} className="text-red-500" />
              <h3>{data.ctaEmergencyTitle}</h3>
            </div>
            <div className="emergency-info">
              <span className="phone-num">02-XXX-XXXX</span>
              <span className="badge-red">{data.ctaEmergencyBadge}</span>
            </div>
            <p className="sub-text">{data.ctaEmergencyDesc}</p>
          </div>

          <div className="cta-card">
            <div className="cta-header">
              <Star size={28} className="text-yellow-500" />
              <h3>{data.ctaPopularTitle}</h3>
            </div>
            <ul className="cta-link-list">
              <li><Link href="#"><ArrowRight size={16} /> {data.ctaLink1}</Link></li>
              <li><Link href="#"><ArrowRight size={16} /> {data.ctaLink2}</Link></li>
              <li><Link href="#"><ArrowRight size={16} /> {data.ctaLink3}</Link></li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
