import { useLanguage } from '@/context/LanguageContext';

export default function LocationSection() {
  const { t } = useLanguage();
  return (
    <section id="location" className="container section-location">
      <h2>{t('home.locationTitle')}</h2>
      <div className="map-wrap">
        <iframe
          src="https://www.google.com/maps?q=Rangsit+University&output=embed"
          width="100%"
          height={300}
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
        ></iframe>
      </div>
    </section>
  );
}
