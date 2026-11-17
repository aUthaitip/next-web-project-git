'use client';

import DoctorList from '@/features/doctors/components/DoctorList';

export default function DoctorsPage() {
  return (
    <section className="content-section doctors-page page-animate">
      <DoctorList />
    </section>
  );
}