'use client';

import { useEffect, useState, useRef } from 'react';
import HideHeader from '@/components/layout/HideHeader';
import HideFooter from '@/components/layout/HideFooter';
import AdminSidebar from '@/components/admin/AdminSidebar';
import DoctorModal from '@/components/admin/DoctorModal';
import { useLanguage } from '@/context/LanguageContext';

interface Doctor {
  id?: number;
  name: string;
  nameEn?: string | null;
  role?: string;
  expertiseEn?: string | null;
  imageUrl?: string;
  specialty?: string;
  email?: string;
  bio?: string;
  bioEn?: string | null;
  availableDays?: string[];
}
const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export default function DoctorsAdminPage() {
  const { lang, toggleLanguage } = useLanguage();
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
    if (!confirm(lang === 'th' ? 'ยืนยันการลบแพทย์คนนี้?' : 'Confirm delete this doctor?')) return;
    await fetch(`/api/doctors/${id}`, { method: 'DELETE' });
    fetchDoctors();
  };

  const saveDoctor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selected) return;
    const body = JSON.stringify({
      name: selected.name,
      nameEn: selected.nameEn || null,
      specialty: selected.role,
      expertiseEn: selected.expertiseEn || null,
      imageUrl: selected.imageUrl,
      email: selected.email,
      bio: selected.bio,
      bioEn: selected.bioEn || null,
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
              <h1>{lang === 'th' ? 'จัดการข้อมูลแพทย์' : 'Doctor Management'}</h1>
              <p>{lang === 'th' ? `จัดการข้อมูลแพทย์ของคลินิก · ทั้งหมด ${doctors.length} คน` : `Manage clinic doctors · Total ${doctors.length}`}</p>
            </div>
            <div style={{ display: 'flex', gap: 12 }}>
              <button onClick={toggleLanguage} className="admin-btn admin-btn-secondary" style={{ padding: '6px 12px' }}>
                {lang === 'th' ? 'EN' : 'TH'}
              </button>
              <button onClick={() => setSelected({ name: '' })} className="admin-btn admin-btn-primary">
                + {lang === 'th' ? 'เพิ่มแพทย์ใหม่' : 'Add New Doctor'}
              </button>
            </div>
          </div>

          <div className="stats-grid-new">
            <div className="stat-card-new stat-blue">
              <div className="stat-top"><div className="stat-label-text">{lang === 'th' ? 'ทั้งหมด' : 'Total'}</div><div className="stat-icon-new">👨‍⚕️</div></div>
              <div className="stat-value-new">{doctors.length}</div>
              <div className="stat-desc-new">{lang === 'th' ? 'แพทย์ในระบบ' : 'System doctors'}</div>
            </div>

            <div className="stat-card-new stat-orange">
              <div className="stat-top"><div className="stat-label-text">{lang === 'th' ? 'เวลาทำการ' : 'Working Hours'}</div><div className="stat-icon-new">⏰</div></div>
              <div className="stat-value-new">{doctors.length > 0 ? '10/6' : 'N/A'}</div>
            </div>
          </div>

          <div className="stat-card-new stat-blue">
            <div className="search-box-new">
              <span className="search-icon-new">🔍</span>
              <input
                type="text"
                placeholder={lang === 'th' ? 'ค้นหาชื่อแพทย์ หรือ ความเชี่ยวชาญ...' : 'Search doctor name or specialty...'}
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

                  </div>
                  <div className="doctor-card-admin__body">
                    <div className="doctor-card-admin__name">{doc.name}</div>
                    <div className="doctor-card-admin__specialty">🏥 {doc.specialty || doc.role || ''}</div>
                    <div className="doctor-card-admin__actions">
                      <button onClick={() => setSelected(doc)} className="doctor-card-admin__btn-edit">✏️ {lang === 'th' ? 'แก้ไข' : 'Edit'}</button>
                      <button onClick={() => deleteDoctor(doc.id!)} className="doctor-card-admin__btn-delete">🗑️ {lang === 'th' ? 'ลบ' : 'Delete'}</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="stat-card-new" style={{ textAlign: 'center', padding: '4rem' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>👨‍⚕️</div>
              <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                {searchTerm ? (lang === 'th' ? 'ไม่พบแพทย์ที่ค้นหา' : 'Doctor not found') : (lang === 'th' ? 'ยังไม่มีข้อมูลแพทย์' : 'No doctors data')}
              </p>
              <button onClick={() => setSelected({ name: '' })} className="admin-btn admin-btn-primary">
                + {lang === 'th' ? 'เพิ่มแพทย์ใหม่' : 'Add New Doctor'}
              </button>
            </div>
          )}

        </div>
      </div>

      <HideFooter />

      <DoctorModal
        selected={selected}
        setSelected={setSelected}
        onSave={saveDoctor}
        days={DAYS}
      />
    </div>
  );
}