'use client';

import ProfileForm from '@/components/profile/ProfileForm';
import HideFooter from '@/components/layout/HideFooter';

export default function ProfilePage() {
  return (
    <section style={{ backgroundColor: 'var(--bg-light)', minHeight: '100vh', padding: '40px 0' }}>
      <HideFooter />
      <ProfileForm />
    </section>
  );
}
