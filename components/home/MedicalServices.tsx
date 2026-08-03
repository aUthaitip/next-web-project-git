import ServiceCard from '@/components/home/ServiceCard';
import { Stethoscope, Brain, HeartPulse, Bath, HandPlatter } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { medicalServicesData } from '@/data/home/MedicalServices';

export default function MedicalServices() {
  const { lang } = useLanguage();
  const data = medicalServicesData[lang];
  
  const services = [
    { icon: <Stethoscope size={32} className="text-[#248f9b]" />, title: data.svc1Title, description: data.svc1Desc },
    { icon: <Brain size={32} className="text-[#248f9b]" />, title: data.svc2Title, description: data.svc2Desc },
    { icon: <HeartPulse size={32} className="text-[#248f9b]" />, title: data.svc3Title, description: data.svc3Desc },
    { icon: <Bath size={32} className="text-[#248f9b]" />, title: data.svc4Title, description: data.svc4Desc },
    { icon: <HandPlatter size={32} className="text-[#248f9b]" />, title: data.svc5Title, description: data.svc5Desc },
  ];

  return (
    <section id="services" className="services-section">
      <div className="container">
        <h2 className="section-title">{data.servicesTitle}</h2>
        <div className="service-grid">
          {services.map((service, index) => (
            <ServiceCard key={index} {...service} />
          ))}
        </div>
      </div>
    </section>
  );
}
