import { useLanguage } from '@/context/LanguageContext';

export default function Hero() {
  const { t } = useLanguage();
  return (
    <section className="hero hero-premium">
      <div className="container hero-layout">
        <div className="hero-content">
          <h1 className="hero-title">Pawplan</h1>
          <p className="hero-subtitle">{t('home.heroSubtitle')}</p>
          <p className="hero-description">{t('home.heroDesc')}</p>
        </div>
        <div className="hero-image-wrapper">
          <div className="hero-image-container">
            <img src="/assets/1.png" alt={t('home.heroImageAlt')} className="hero-image" />
            <div className="hero-image-glow"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
