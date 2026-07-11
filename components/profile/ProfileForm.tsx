'use client';
import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { User, Mail, Phone, Lock, Save, ArrowLeft, CheckCircle, AlertCircle, Eye, EyeOff, Camera, Loader2 } from 'lucide-react';

export default function ProfileForm() {
  const router = useRouter();
  const { lang, t } = useLanguage();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Form Fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Password visibility states
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Translations via i18n
  const localized = {
    title: t('profile.title'),
    subtitle: t('profile.subtitle'),
    nameLabel: t('profile.nameLabel'),
    emailLabel: t('profile.emailLabel'),
    phoneLabel: t('profile.phoneLabel'),
    changePasswordTitle: t('profile.changePasswordTitle'),
    currentPasswordLabel: t('profile.currentPasswordLabel'),
    newPasswordLabel: t('profile.newPasswordLabel'),
    confirmPasswordLabel: t('profile.confirmPasswordLabel'),
    saveBtn: t('profile.saveBtn'),
    savingBtn: t('profile.savingBtn'),
    backBtn: t('profile.backBtn'),
    requiredFields: t('profile.requiredFields'),
    passwordMismatch: t('profile.passwordMismatch'),
    passwordTooShort: t('profile.passwordTooShort'),
    loadError: t('profile.loadError'),
    uploadingText: t('profile.uploadingText'),
    uploadFailed: t('profile.uploadFailed'),
  };

  const checkSession = useCallback(async () => {
    try {
      const res = await fetch('/api/auth/me');
      if (!res.ok) {
        router.push('/login');
        return;
      }
      const data = await res.json();
      if (!data.isLoggedIn) {
        router.push('/login');
        return;
      }
      setName(data.userName ?? '');
      setEmail(data.userEmail ?? '');
      setPhone(data.userPhone ?? '');
      setImage(data.userImage ?? null);
    } catch (err) {
      setError(localized.loadError);
    } finally {
      setLoading(false);
    }
  }, [router, localized.loadError]);

  useEffect(() => {
    checkSession();
  }, [checkSession]);

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    if (!file.type.startsWith('image/')) {
      setError(t('profile.imageFileOnly'));
      return;
    }

    setUploading(true);
    setError('');
    setSuccess('');

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || localized.uploadFailed);
        return;
      }

      setImage(data.url);
      setSuccess(t('profile.uploadSuccess'));
    } catch (err) {
      setError(localized.uploadFailed);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!name.trim() || !email.trim()) {
      setError(localized.requiredFields);
      return;
    }

    if (newPassword) {
      if (newPassword.length < 8) {
        setError(localized.passwordTooShort);
        return;
      }
      if (newPassword !== confirmPassword) {
        setError(localized.passwordMismatch);
        return;
      }
    }

    setSubmitLoading(true);

    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          phone: phone || null,
          image: image || null,
          currentPassword: currentPassword || null,
          newPassword: newPassword || null,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || t('profile.saveError'));
        return;
      }

      setSuccess(t('profile.updateSuccess'));
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      
      router.refresh();
      window.dispatchEvent(new Event('storage'));
    } catch (err) {
      setError(t('profile.connectError'));
    } finally {
      setSubmitLoading(false);
    }
  };

  const getInitial = (nameStr: string) => nameStr.charAt(0).toUpperCase();

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--bg-light)' }}>
        <div style={{ textAlign: 'center', color: '#0d9488' }}>
          <div style={{ fontSize: 48 }} className="animate-bounce">🐾</div>
          <p>{t('myAppts.loading') || 'กำลังโหลด...'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ maxWidth: 640, margin: '0 auto' }}>
      
      {/* Navigation back */}
      <div style={{ marginBottom: 20 }}>
        <Link href="/my-appointments" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: '#0d9488', textDecoration: 'none', fontWeight: 600, fontSize: 15 }}>
          <ArrowLeft size={16} />
          {localized.backBtn}
        </Link>
      </div>

      {/* Card Container */}
      <div style={{ background: 'white', borderRadius: 16, boxShadow: '0 10px 30px rgba(0,0,0,0.05)', border: '1px solid #f3f4f6', overflow: 'hidden' }}>
        
        {/* Header section with gradient */}
        <div style={{ background: 'linear-gradient(135deg, #0d9488, #14b8a6)', padding: '32px', color: 'white', textAlign: 'center' }}>
          
          {/* Avatar upload section */}
          <div style={{ display: 'inline-block', position: 'relative', marginBottom: 16 }}>
            <div 
              onClick={handleAvatarClick} 
              style={{ 
                width: 100, 
                height: 100, 
                borderRadius: '50%', 
                backgroundColor: '#0f766e', 
                border: '4px solid white', 
                boxShadow: '0 4px 10px rgba(0,0,0,0.15)',
                cursor: 'pointer',
                overflow: 'hidden',
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: 32,
                fontWeight: 700,
              }}
              className="group"
            >
              {uploading ? (
                <Loader2 size={32} className="animate-spin" />
              ) : image ? (
                <img src={image} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                getInitial(name)
              )}
              
              {/* Hover overlay */}
              <div style={{
                position: 'absolute',
                inset: 0,
                backgroundColor: 'rgba(0,0,0,0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                opacity: 0,
                transition: 'opacity 0.2s',
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = '0')}
              >
                <Camera size={24} color="white" />
              </div>
            </div>

            {/* Hidden file input */}
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              accept="image/*" 
              style={{ display: 'none' }} 
            />

            {image && (
              <div style={{ marginTop: 8 }}>
                <button
                  type="button"
                  onClick={() => setImage(null)}
                  style={{
                    background: 'rgba(255, 255, 255, 0.15)',
                    border: '1.5px solid rgba(255, 255, 255, 0.35)',
                    borderRadius: '20px',
                    padding: '4px 14px',
                    color: 'white',
                    fontSize: '12px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(239, 68, 68, 0.9)';
                    e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.9)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.35)';
                  }}
                >
                  {t('profile.removePhoto')}
                </button>
              </div>
            )}
          </div>

          <h2 style={{ margin: 0, fontSize: 22, fontWeight: 700 }}>{localized.title}</h2>
          <p style={{ margin: '8px 0 0', color: '#ccfbf1', fontSize: 14, opacity: 0.9 }}>{localized.subtitle}</p>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: '32px' }}>
          
          {/* Status alerts */}
          {error && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', padding: '14px 16px', borderRadius: 10, marginBottom: 24, fontSize: 14 }}>
              <AlertCircle size={18} style={{ flexShrink: 0 }} />
              <span>{error}</span>
            </div>
          )}
          
          {success && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: '#f0fdf4', border: '1px solid #bbf7d0', color: '#16a34a', padding: '14px 16px', borderRadius: 10, marginBottom: 24, fontSize: 14 }}>
              <CheckCircle size={18} style={{ flexShrink: 0 }} />
              <span>{success}</span>
            </div>
          )}

          {/* Form Fields: Personal Details */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            
            <div>
              <label style={{ display: 'block', marginBottom: 6, fontSize: 14, fontWeight: 600, color: '#374151' }}>
                {localized.nameLabel} <span style={{ color: '#dc2626' }}>*</span>
              </label>
              <div style={{ position: 'relative' }}>
                <span style={iconWrapperStyle}>
                  <User size={18} color="#9ca3af" />
                </span>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={inputWithIconStyle}
                  placeholder="สมชาย ใจดี"
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: 6, fontSize: 14, fontWeight: 600, color: '#374151' }}>
                {localized.emailLabel} <span style={{ color: '#dc2626' }}>*</span>
              </label>
              <div style={{ position: 'relative' }}>
                <span style={iconWrapperStyle}>
                  <Mail size={18} color="#9ca3af" />
                </span>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={inputWithIconStyle}
                  placeholder="example@email.com"
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: 6, fontSize: 14, fontWeight: 600, color: '#374151' }}>
                {localized.phoneLabel}
              </label>
              <div style={{ position: 'relative' }}>
                <span style={iconWrapperStyle}>
                  <Phone size={18} color="#9ca3af" />
                </span>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  style={inputWithIconStyle}
                  placeholder="08X-XXX-XXXX"
                />
              </div>
            </div>

            {/* Separator line */}
            <hr style={{ border: 'none', borderTop: '1px solid #e5e7eb', margin: '12px 0 4px' }} />

            {/* Password Section */}
            <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: '#374151' }}>{localized.changePasswordTitle}</h3>

            <div>
              <label style={{ display: 'block', marginBottom: 6, fontSize: 14, fontWeight: 600, color: '#374151' }}>
                {localized.currentPasswordLabel}
              </label>
              <div style={{ position: 'relative' }}>
                <span style={iconWrapperStyle}>
                  <Lock size={18} color="#9ca3af" />
                </span>
                <input
                  type={showCurrent ? 'text' : 'password'}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  style={inputWithIconStyle}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrent(!showCurrent)}
                  style={eyeButtonStyle}
                >
                  {showCurrent ? <EyeOff size={18} color="#6b7280" /> : <Eye size={18} color="#6b7280" />}
                </button>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div>
                <label style={{ display: 'block', marginBottom: 6, fontSize: 14, fontWeight: 600, color: '#374151' }}>
                  {localized.newPasswordLabel}
                </label>
                <div style={{ position: 'relative' }}>
                  <span style={iconWrapperStyle}>
                    <Lock size={18} color="#9ca3af" />
                  </span>
                  <input
                    type={showNew ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    style={inputWithIconStyle}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNew(!showNew)}
                    style={eyeButtonStyle}
                  >
                    {showNew ? <EyeOff size={18} color="#6b7280" /> : <Eye size={18} color="#6b7280" />}
                  </button>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: 6, fontSize: 14, fontWeight: 600, color: '#374151' }}>
                  {localized.confirmPasswordLabel}
                </label>
                <div style={{ position: 'relative' }}>
                  <span style={iconWrapperStyle}>
                    <Lock size={18} color="#9ca3af" />
                  </span>
                  <input
                    type={showConfirm ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    style={inputWithIconStyle}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    style={eyeButtonStyle}
                  >
                    {showConfirm ? <EyeOff size={18} color="#6b7280" /> : <Eye size={18} color="#6b7280" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitLoading}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 10,
                width: '100%',
                padding: '12px 24px',
                background: 'linear-gradient(135deg, #0d9488, #14b8a6)',
                color: 'white',
                border: 'none',
                borderRadius: 10,
                fontSize: 16,
                fontWeight: 700,
                cursor: 'pointer',
                fontFamily: 'inherit',
                transition: 'all 0.2s',
                marginTop: 10,
                opacity: submitLoading ? 0.8 : 1,
                boxShadow: '0 4px 12px rgba(13, 148, 136, 0.2)',
              }}
            >
              <Save size={18} />
              {submitLoading ? localized.savingBtn : localized.saveBtn}
            </button>

          </div>
        </form>

      </div>
    </div>
  );
}

const iconWrapperStyle: React.CSSProperties = {
  position: 'absolute',
  top: '50%',
  left: 14,
  transform: 'translateY(-50%)',
  display: 'flex',
  alignItems: 'center',
  pointerEvents: 'none',
};

const inputWithIconStyle: React.CSSProperties = {
  width: '100%',
  padding: '10px 42px 10px 42px',
  border: '1px solid #d1d5db',
  borderRadius: 8,
  fontSize: 15,
  fontFamily: 'inherit',
  outline: 'none',
  boxSizing: 'border-box',
  transition: 'border-color 0.2s',
};

const eyeButtonStyle: React.CSSProperties = {
  position: 'absolute',
  top: '50%',
  right: 14,
  transform: 'translateY(-50%)',
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  padding: 0,
};
