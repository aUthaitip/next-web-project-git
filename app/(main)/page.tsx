'use client';

import Hero from '@/features/home/components/Hero';
import SpecializedFeatures from '@/features/home/components/SpecializedFeatures';
import MedicalServices from '@/features/home/components/MedicalServices';
import AboutClinic from '@/features/home/components/AboutClinic';
import QuickCta from '@/features/home/components/QuickCta';
import LocationSection from '@/features/home/components/LocationSection';
import FaqSection from '@/features/home/components/FaqSection';
import ContactForm from '@/features/home/components/ContactForm';

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