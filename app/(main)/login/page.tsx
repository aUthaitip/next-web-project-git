'use client';

import LoginForm from '@/components/login/LoginForm';

export default function LoginPage() {
  return (
    <section style={{ backgroundColor: 'var(--bg-light)', minHeight: '100vh', display: 'flex', alignItems: 'center', padding: '60px 0' }}>
      <LoginForm />
    </section>
  );
}