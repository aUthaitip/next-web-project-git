'use client';

import { useState } from 'react';

interface AdminLoginFormProps {
  onSuccess: () => void;
}

const ADMIN_EMAIL = 'Admin11@gmail.com';
const ADMIN_PASSWORD = '123456789';
const THEME = '#248f9b';

export default function AdminLoginForm({ onSuccess }: AdminLoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      sessionStorage.setItem('admin_authenticated', 'true');
      onSuccess();
    } else {
      setError('อีเมลหรือรหัสผ่านไม่ถูกต้อง');
    }
    setLoading(false);
  };

  return (
    <div
      className="min-h-screen flex flex-col md:flex-row"
      style={{ fontFamily: "'Kanit', sans-serif" }}
    >
      <style>{`
        input:-webkit-autofill,
        input:-webkit-autofill:hover,
        input:-webkit-autofill:focus {
          -webkit-text-fill-color: #1f2937;
          -webkit-box-shadow: 0 0 0px 1000px #ffffff inset;
          transition: background-color 9999s ease-in-out 0s;
        }
      `}</style>

      {/* Left side — illustration */}
      <div className="hidden md:flex flex-1 items-center justify-center bg-white p-10">
        <svg viewBox="0 0 420 380" className="w-full max-w-md">
          {/* floor shadow */}
          <ellipse cx="190" cy="345" rx="150" ry="14" fill="#f1f5f9" />

          {/* bookshelf */}
          <rect x="270" y="240" width="90" height="90" rx="4" fill="#e5e7eb" />
          {[0, 1, 2].map((row) => (
            <g key={row}>
              <rect x="278" y={248 + row * 27} width="8" height="20" fill={THEME} opacity="0.8" />
              <rect x="290" y={248 + row * 27} width="8" height="20" fill="#cbd5e1" />
              <rect x="302" y={248 + row * 27} width="8" height="20" fill={THEME} opacity="0.5" />
              <rect x="314" y={248 + row * 27} width="8" height="20" fill="#cbd5e1" />
              <rect x="326" y={248 + row * 27} width="8" height="20" fill={THEME} opacity="0.8" />
              <rect x="338" y={248 + row * 27} width="8" height="20" fill="#cbd5e1" />
            </g>
          ))}

          {/* plant */}
          <rect x="205" y="300" width="34" height="30" rx="3" fill="#1f2937" />
          <path d="M222 300 C 205 270, 205 250, 222 240 C 239 250, 239 270, 222 300 Z" fill={THEME} opacity="0.9" />
          <path d="M222 300 C 210 280, 210 265, 222 255" stroke="#ffffff" strokeWidth="1.5" opacity="0.4" fill="none" />

          {/* trash bin */}
          <path d="M175 300 L 180 335 L 205 335 L 210 300 Z" fill="#dbeafe" stroke={THEME} strokeWidth="1.5" />
          <line x1="180" y1="308" x2="205" y2="308" stroke={THEME} strokeWidth="1" />
          <line x1="182" y1="316" x2="203" y2="316" stroke={THEME} strokeWidth="1" />
          <line x1="184" y1="324" x2="201" y2="324" stroke={THEME} strokeWidth="1" />

          {/* clock on wall */}
          <circle cx="230" cy="70" r="14" fill="#f3f4f6" stroke="#d1d5db" strokeWidth="2" />
          <line x1="230" y1="70" x2="230" y2="61" stroke="#9ca3af" strokeWidth="2" />
          <line x1="230" y1="70" x2="236" y2="70" stroke="#9ca3af" strokeWidth="2" />

          {/* background city silhouette */}
          <rect x="60" y="120" width="70" height="150" fill="#f3f4f6" />
          <circle cx="95" cy="150" r="16" fill={THEME} opacity="0.85" />
          <g opacity="0.5">
            {[0, 1, 2, 3].map((r) =>
              [0, 1, 2].map((c) => (
                <rect key={`${r}-${c}`} x={68 + c * 10} y={190 + r * 14} width="5" height="8" fill={THEME} />
              ))
            )}
          </g>

          {/* desk */}
          <rect x="70" y="255" width="220" height="10" rx="2" fill={THEME} />
          <rect x="80" y="265" width="10" height="70" fill="#374151" />
          <rect x="270" y="265" width="10" height="70" fill="#374151" />

          {/* monitor with sign-in card */}
          <rect x="150" y="150" width="120" height="105" rx="6" fill="#bfdbfe" stroke={THEME} strokeWidth="2" />
          <rect x="160" y="162" width="100" height="10" rx="2" fill="#ffffff" />
          <rect x="160" y="180" width="80" height="12" rx="6" fill="#ffffff" />
          <rect x="160" y="198" width="80" height="12" rx="6" fill="#ffffff" />
          <rect x="160" y="220" width="80" height="14" rx="7" fill={THEME} />

          {/* monitor stand */}
          <rect x="200" y="255" width="20" height="14" fill="#9ca3af" />
          <rect x="190" y="269" width="40" height="6" rx="3" fill="#9ca3af" />

          {/* chair */}
          <rect x="60" y="240" width="14" height="60" rx="6" fill="#1f2937" />
          <path d="M60 240 Q 55 210 75 200 L 78 210 Q 65 218 68 240 Z" fill="#1f2937" />
          <line x1="67" y1="300" x2="67" y2="330" stroke="#4b5563" strokeWidth="6" />
          <ellipse cx="67" cy="333" rx="18" ry="5" fill="#6b7280" />

          {/* person */}
          <circle cx="110" cy="205" r="14" fill="#8a5a3c" />
          <path d="M96 200 Q 110 185 124 200 L 122 195 Q 110 185 98 195 Z" fill="#1f2937" />
          <path d="M95 220 Q 110 210 130 222 L 132 260 Q 110 270 92 260 Z" fill="#374151" />
          <rect x="98" y="255" width="14" height="45" rx="4" fill={THEME} opacity="0.9" />
          <rect x="115" y="255" width="14" height="45" rx="4" fill={THEME} opacity="0.9" />
          <rect x="96" y="295" width="18" height="8" rx="4" fill="#1f2937" />
          <rect x="113" y="295" width="18" height="8" rx="4" fill="#1f2937" />
          <path d="M124 225 Q 145 232 152 245" stroke="#8a5a3c" strokeWidth="8" strokeLinecap="round" fill="none" />
        </svg>
      </div>

      {/* Right side — form panel */}
      <div
        className="flex-1 relative flex items-center justify-center overflow-hidden py-16 px-4"
        style={{ background: THEME }}
      >
        {/* decorative arcs bottom-right */}
        <svg className="absolute bottom-0 right-0 w-72 h-72 opacity-30 pointer-events-none" viewBox="0 0 300 300">
          <circle cx="300" cy="300" r="140" stroke="#ffffff" strokeWidth="1.5" fill="none" />
          <circle cx="300" cy="300" r="180" stroke="#ffffff" strokeWidth="1.5" fill="none" />
        </svg>

        {/* Card */}
        <div
          className="relative z-10 w-full bg-white"
          style={{
            maxWidth: '440px',
            borderRadius: '28px',
            padding: '40px 36px',
            boxShadow: '0 30px 60px -15px rgba(0,0,0,0.35), 0 0 0 1px rgba(255,255,255,0.06)',
          }}
        >
          {/* Logo badge */}
          <div
            className="flex items-center justify-center"
            style={{ width: '56px', height: '56px', borderRadius: '16px', background: `${THEME}14`, marginBottom: '24px' }}
          >
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
              <path
                d="M6.5 9.5c1.1 0 2-1.1 2-2.5S7.6 4.5 6.5 4.5 4.5 5.6 4.5 7s.9 2.5 2 2.5Zm11 0c1.1 0 2-1.1 2-2.5S18.6 4.5 17.5 4.5 15.5 5.6 15.5 7s.9 2.5 2 2.5Zm-8-2c1.1 0 2-1.3 2-3s-.9-3-2-3-2 1.3-2 3 .9 3 2 3Zm5 0c1.1 0 2-1.3 2-3s-.9-3-2-3-2 1.3-2 3 .9 3 2 3ZM12 12.5c-3 0-6.5 1.6-6.5 4.3 0 1.5 1.3 2.7 2.9 2.5 1.1-.1 2.1-.7 3.6-.7s2.5.6 3.6.7c1.6.2 2.9-1 2.9-2.5 0-2.7-3.5-4.3-6.5-4.3Z"
                fill={THEME}
              />
            </svg>
          </div>

          <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#1f2937', lineHeight: 1.2, margin: 0 }}>Hello!</h1>
          <p style={{ marginTop: '8px', fontSize: '15px', color: '#9ca3af' }}>เข้าสู่ระบบ PawPlan Admin</p>

          <form onSubmit={handleSubmit} style={{ marginTop: '32px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
            {/* Email */}
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={THEME} strokeWidth="2">
                  <rect x="3" y="5" width="18" height="14" rx="2" />
                  <path d="m4 6 8 7 8-7" />
                </svg>
              </span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email Address"
                required
                className="w-full outline-none transition-all duration-200"
                style={{
                  padding: '14px 16px 14px 44px',
                  borderRadius: '16px',
                  fontSize: '15px',
                  border: '1.5px solid #e5e7eb',
                  background: '#f9fafb',
                  color: '#1f2937',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = THEME;
                  e.target.style.background = '#ffffff';
                  e.target.style.boxShadow = `0 0 0 4px ${THEME}1a`;
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#e5e7eb';
                  e.target.style.background = '#f9fafb';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>

            {/* Password */}
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={THEME} strokeWidth="2">
                  <rect x="4" y="10" width="16" height="10" rx="2" />
                  <path d="M8 10V7a4 4 0 0 1 8 0v3" />
                </svg>
              </span>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
                className="w-full outline-none transition-all duration-200"
                style={{
                  padding: '14px 44px 14px 44px',
                  borderRadius: '16px',
                  fontSize: '15px',
                  border: '1.5px solid #e5e7eb',
                  background: '#f9fafb',
                  color: '#1f2937',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = THEME;
                  e.target.style.background = '#ffffff';
                  e.target.style.boxShadow = `0 0 0 4px ${THEME}1a`;
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#e5e7eb';
                  e.target.style.background = '#f9fafb';
                  e.target.style.boxShadow = 'none';
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center"
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af' }}
              >
                {showPassword ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 3l18 18M10.6 10.6a2 2 0 0 0 2.8 2.8M9.3 5.3A9.7 9.7 0 0 1 12 5c5 0 9 4 10 7-.4 1.1-1.2 2.4-2.3 3.6M6.6 6.6C4.6 8 3.4 9.9 3 12c1 3 5 7 10 7 1.3 0 2.5-.3 3.6-.7" />
                  </svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7Z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>

            {/* Error */}
            {error && (
              <div
                className="flex items-center gap-2"
                style={{ borderRadius: '14px', padding: '12px 16px', fontSize: '14px', background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626' }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0">
                  <circle cx="12" cy="12" r="9" />
                  <path d="M12 8v5M12 16h.01" />
                </svg>
                <span>{error}</span>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full transition-all duration-200"
              style={{
                marginTop: '6px',
                padding: '15px',
                borderRadius: '16px',
                fontWeight: 600,
                fontSize: '15px',
                color: '#ffffff',
                ...(loading
                  ? { background: '#a5c5c9', cursor: 'not-allowed' }
                  : { background: THEME, boxShadow: `0 10px 24px -6px ${THEME}80`, cursor: 'pointer' }),
              }}
              onMouseEnter={(e) => {
                if (!loading) (e.target as HTMLButtonElement).style.filter = 'brightness(1.08)';
              }}
              onMouseLeave={(e) => {
                if (!loading) (e.target as HTMLButtonElement).style.filter = 'brightness(1)';
              }}
            >
              {loading ? 'กำลังตรวจสอบ...' : 'Login'}
            </button>

            <p style={{ textAlign: 'center', fontSize: '12px', color: '#9ca3af', marginTop: '4px' }}>
              เฉพาะผู้ดูแลระบบเท่านั้น
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
