import { useLanguage } from '@/context/LanguageContext';
import { aboutClinicData } from '@/data/home/AboutClinic';

export default function AboutClinic() {
  const { lang } = useLanguage();
  const data = aboutClinicData[lang];
  return (
    <section className="about-clinic">
      <div className="container" style={{ padding: 0 }}>
        <div className="clinic-info">
          <div className="clinic-image">
            <img src="/assets/4.png" alt={data.aboutImageAlt} />
          </div>
          <div className="clinic-text">
            <h2>{data.aboutTitle}</h2>
            <p>{data.aboutText}</p>
            <ul>
              <li>{data.aboutLi1}</li>
              <li>{data.aboutLi2}</li>
              <li>{data.aboutLi3}</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
