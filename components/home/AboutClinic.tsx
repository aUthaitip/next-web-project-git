import { useLanguage } from '@/context/LanguageContext';

export default function AboutClinic() {
  const { t } = useLanguage();
  return (
    <section className="about-clinic">
      <div className="container" style={{ padding: 0 }}>
        <div className="clinic-info">
          <div className="clinic-image">
            <img src="/assets/4.png" alt={t('home.aboutImageAlt')} />
          </div>
          <div className="clinic-text">
            <h2>{t('home.aboutTitle')}</h2>
            <p>{t('home.aboutText')}</p>
            <ul>
              <li>{t('home.aboutLi1')}</li>
              <li>{t('home.aboutLi2')}</li>
              <li>{t('home.aboutLi3')}</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
