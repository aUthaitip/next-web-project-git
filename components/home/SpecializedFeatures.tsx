import Link from 'next/link';
import { Eye, Brain, HeartPulse, Radiation } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { specializedFeaturesData } from '@/data/home/SpecializedFeatures';

export default function SpecializedFeatures() {
  const { lang } = useLanguage();
  const data = specializedFeaturesData[lang];
  return (
    <section className="specialized-features" style={{ paddingTop: 0 }}>
      <h2 style={{ textAlign: 'left', marginBottom: '50px' }}>{data.specializedTitle}</h2>
      <div className="feature-grid">
        <Link href="#" className="feature-card">
          <div className="feature-icon-wrapper">
            <span className="feature-icon">
              <Eye size={60} strokeWidth={2} className="text-blue-500" />
            </span>
            <div className="feature-content">
              <h3>{data.eyeCareTitle}</h3>
              <p>{data.eyeCareDesc}</p>
            </div>
          </div>
          <div className="feature-image-wrapper">
            <img src="/assets/2.png" alt={data.eyeCareTitle} />
          </div>
        </Link>
        <Link href="#" className="feature-card">
          <div className="feature-icon-wrapper">
            <span className="feature-icon">
              <Brain size={60} strokeWidth={2} className="text-blue-500" />
            </span>
            <div className="feature-content">
              <h3>{data.neuroCenterTitle}</h3>
              <p>{data.neuroCenterDesc}</p>
            </div>
          </div>
          <div className="feature-image-wrapper">
            <img src="/assets/3.png" alt={data.neuroCenterTitle} />
          </div>
        </Link>
        <Link href="#" className="feature-card">
          <div className="feature-icon-wrapper">
            <span className="feature-icon">
              <HeartPulse size={60} strokeWidth={2} className="text-blue-500" />
            </span>
            <div className="feature-content">
              <h3>{data.cardioCenterTitle}</h3>
              <p>{data.cardioCenterDesc}</p>
            </div>
          </div>
          <div className="feature-image-wrapper">
            <img src="/assets/4.png" alt={data.cardioCenterTitle} />
          </div>
        </Link>
        <Link href="#" className="feature-card">
          <div className="feature-icon-wrapper">
            <span className="feature-icon">
              <Radiation size={60} strokeWidth={2} />
            </span>
            <div className="feature-content">
              <h3>{data.diagImagingTitle}</h3>
              <p>{data.diagImagingDesc}</p>
            </div>
          </div>
          <div className="feature-image-wrapper">
            <img src="/assets/2.png" alt={data.diagImagingTitle} />
          </div>
        </Link>
      </div>
    </section>
  );
}
