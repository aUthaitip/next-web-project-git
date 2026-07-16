import React, { useState, useEffect, useRef } from 'react';

interface Doctor {
  id?: number;
  name: string;
  role?: string;
  imageUrl?: string;
  specialty?: string;
  email?: string;
  bio?: string;
  availableDays?: string[];
}

interface DoctorModalProps {
  selected: Doctor | null;
  setSelected: React.Dispatch<React.SetStateAction<Doctor | null>>;
  onSave: (e: React.FormEvent) => void;
  days: string[];
  lang?: string;
}

export default function DoctorModal({
  selected,
  setSelected,
  onSave,
  days,
  lang = 'th',
}: DoctorModalProps) {
  const [imagePreview, setImagePreview] = useState<string>('');
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (selected) {
      setImagePreview(selected.imageUrl || '');
      setUploadError('');
    } else {
      setImagePreview('');
      setUploadError('');
    }
  }, [selected?.id, selected?.imageUrl]); // Re-run if imageUrl changes initially or selected doctor changes

  if (!selected) return null;

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate type & size
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      setUploadError(lang === 'th' ? 'รองรับเฉพาะ JPG, PNG, WebP, GIF เท่านั้น' : 'Only JPG, PNG, WebP, GIF supported');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setUploadError(lang === 'th' ? 'ขนาดรูปต้องไม่เกิน 5MB' : 'Max file size 5MB');
      return;
    }

    setUploadError('');
    // Show local preview immediately
    const localUrl = URL.createObjectURL(file);
    setImagePreview(localUrl);

    // Upload to server
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Upload failed');
      const uploadedUrl = data.url || data.imageUrl || data.path;
      setImagePreview(uploadedUrl);
      setSelected((prev) => prev ? { ...prev, imageUrl: uploadedUrl } : prev);
    } catch (err: any) {
      setUploadError(err.message || (lang === 'th' ? 'อัพโหลดไม่สำเร็จ กรุณาลองใหม่' : 'Upload failed. Please try again'));
      setImagePreview(selected?.imageUrl || '');
    } finally {
      setUploading(false);
    }
  };

  const removeImage = () => {
    setImagePreview('');
    setSelected((prev) => prev ? { ...prev, imageUrl: '' } : prev);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const toggleDay = (day: string) => {
    const activeDays = selected?.availableDays || [];
    const updated = activeDays.includes(day) ? activeDays.filter((d) => d !== day) : [...activeDays, day];
    setSelected({ ...selected, availableDays: updated });
  };

  return (
    <div className="doctors-modal-overlay" onClick={() => setSelected(null)}>
      <form className="doctors-modal" onSubmit={onSave} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="doctors-modal__header">
          <div>
            <div className="doctors-modal__title">
              {selected.id ? (lang === 'th' ? '✏️ แก้ไขข้อมูลแพทย์' : '✏️ Edit Doctor Info') : (lang === 'th' ? '➕ เพิ่มแพทย์ใหม่' : '➕ Add New Doctor')}
            </div>
            <div className="doctors-modal__subtitle">{lang === 'th' ? 'กรอกข้อมูลแพทย์อย่างละเอียด' : 'Fill in doctor details'}</div>
          </div>
          <button type="button" className="doctors-modal__close" onClick={() => setSelected(null)}>✕</button>
        </div>

        <div className="doctors-modal__fields">
          {/* ===== IMAGE UPLOAD SECTION ===== */}
          <div style={{ gridColumn: '1 / -1' }}>
            <label className="doctors-modal__label">📷 {lang === 'th' ? 'รูปภาพแพทย์' : 'Doctor Image'}</label>
            <div style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: 20,
              padding: 16,
              background: '#f8fafc',
              borderRadius: 12,
              border: '1px solid #e2e8f0',
            }}>
              {/* Preview */}
              <div style={{
                width: 100, height: 100,
                borderRadius: 12,
                background: imagePreview ? 'transparent' : 'linear-gradient(135deg,#e0f2fe,#f0fdf4)',
                border: '2px dashed #cbd5e1',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                overflow: 'hidden',
                flexShrink: 0,
                position: 'relative',
              }}>
                {imagePreview ? (
                  <>
                    <img
                      src={imagePreview}
                      alt="preview"
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    {uploading && (
                      <div style={{
                        position: 'absolute', inset: 0,
                        background: 'rgba(0,0,0,0.45)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        <div style={{ width: 28, height: 28, border: '3px solid rgba(255,255,255,0.4)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                      </div>
                    )}
                  </>
                ) : (
                  <span style={{ fontSize: 36 }}>👨‍⚕️</span>
                )}
              </div>

              {/* Upload controls */}
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 8 }}>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 6,
                      padding: '8px 16px',
                      background: uploading ? '#e2e8f0' : 'linear-gradient(135deg,#0d9488,#0369a1)',
                      color: uploading ? '#94a3b8' : '#fff',
                      border: 'none', borderRadius: 8,
                      fontSize: 13, fontWeight: 600, cursor: uploading ? 'not-allowed' : 'pointer',
                      transition: 'all 0.15s',
                    }}
                  >
                    {uploading ? (
                      <>
                        <span style={{ display: 'inline-block', width: 14, height: 14, border: '2px solid #94a3b8', borderTopColor: '#475569', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                        {lang === 'th' ? 'กำลังอัพโหลด...' : 'Uploading...'}
                      </>
                    ) : (
                      <>📤 {imagePreview ? (lang === 'th' ? 'เปลี่ยนรูปภาพ' : 'Change Image') : (lang === 'th' ? 'อัพโหลดรูปภาพ' : 'Upload Image')}</>
                    )}
                  </button>
                  {imagePreview && !uploading && (
                    <button
                      type="button"
                      onClick={removeImage}
                      style={{
                        padding: '8px 14px',
                        background: '#fee2e2', color: '#dc2626',
                        border: 'none', borderRadius: 8,
                        fontSize: 13, fontWeight: 600, cursor: 'pointer',
                      }}
                    >
                      🗑️ {lang === 'th' ? 'ลบรูป' : 'Delete Image'}
                    </button>
                  )}
                </div>
                <p style={{ fontSize: 12, color: '#94a3b8', margin: 0 }}>
                  {lang === 'th' ? 'รองรับ JPG, PNG, WebP · ขนาดสูงสุด 5MB' : 'Supports JPG, PNG, WebP · Max 5MB'}
                </p>
                {uploadError && (
                  <p style={{ fontSize: 12, color: '#dc2626', marginTop: 4, fontWeight: 500 }}>
                    ⚠️ {uploadError}
                  </p>
                )}
              </div>
            </div>
            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              style={{ display: 'none' }}
              onChange={handleImageChange}
            />
          </div>

          {/* ชื่อแพทย์ */}
          <div>
            <label className="doctors-modal__label">{lang === 'th' ? 'ชื่อแพทย์ *' : 'Doctor Name *'}</label>
            <input
              required
              className="doctors-modal__input"
              placeholder={lang === 'th' ? 'เช่น นพ. สมชาย ใจดี' : 'e.g. Dr. Somchai Jaidee'}
              value={selected.name}
              onChange={(e) => setSelected({ ...selected, name: e.target.value })}
            />
          </div>

          {/* Email */}
          <div>
            <label className="doctors-modal__label">Email</label>
            <input
              type="email"
              className="doctors-modal__input"
              placeholder="doctor@pawplan.com"
              value={selected.email || ''}
              onChange={(e) => setSelected({ ...selected, email: e.target.value })}
            />
          </div>

          {/* ความเชี่ยวชาญ */}
          <div>
            <label className="doctors-modal__label">
              {lang === 'th' ? 'ความเชี่ยวชาญ *' : 'Specialty *'} <span className="doctors-modal__hint">({lang === 'th' ? 'คั่นด้วยจุลภาค' : 'comma separated'})</span>
            </label>
            <input
              required
              className="doctors-modal__input"
              placeholder={lang === 'th' ? 'เช่น จักษุแพทย์, ศัลยแพทย์' : 'e.g. Ophthalmologist, Surgeon'}
              value={selected.role || ''}
              onChange={(e) => setSelected({ ...selected, role: e.target.value })}
            />
          </div>

          {/* Bio */}
          <div>
            <label className="doctors-modal__label">{lang === 'th' ? 'ประวัติย่อ' : 'Bio'}</label>
            <textarea
              className="doctors-modal__input doctors-modal__textarea"
              placeholder={lang === 'th' ? 'ประวัติการศึกษาและประสบการณ์...' : 'Education and experience...'}
              value={selected.bio || ''}
              onChange={(e) => setSelected({ ...selected, bio: e.target.value })}
            />
          </div>

          {/* Available Days */}
          <div style={{ gridColumn: '1 / -1' }}>
            <label className="doctors-modal__label">{lang === 'th' ? 'วันที่ให้บริการ' : 'Available Days'}</label>
            <div className="doctors-modal__days">
              {days.map((day) => {
                const active = (selected.availableDays || []).includes(day);
                return (
                  <button
                    key={day}
                    type="button"
                    className={`doctors-modal__day-btn${active ? ' active' : ''}`}
                    onClick={() => toggleDay(day)}
                  >
                    {day}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="doctors-modal__footer">
          <button type="button" onClick={() => setSelected(null)} className="admin-btn admin-btn-secondary">
            {lang === 'th' ? 'ยกเลิก' : 'Cancel'}
          </button>
          <button type="submit" disabled={uploading} className="admin-btn admin-btn-primary" style={{ opacity: uploading ? 0.6 : 1 }}>
            {uploading ? (lang === 'th' ? '⏳ กำลังอัพโหลด...' : '⏳ Uploading...') : (lang === 'th' ? '💾 บันทึกข้อมูล' : '💾 Save')}
          </button>
        </div>
      </form>
    </div>
  );
}
