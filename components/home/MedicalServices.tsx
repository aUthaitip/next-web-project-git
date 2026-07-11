import ServiceCard from '@/components/home/ServiceCard';
import { Stethoscope, Brain, HeartPulse, Bath, HandPlatter } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function MedicalServices() {
  const { t } = useLanguage();
  
  const services = [
    { icon: <Stethoscope size={32} className="text-[#248f9b]" />, title: t('home.svc1Title'), description: t('home.svc1Desc') },
    { icon: <Brain size={32} className="text-[#248f9b]" />, title: t('home.svc2Title'), description: t('home.svc2Desc') },
    { icon: <HeartPulse size={32} className="text-[#248f9b]" />, title: t('home.svc3Title'), description: t('home.svc3Desc') },
    { icon: <Bath size={32} className="text-[#248f9b]" />, title: t('home.svc4Title'), description: t('home.svc4Desc') },
    { icon: <HandPlatter size={32} className="text-[#248f9b]" />, title: t('home.svc5Title'), description: t('home.svc5Desc') },
  ];

  return (
    <section id="services" className="services-section">
      <div className="container">
        <h2 className="section-title">{t('home.servicesTitle')}</h2>
        <div className="service-grid">
          {services.map((service, index) => (
            <ServiceCard key={index} {...service} />
          ))}
        </div>
      </div>
    </section>
  );
}
