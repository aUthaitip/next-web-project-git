'use client';

import DoctorList from '@/components/doctors/DoctorList';

export default function DoctorsPage() {
  return (
    <section className="content-section doctors-page page-animate">
      <DoctorList />
    </section>
  );
}