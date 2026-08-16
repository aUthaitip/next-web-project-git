'use client';
import { useState, useEffect } from 'react';
import HideHeader from '@/components/layout/HideHeader';
import HideFooter from '@/components/layout/HideFooter';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AppointmentModal from '@/components/admin/AppointmentModal';
import SuggestAppointmentModal from '@/components/admin/SuggestAppointmentModal';
import { useLanguage } from '@/context/LanguageContext';

interface Appointment {
  id: number;
  patient: string;
  service: string;
  date: string;
  time: string;
  phone: string;
  petName: string;
  petType: string;
  notes?: string;
  doctorName?: string;
  status?: string;
  createdAt?: string;
  userId?: number;
}

interface NewAppointmentForm {
  patientName: string;
  date: string;
  status: string;
  reason: string;
  notes: string;
}

export default function AppointmentPage() {
  const { lang, toggleLanguage } = useLanguage();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [filteredAppointments, setFilteredAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [activeMenu, setActiveMenu] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState<NewAppointmentForm>({
    patientName: '',
    date: new Date().toISOString().split('T')[0],
    status: 'pending',
    reason: '',
    notes: '',
  });

  const [suggestAppt, setSuggestAppt] = useState<Appointment | null>(null);
  const [suggestForm, setSuggestForm] = useState({ date: '', time: '09:00', service: '', doctorName: '', notes: '' });
  const [doctors, setDoctors] = useState<any[]>([]);

  // ✅ ดึงข้อมูลจาก API แทน localStorage
  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/appointments');
      const data = await res.json();
      setAppointments(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to load appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDoctors = async () => {
    try {
      const res = await fetch('/api/doctors');
      const data = await res.json();
      setDoctors(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to load doctors:', error);
    }
  };

  useEffect(() => {
    fetchAppointments();
    fetchDoctors();
  }, []);

  useEffect(() => {
    let filtered = appointments;
    if (filterStatus !== 'all') filtered = filtered.filter(a => a.status === filterStatus);
    if (searchTerm) {
      filtered = filtered.filter(a =>
        a.patient?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.petName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.phone?.includes(searchTerm) ||
        a.service?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    setFilteredAppointments(filtered);
  }, [appointments, searchTerm, filterStatus]);

  // ✅ บันทึกผ่าน API แทน localStorage
  const handleSaveAppointment = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patient: form.patientName,
          petName: form.patientName,
          petType: '-',
          service: form.reason,
          date: form.date,
          time: '09:00',
          phone: '-',
          notes: form.notes,
          status: form.status,
        }),
      });
      if (res.ok) {
        await fetchAppointments();
        setShowModal(false);
        setForm({ patientName: '', date: new Date().toISOString().split('T')[0], status: 'pending', reason: '', notes: '' });
      }
    } catch (error) {
      console.error('Save error:', error);
    }
  };

  // ✅ อัปเดต status ผ่าน API
  const handleStatusChange = async (item: Appointment, newStatus: string) => {
    try {
      await fetch(`/api/appointments/${item.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...item, status: newStatus }),
      });
      await fetchAppointments();
      setActiveMenu(null);
    } catch (error) {
      console.error('Update error:', error);
    }
  };

  // ✅ ลบผ่าน API
  const handleDelete = async (item: Appointment) => {
    if (!confirm('ลบนัดหมายนี้หรือไม่?')) return;
    try {
      await fetch(`/api/appointments/${item.id}`, { method: 'DELETE' });
      await fetchAppointments();
      setActiveMenu(null);
    } catch (error) {
      console.error('Delete error:', error);
    }
  };

  const handleSuggestAppointment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!suggestAppt || !suggestAppt.userId) return;
    try {
      const res = await fetch('/api/admin/suggest-appointment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: suggestAppt.userId,
          patient: suggestAppt.patient,
          owner: suggestAppt.patient,
          phone: suggestAppt.phone,
          petName: suggestAppt.petName,
          petType: suggestAppt.petType,
          service: suggestForm.service,
          date: suggestForm.date,
          time: suggestForm.time,
          doctorName: suggestForm.doctorName,
          notes: suggestForm.notes,
        }),
      });
      if (res.ok) {
        await fetchAppointments();
        setSuggestAppt(null);
        setSuggestForm({ date: '', time: '09:00', service: '', doctorName: '', notes: '' });
      } else {
        const errData = await res.json().catch(() => ({}));
        alert(`เกิดข้อผิดพลาด: ${errData.error || 'ไม่สามารถเสนอวันนัดหมายได้'}`);
      }
    } catch (error) {
      console.error('Suggest error:', error);
      alert('เกิดข้อผิดพลาดในการส่งข้อมูล');
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'confirmed': return '#10b981';
      case 'arrived': return '#3b82f6';
      case 'completed': return '#10b981';
      case 'cancelled': return '#ef4444';
      default: return '#f59e0b';
    }
  };

  const getStatusLabel = (status?: string) => {
    const isTh = lang === 'th';
    switch (status) {
      case 'confirmed': return isTh ? 'ยืนยันแล้ว' : 'Confirmed';
      case 'arrived': return isTh ? 'มาถึงแล้ว' : 'Arrived';
      case 'completed': return isTh ? 'เสร็จสิ้น' : 'Completed';
      case 'cancelled': return isTh ? 'ยกเลิกแล้ว' : 'Cancelled';
      default: return isTh ? 'รอยืนยัน' : 'Pending';
    }
  };

  return (
    <div className="admin-layout">
      <HideHeader />
      <div className="admin-container-new">
        <AdminSidebar />
        <div className="admin-content-new">
          <div className="admin-header-new">
            <div>
              <h1>{lang === 'th' ? 'จัดการนัดหมาย' : 'Appointments'}</h1>
              <p>{lang === 'th' ? 'จัดการตารางนัดและข้อมูลการเข้ารับบริการ' : 'Manage patient visits and schedules.'}</p>
            </div>
            <div style={{ display: 'flex', gap: 12 }}>
              <button onClick={toggleLanguage} className="admin-btn admin-btn-secondary" style={{ padding: '6px 12px' }}>
                {lang === 'th' ? 'EN' : 'TH'}
              </button>
              <button className="admin-btn admin-btn-primary" onClick={() => setShowModal(true)}>
                + {lang === 'th' ? 'เพิ่มนัดหมาย' : 'New Appointment'}
              </button>
            </div>
          </div>

          <div className="appointments-toolbar">
            <div className="search-box-new">
              <span className="search-icon-new">🔍</span>
              <input type="text" placeholder={lang === 'th' ? 'ค้นหาชื่อเจ้าของ, สัตว์เลี้ยง...' : 'Search patients...'} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="search-input-new" />
            </div>
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="filter-select-new">
              <option value="all">{lang === 'th' ? 'ทุกสถานะ' : 'All Status'}</option>
              <option value="pending">{lang === 'th' ? 'รอยืนยัน' : 'Pending'}</option>
              <option value="confirmed">{lang === 'th' ? 'ยืนยันแล้ว' : 'Confirmed'}</option>
              <option value="arrived">{lang === 'th' ? 'มาถึงแล้ว' : 'Arrived'}</option>
              <option value="completed">{lang === 'th' ? 'เสร็จสิ้น' : 'Completed'}</option>
              <option value="cancelled">{lang === 'th' ? 'ยกเลิกแล้ว' : 'Cancelled'}</option>
            </select>
          </div>

          <div className="table-container-new">
            {loading ? (
              <div className="table-empty">⏳ {lang === 'th' ? 'กำลังโหลดข้อมูล...' : 'Loading appointments...'}</div>
            ) : filteredAppointments.length === 0 ? (
              <div className="table-empty">📭 {lang === 'th' ? 'ไม่พบข้อมูลนัดหมาย' : 'No appointments found.'}</div>
            ) : (
              <table className="appointments-table">
                <thead>
                  <tr>
                    <th>Patient</th>
                    <th>Date & Time</th>
                    <th>Status</th>
                    <th>Reason</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAppointments.map((apt) => (
                    <tr key={apt.id} className="table-row-hover">
                      <td>
                        <div className="table-pet-cell">
                          <div className="pet-avatar">{apt.petName?.charAt(0)}</div>
                          <div>
                            <div className="pet-name">{apt.petName}</div>
                            <div className="owner-name">{apt.patient}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="date-time">
                          <div className="date-value">{apt.date}</div>
                          <div className="time-value">{apt.time}</div>
                        </div>
                      </td>
                      <td>
                        <span className="status-badge" style={{ backgroundColor: `${getStatusColor(apt.status)}20`, color: getStatusColor(apt.status) }}>
                          {getStatusLabel(apt.status)}
                        </span>
                      </td>
                      <td className="reason-cell">
                        <div>
                          <div>{apt.service || '-'}</div>
                          {apt.doctorName && (
                            <div style={{ fontSize: '11px', color: '#0d9488', marginTop: '2px', fontWeight: 'bold' }}>
                              👩‍⚕️ แพทย์: {apt.doctorName}
                            </div>
                          )}
                          {apt.notes && (
                            <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px', fontStyle: 'italic' }}>
                              📝 {apt.notes}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="actions-cell">
                        <div className="actions-dropdown-container">
                          <button className="actions-btn" onClick={() => setActiveMenu(activeMenu === apt.id ? null : apt.id)}>⋮</button>
                          {activeMenu === apt.id && (
                            <div className="dropdown-menu-new">
                              {apt.status !== 'confirmed' && apt.status !== 'completed' && apt.status !== 'arrived' && (
                                <button className="dropdown-item confirm" onClick={() => handleStatusChange(apt, 'confirmed')}>✓ Confirm</button>
                              )}
                              {apt.status !== 'arrived' && apt.status !== 'completed' && apt.status !== 'cancelled' && (
                                <button className="dropdown-item" style={{ color: '#3b82f6' }} onClick={() => handleStatusChange(apt, 'arrived')}>📍 Arrived</button>
                              )}
                              {apt.status !== 'completed' && apt.status !== 'cancelled' && (
                                <button className="dropdown-item" style={{ color: '#10b981' }} onClick={() => handleStatusChange(apt, 'completed')}>💳 Complete</button>
                              )}
                              {apt.status !== 'cancelled' && apt.status !== 'completed' && (
                                <button className="dropdown-item cancel" onClick={() => handleStatusChange(apt, 'cancelled')}>✕ Cancel</button>
                              )}
                              {apt.userId && (
                                <button className="dropdown-item" onClick={() => { setSuggestAppt(apt); setActiveMenu(null); }}>Suggest Next</button>
                              )}
                              <button className="dropdown-item delete" onClick={() => handleDelete(apt)}>🗑️ Delete</button>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
      <HideFooter />

      <AppointmentModal
        showModal={showModal}
        setShowModal={setShowModal}
        form={form}
        setForm={setForm}
        handleSaveAppointment={handleSaveAppointment}
        lang={lang}
      />

      <SuggestAppointmentModal
        suggestAppt={suggestAppt}
        setSuggestAppt={setSuggestAppt}
        suggestForm={suggestForm}
        setSuggestForm={setSuggestForm}
        handleSuggestAppointment={handleSuggestAppointment}
        lang={lang}
        doctors={doctors}
      />
    </div>
  );
}