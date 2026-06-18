'use client';
import { useState, useEffect } from 'react';
import HideHeader from '@/components/HideHeader';
import HideFooter from '@/components/HideFooter';
import AdminSidebar from '@/components/AdminSidebar';

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
  status?: string;
  createdAt?: string;
}

interface NewAppointmentForm {
  patientName: string;
  date: string;
  status: string;
  reason: string;
  notes: string;
}

export default function AppointmentPage() {
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

  useEffect(() => { fetchAppointments(); }, []);

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

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'confirmed': return '#10b981';
      case 'cancelled': return '#ef4444';
      default: return '#f59e0b';
    }
  };

  const getStatusLabel = (status?: string) => {
    switch (status) {
      case 'confirmed': return 'Confirmed';
      case 'cancelled': return 'Cancelled';
      default: return 'Pending';
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
              <h1>Appointments</h1>
              <p>Manage patient visits and schedules.</p>
            </div>
            <button className="admin-btn admin-btn-primary" onClick={() => setShowModal(true)}>
              + New Appointment
            </button>
          </div>

          <div className="appointments-toolbar">
            <div className="search-box-new">
              <span className="search-icon-new">🔍</span>
              <input type="text" placeholder="Search patients..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="search-input-new" />
            </div>
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="filter-select-new">
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          <div className="table-container-new">
            {loading ? (
              <div className="table-empty">⏳ Loading appointments...</div>
            ) : filteredAppointments.length === 0 ? (
              <div className="table-empty">📭 No appointments found.</div>
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
                      <td className="reason-cell">{apt.service || '-'}</td>
                      <td className="actions-cell">
                        <div className="actions-dropdown-container">
                          <button className="actions-btn" onClick={() => setActiveMenu(activeMenu === apt.id ? null : apt.id)}>⋮</button>
                          {activeMenu === apt.id && (
                            <div className="dropdown-menu-new">
                              {apt.status !== 'confirmed' && (
                                <button className="dropdown-item confirm" onClick={() => handleStatusChange(apt, 'confirmed')}>✓ Confirm</button>
                              )}
                              {apt.status !== 'cancelled' && (
                                <button className="dropdown-item cancel" onClick={() => handleStatusChange(apt, 'cancelled')}>✕ Cancel</button>
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

      {showModal && (
        <div className="appt-modal-overlay" onClick={() => setShowModal(false)}>
          <form className="appt-modal" onSubmit={handleSaveAppointment} onClick={(e) => e.stopPropagation()}>
            <div className="appt-modal__header">
              <h2 className="appt-modal__title">New Appointment</h2>
              <button type="button" className="appt-modal__close" onClick={() => setShowModal(false)}>✕</button>
            </div>
            <div className="appt-modal__field">
              <label className="appt-modal__label">Patient Name</label>
              <input required className="appt-modal__input" placeholder="Pet or Owner Name" value={form.patientName} onChange={(e) => setForm({ ...form, patientName: e.target.value })} />
            </div>
            <div className="appt-modal__row">
              <div className="appt-modal__field">
                <label className="appt-modal__label">Date</label>
                <input type="date" required className="appt-modal__input" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
              </div>
            </div>
            <div className="appt-modal__field">
              <label className="appt-modal__label">Status</label>
              <select className="appt-modal__input" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            <div className="appt-modal__field">
              <label className="appt-modal__label">Reason for Visit</label>
              <input className="appt-modal__input" placeholder="Checkup, Vaccination, etc." value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })} />
            </div>
            <div className="appt-modal__field">
              <label className="appt-modal__label">Internal Notes</label>
              <textarea className="appt-modal__input appt-modal__textarea" placeholder="Additional notes..." value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
            </div>
            <div className="appt-modal__footer">
              <button type="button" className="admin-btn admin-btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
              <button type="submit" className="admin-btn admin-btn-primary">Save Appointment</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}