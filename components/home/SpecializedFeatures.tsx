import Link from 'next/link';
import { Eye, Brain, HeartPulse, Radiation } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function SpecializedFeatures() {
  const { t } = useLanguage();
  return (
    <section className="specialized-features" style={{ paddingTop: 0 }}>
      <h2 style={{ textAlign: 'left', marginBottom: '50px' }}>{t('home.specializedTitle')}</h2>
      <div className="feature-grid">
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
  );
}
