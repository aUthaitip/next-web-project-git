'use client';

import ProfileForm from '@/features/profile/components/ProfileForm';

export default function ProfilePage() {
  return (
    <section style={{ backgroundColor: 'var(--bg-light)', minHeight: '100vh', padding: '40px 0' }}>
      <ProfileForm />
    </section>
  );
}
