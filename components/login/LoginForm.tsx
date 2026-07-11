'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';

export default function LoginForm() {
  const router = useRouter();
  const { t } = useLanguage();
  const [tab, setTab] = useState<'login' | 'register'>('login');

  // Login state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  // Register state
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirm, setRegConfirm] = useState('');
  const [regError, setRegError] = useState('');
  const [regSuccess, setRegSuccess] = useState('');
  const [regLoading, setRegLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError('');

    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: loginEmail, password: loginPassword }),
    });

    const data = await res.json();
    setLoginLoading(false);

    if (!res.ok) {
      setLoginError(data.error || t('login.genericError'));
      return;
    }

    window.dispatchEvent(new Event('user-auth-change'));
    router.push('/my-appointments');
    router.refresh();
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegLoading(true);
    setRegError('');
    setRegSuccess('');

    if (regPassword !== regConfirm) {
      setRegError(t('login.passwordMismatch'));
      setRegLoading(false);
      return;
    }

    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: regName, email: regEmail, phone: regPhone, password: regPassword }),
    });

    const data = await res.json();
    setRegLoading(false);

    if (!res.ok) {
      setRegError(data.error || t('login.genericError'));
      return;
    }

    setRegSuccess(t('login.registerSuccess'));
    setRegName(''); setRegEmail(''); setRegPhone('');
    setRegPassword(''); setRegConfirm('');
    setTimeout(() => setTab('login'), 1500);
  };

  return (
    <div className="container" style={{ maxWidth: 480, margin: '0 auto' }}>
      <div style={{ background: 'white', borderRadius: 16, boxShadow: '0 4px 24px rgba(0,0,0,0.08)', overflow: 'hidden' }}>

        {/* Header */}
        <div style={{ background: 'linear-gradient(135deg, #0d9488, #14b8a6)', padding: '32px', textAlign: 'center' }}>
          <div style={{ fontSize: 48 }}>🐾</div>
          <h2 style={{ color: 'white', margin: '8px 0 4px', fontSize: 24 }}>Pawplan</h2>
          <p style={{ color: '#ccfbf1', margin: 0, fontSize: 14 }}>{t('login.systemSubtitle')}</p>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', borderBottom: '1px solid #e5e7eb' }}>
          {(['login', 'register'] as const).map((tabKey) => (
            <button
              key={tabKey}
              onClick={() => setTab(tabKey)}
              style={{
                flex: 1, padding: '14px', border: 'none', cursor: 'pointer', fontSize: 15, fontFamily: 'inherit',
                fontWeight: tab === tabKey ? 700 : 400,
                color: tab === tabKey ? '#0d9488' : '#6b7280',
                background: 'white',
                borderBottom: tab === tabKey ? '2px solid #0d9488' : '2px solid transparent',
                transition: 'all 0.2s',
              }}
            >
              {tabKey === 'login' ? t('login.tabLogin') : t('login.tabRegister')}
            </button>
          ))}
        </div>

        <div style={{ padding: '32px' }}>

          {/* LOGIN FORM */}
          {tab === 'login' && (
            <form onSubmit={handleLogin}>
              {loginError && (
                <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', padding: '12px 16px', borderRadius: 8, marginBottom: 16, fontSize: 14 }}>
                  {loginError}
                </div>
              )}
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', marginBottom: 6, fontSize: 14, fontWeight: 600, color: '#374151' }}>{t('login.emailLabel')}</label>
                <input
                  type="email" required value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="example@email.com"
                  style={inputStyle}
                />
              </div>
              <div style={{ marginBottom: 24 }}>
                <label style={{ display: 'block', marginBottom: 6, fontSize: 14, fontWeight: 600, color: '#374151' }}>{t('login.passwordLabel')}</label>
                <input
                  type="password" required value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••"
                  style={inputStyle}
                />
              </div>
              <button type="submit" disabled={loginLoading} style={btnStyle}>
                {loginLoading ? t('login.loggingIn') : t('login.loginBtn')}
              </button>
              <p style={{ textAlign: 'center', marginTop: 16, fontSize: 14, color: '#6b7280' }}>
                {t('login.noAccount')}{' '}
                <button type="button" onClick={() => setTab('register')}
                  style={{ background: 'none', border: 'none', color: '#0d9488', cursor: 'pointer', fontWeight: 600, fontSize: 14 }}>
                  {t('login.goRegister')}
                </button>
              </p>
            </form>
          )}

          {/* REGISTER FORM */}
          {tab === 'register' && (
            <form onSubmit={handleRegister}>
              {regError && (
                <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', padding: '12px 16px', borderRadius: 8, marginBottom: 16, fontSize: 14 }}>
                  {regError}
                </div>
              )}
              {regSuccess && (
                <div style={{ background: '#f0fdf4', border: '1px solid #86efac', color: '#16a34a', padding: '12px 16px', borderRadius: 8, marginBottom: 16, fontSize: 14 }}>
                  {regSuccess}
                </div>
              )}
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', marginBottom: 6, fontSize: 14, fontWeight: 600, color: '#374151' }}>{t('login.nameLabel')}</label>
                <input type="text" required value={regName} onChange={(e) => setRegName(e.target.value)}
                  placeholder={t('login.namePlaceholder')} style={inputStyle} />
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', marginBottom: 6, fontSize: 14, fontWeight: 600, color: '#374151' }}>{t('login.emailLabel')}</label>
                <input type="email" required value={regEmail} onChange={(e) => setRegEmail(e.target.value)}
                  placeholder="example@email.com" style={inputStyle} />
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', marginBottom: 6, fontSize: 14, fontWeight: 600, color: '#374151' }}>{t('login.phoneLabel')}</label>
                <input type="tel" value={regPhone} onChange={(e) => setRegPhone(e.target.value)}
                  placeholder="08X-XXX-XXXX" style={inputStyle} />
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', marginBottom: 6, fontSize: 14, fontWeight: 600, color: '#374151' }}>{t('login.regPasswordLabel')}</label>
                <input type="password" required value={regPassword} onChange={(e) => setRegPassword(e.target.value)}
                  placeholder={t('login.regPasswordPlaceholder')} style={inputStyle} />
              </div>
              <div style={{ marginBottom: 24 }}>
                <label style={{ display: 'block', marginBottom: 6, fontSize: 14, fontWeight: 600, color: '#374151' }}>{t('login.confirmPasswordLabel')}</label>
                <input type="password" required value={regConfirm} onChange={(e) => setRegConfirm(e.target.value)}
                  placeholder="••••••••" style={inputStyle} />
              </div>
              <button type="submit" disabled={regLoading} style={btnStyle}>
                {regLoading ? t('login.registering') : t('login.registerBtn')}
              </button>
              <p style={{ textAlign: 'center', marginTop: 16, fontSize: 14, color: '#6b7280' }}>
                {t('login.hasAccount')}{' '}
                <button type="button" onClick={() => setTab('login')}
                  style={{ background: 'none', border: 'none', color: '#0d9488', cursor: 'pointer', fontWeight: 600, fontSize: 14 }}>
                  {t('login.goLogin')}
                </button>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '10px 14px', border: '1px solid #d1d5db',
  borderRadius: 8, fontSize: 15, fontFamily: 'inherit', outline: 'none',
  boxSizing: 'border-box', transition: 'border-color 0.2s',
};

const btnStyle: React.CSSProperties = {
  width: '100%', padding: '12px', background: 'linear-gradient(135deg, #0d9488, #14b8a6)',
  color: 'white', border: 'none', borderRadius: 8, fontSize: 16,
  fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', transition: 'opacity 0.2s',
};
