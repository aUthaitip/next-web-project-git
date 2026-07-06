'use client';

import { useEffect, useState } from 'react';
import HideHeader from '@/components/layout/HideHeader';
import HideFooter from '@/components/layout/HideFooter';
import AdminSidebar from '@/components/AdminSidebar';

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

  useEffect(() => { fetchDoctors(); }, []);

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

              {/* Image URL */}
              <div>
                <label className="doctors-modal__label">Image URL (Optional)</label>
                <input
                  className="doctors-modal__input"
                  placeholder="https://example.com/image.jpg"
                  value={selected.imageUrl || ''}
                  onChange={(e) => setSelected({ ...selected, imageUrl: e.target.value })}
                />
              </div>

              {/* Available Days */}
              <div>
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
              <button type="submit" className="admin-btn admin-btn-primary">
                💾 บันทึกข้อมูล
              </button>
            </div>

          </form>
        </div>
      )}
    </div>
  );
}