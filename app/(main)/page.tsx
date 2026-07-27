'use client';

import Hero from '@/components/home/Hero';
import SpecializedFeatures from '@/components/home/SpecializedFeatures';
import MedicalServices from '@/components/home/MedicalServices';
import AboutClinic from '@/components/home/AboutClinic';
import QuickCta from '@/components/home/QuickCta';
import LocationSection from '@/components/home/LocationSection';
import FaqSection from '@/components/home/FaqSection';
import ContactForm from '@/components/home/ContactForm';

export default function HomePage() {
  return (
    <div className="homepage-wrapper">
      {/* 1. Hero Banner */}
      <Hero />

      <div className="main-content-layout">
        <div className="container main-grid">
          <main className="primary-content">
            
            {/* 2. Specialized Features (Eye, Neuro, Cardio, Imaging) */}
            <SpecializedFeatures />

            {/* 3. Medical Services (Clinic Specialty List) */}
            <MedicalServices />

            {/* 4. About Clinic */}
            <AboutClinic />

            <div className="divider"></div>

            {/* 5. Quick CTA (Online Booking, Emergency contact, Popular Links) */}
            <QuickCta />

            {/* 6. Location Map */}
            <LocationSection />

            {/* 7. FAQ Accordion */}
            <FaqSection />

            {/* 8. Contact Form Panel */}
            <ContactForm />

          </main>
        </div>
      </div>
    </div>
  );
}