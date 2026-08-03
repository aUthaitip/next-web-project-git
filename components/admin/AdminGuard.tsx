'use client';

import { useEffect, useState } from 'react';
import AdminLoginForm from '@/components/admin/AdminLoginForm';

const THEME = '#248f9b';

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const isAuth = sessionStorage.getItem('admin_authenticated') === 'true';
    setAuthenticated(isAuth);
  }, []);

  // ยังโหลดอยู่
  if (authenticated === null) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '16px',
          background: '#ffffff',
        }}
      >
        <div
          style={{
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            border: '4px solid rgba(36, 143, 155, 0.15)',
            borderTop: `4px solid ${THEME}`,
            animation: 'spin 0.8s linear infinite',
          }}
        />
        <p style={{ color: THEME, fontFamily: "'Kanit', sans-serif", fontSize: '14px' }}>
          กำลังตรวจสอบสิทธิ์...
        </p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  // ยังไม่ได้ login
  if (!authenticated) {
    return <AdminLoginForm onSuccess={() => setAuthenticated(true)} />;
  }

  // ผ่านแล้ว
  return <>{children}</>;
}