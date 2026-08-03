import { useLanguage } from '@/context/LanguageContext';
import { heroData } from '@/data/home/Hero';

export default function Hero() {
  const { lang } = useLanguage();
  const data = heroData[lang];
  return (
    <section className="hero hero-premium">
      <div className="container hero-layout">
        <div className="hero-content">
          <h1 className="hero-title">Pawplan</h1>
          <p className="hero-subtitle">{data.heroSubtitle}</p>
          <p className="hero-description">{data.heroDesc}</p>
        </div>
        <div className="hero-image-wrapper">
          <div className="hero-image-container">
            <img src="/assets/1.png" alt={data.heroImageAlt} className="hero-image" />
            <div className="hero-image-glow"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
