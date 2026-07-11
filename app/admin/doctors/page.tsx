'use client';

import { useEffect, useState, useRef } from 'react';
import HideHeader from '@/components/layout/HideHeader';
import HideFooter from '@/components/layout/HideFooter';
import AdminSidebar from '@/components/admin/AdminSidebar';

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
const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export default function DoctorsAdminPage() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [selected, setSelected] = useState<Doctor | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  // Image upload state
  const [imagePreview, setImagePreview] = useState<string>('');
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { fetchDoctors(); }, []);

  // When modal opens, pre-fill image preview from existing imageUrl
  useEffect(() => {
    if (selected) {
      setImagePreview(selected.imageUrl || '');
      setUploadError('');
    } else {
      setImagePreview('');
      setUploadError('');
    }
  }, [selected?.id]);

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/doctors');
      if (!res.ok) { setDoctors([]); return; }
      const data = await res.json();
      if (Array.isArray(data)) setDoctors(data as Doctor[]);
      else if (data && typeof data === 'object') setDoctors([data as Doctor]);
      else setDoctors([]);
    } catch (error) {
      console.error('fetchDoctors error', error);
      setDoctors([]);
    } finally {
      setLoading(false);
    }
  };

  const deleteDoctor = async (id: number) => {
    if (!confirm('ยืนยันการลบแพทย์คนนี้?')) return;
    await fetch(`/api/doctors/${id}`, { method: 'DELETE' });
    fetchDoctors();
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate type & size
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      setUploadError('รองรับเฉพาะ JPG, PNG, WebP, GIF เท่านั้น');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setUploadError('ขนาดรูปต้องไม่เกิน 5MB');
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
      setUploadError(err.message || 'อัพโหลดไม่สำเร็จ กรุณาลองใหม่');
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

  const saveDoctor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selected) return;
    const body = JSON.stringify({
      name: selected.name,
      specialty: selected.role,
      imageUrl: selected.imageUrl,
      email: selected.email,
      bio: selected.bio,
      availableDays: selected.availableDays || [],
    });
    if (selected.id) {
      await fetch(`/api/doctors/${selected.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body });
    } else {
      await fetch('/api/doctors', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body });
    }
    setSelected(null);
    fetchDoctors();
  };

  const toggleDay = (day: string) => {
    const days = selected?.availableDays || [];
    const updated = days.includes(day) ? days.filter((d) => d !== day) : [...days, day];
    setSelected({ ...selected!, availableDays: updated });
  };

  const filteredDoctors = doctors.filter((doc) =>
    doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.specialty?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.role?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const TODAY = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][new Date().getDay()];
  const onlineDoctors = doctors.filter(doc => (doc.availableDays || []).includes(TODAY));

  return (
    <div className="admin-layout">
      <HideHeader />

      <div className="admin-container-new">
        <AdminSidebar />

        {/* ===== MAIN CONTENT ===== */}
        <div className="admin-content-new">

          <div className="admin-header-new">
            <div>
              <h1>Doctor Management</h1>
              <p>จัดการข้อมูลแพทย์ของคลินิก · ทั้งหมด {doctors.length} คน</p>
            </div>
            <button onClick={() => setSelected({ name: '' })} className="admin-btn admin-btn-primary">
              + เพิ่มแพทย์ใหม่
            </button>
          </div>

          <div className="stats-grid-new">
            <div className="stat-card-new stat-blue">
              <div className="stat-top"><div className="stat-label-text">ทั้งหมด</div><div className="stat-icon-new">👨‍⚕️</div></div>
              <div className="stat-value-new">{doctors.length}</div>
              <div className="stat-desc-new">แพทย์ในระบบ</div>
            </div>
            <div className="stat-card-new stat-green">
              <div className="stat-top"><div className="stat-label-text">พร้อมให้บริการ</div><div className="stat-icon-new">✅</div></div>
              <div className="stat-value-new">{onlineDoctors.length}</div>
              <div className="stat-desc-new">Online อยู่ขณะนี้</div>
            </div>
            <div className="stat-card-new stat-orange">
              <div className="stat-top"><div className="stat-label-text">เวลาทำการ</div><div className="stat-icon-new">⏰</div></div>
              <div className="stat-value-new">{doctors.length > 0 ? '10/6' : 'N/A'}</div>
            </div>
          </div>

          <div className="stat-card-new stat-blue">
            <div className="search-box-new">
              <span className="search-icon-new">🔍</span>
              <input
                type="text"
                placeholder="ค้นหาชื่อแพทย์ หรือ ความเชี่ยวชาญ..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input-new"
              />
            </div>
          </div>

          {loading ? (
            <div className="doctors-grid">
              {[1, 2, 3, 4, 5, 6].map((i) => <div key={i} className="doctor-skeleton" />)}
            </div>
          ) : filteredDoctors.length > 0 ? (
            <div className="doctors-grid">
              {filteredDoctors.map((doc: Doctor) => (
                <div key={doc.id} className="doctor-card-admin">
                  <div className="doctor-card-admin__image">
                    <img src={doc.imageUrl || `https://via.placeholder.com/400x300?text=${encodeURIComponent(doc.name)}`} alt={doc.name} />
                    <div className="doctor-card-admin__image-overlay" />
                    {(doc.availableDays || []).includes(TODAY) && (
                      <span className="doctor-card-admin__badge">● Online</span>
                    )}
                  </div>
                  <div className="doctor-card-admin__body">
                    <div className="doctor-card-admin__name">{doc.name}</div>
                    <div className="doctor-card-admin__specialty">🏥 {doc.specialty || doc.role || ''}</div>
                    <div className="doctor-card-admin__actions">
                      <button onClick={() => setSelected(doc)} className="doctor-card-admin__btn-edit">✏️ แก้ไข</button>
                      <button onClick={() => deleteDoctor(doc.id!)} className="doctor-card-admin__btn-delete">🗑️ ลบ</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="stat-card-new" style={{ textAlign: 'center', padding: '4rem' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>👨‍⚕️</div>
              <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                {searchTerm ? 'ไม่พบแพทย์ที่ค้นหา' : 'ยังไม่มีข้อมูลแพทย์'}
              </p>
              <button onClick={() => setSelected({ name: '' })} className="admin-btn admin-btn-primary">
                + เพิ่มแพทย์ใหม่
              </button>
            </div>
          )}

        </div>
      </div>

      <HideFooter />

      {/* ===== MODAL ===== */}
      {selected && (
        <div className="doctors-modal-overlay" onClick={() => setSelected(null)}>
          <form className="doctors-modal" onSubmit={saveDoctor} onClick={(e) => e.stopPropagation()}>

            {/* Header */}
            <div className="doctors-modal__header">
              <div>
                <div className="doctors-modal__title">
                  {selected.id ? '✏️ แก้ไขข้อมูลแพทย์' : '➕ เพิ่มแพทย์ใหม่'}
                </div>
                <div className="doctors-modal__subtitle">กรอกข้อมูลแพทย์อย่างละเอียด</div>
              </div>
              <button type="button" className="doctors-modal__close" onClick={() => setSelected(null)}>✕</button>
            </div>

            <div className="doctors-modal__fields">

              {/* ===== IMAGE UPLOAD SECTION ===== */}
              <div style={{ gridColumn: '1 / -1' }}>
                <label className="doctors-modal__label">📷 รูปภาพแพทย์</label>
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
                            กำลังอัพโหลด...
                          </>
                        ) : (
                          <>📤 {imagePreview ? 'เปลี่ยนรูปภาพ' : 'อัพโหลดรูปภาพ'}</>
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
                          🗑️ ลบรูป
                        </button>
                      )}
                    </div>
                    <p style={{ fontSize: 12, color: '#94a3b8', margin: 0 }}>
                      รองรับ JPG, PNG, WebP · ขนาดสูงสุด 5MB
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
                <label className="doctors-modal__label">ชื่อแพทย์ *</label>
                <input
                  required
                  className="doctors-modal__input"
                  placeholder="เช่น นพ. สมชาย ใจดี"
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
                  ความเชี่ยวชาญ * <span className="doctors-modal__hint">(คั่นด้วยจุลภาค)</span>
                </label>
                <input
                  required
                  className="doctors-modal__input"
                  placeholder="เช่น จักษุแพทย์, ศัลยแพทย์"
                  value={selected.role || ''}
                  onChange={(e) => setSelected({ ...selected, role: e.target.value })}
                />
              </div>

              {/* Bio */}
              <div>
                <label className="doctors-modal__label">ประวัติย่อ</label>
                <textarea
                  className="doctors-modal__input doctors-modal__textarea"
                  placeholder="ประวัติการศึกษาและประสบการณ์..."
                  value={selected.bio || ''}
                  onChange={(e) => setSelected({ ...selected, bio: e.target.value })}
                />
              </div>

              {/* Available Days */}
              <div style={{ gridColumn: '1 / -1' }}>
                <label className="doctors-modal__label">วันที่ให้บริการ</label>
                <div className="doctors-modal__days">
                  {DAYS.map((day) => {
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
                ยกเลิก
              </button>
              <button type="submit" disabled={uploading} className="admin-btn admin-btn-primary" style={{ opacity: uploading ? 0.6 : 1 }}>
                {uploading ? '⏳ กำลังอัพโหลด...' : '💾 บันทึกข้อมูล'}
              </button>
            </div>

          </form>
        </div>
      )}
    </div>
  );
}