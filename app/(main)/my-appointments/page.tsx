'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Appointment {
  id: number;
  petName: string;
  petType: string;
  service: string;
  date: string;
  time: string;
  status: string;
  notes?: string;
  owner: string;
  phone: string;
}

const statusLabel: Record<string, { text: string; color: string; bg: string }> = {
  pending:   { text: 'รอการยืนยัน', color: '#d97706', bg: '#fef3c7' },
  confirmed: { text: 'ยืนยันแล้ว',   color: '#059669', bg: '#d1fae5' },
  cancelled: { text: 'ยกเลิกแล้ว',   color: '#dc2626', bg: '#fee2e2' },
  completed: { text: 'เสร็จสิ้น',     color: '#6b7280', bg: '#f3f4f6' },
};

export default function MyAppointmentsPage() {
  const router = useRouter();
  const [user, setUser] = useState<{ userName: string; userEmail: string } | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Reschedule modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedAppt, setSelectedAppt] = useState<Appointment | null>(null);
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('');
  const [modalLoading, setModalLoading] = useState(false);

  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    const res = await fetch('/api/auth/me');
    const data = await res.json();
    if (!data.isLoggedIn) {
      router.push('/login');
      return;
    }
    setUser(data);
    fetchAppointments();
  };

  const fetchAppointments = async () => {
    setLoading(true);
    const res = await fetch('/api/appointments/mine');
    if (res.ok) {
      const data = await res.json();
      setAppointments(data);
    }
    setLoading(false);
  };

  const handleCancel = async (id: number) => {
    if (!confirm('ยืนยันการยกเลิกนัดหมายนี้?')) return;
    const res = await fetch(`/api/appointments/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'cancelled' }),
    });
    if (res.ok) fetchAppointments();
    else setError('ไม่สามารถยกเลิกนัดหมายได้');
  };

  const openReschedule = (appt: Appointment) => {
    setSelectedAppt(appt);
    setNewDate(appt.date);
    setNewTime(appt.time);
    setModalOpen(true);
  };

  const handleReschedule = async () => {
    if (!selectedAppt || !newDate || !newTime) return;
    setModalLoading(true);
    const res = await fetch(`/api/appointments/${selectedAppt.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ date: newDate, time: newTime, status: 'pending' }),
    });
    setModalLoading(false);
    if (res.ok) {
      setModalOpen(false);
      fetchAppointments();
    } else {
      setError('ไม่สามารถเลื่อนนัดหมายได้');
    }
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
    router.refresh();
  };

  const upcoming = appointments.filter(a => a.status !== 'cancelled' && a.status !== 'completed');
  const past = appointments.filter(a => a.status === 'cancelled' || a.status === 'completed');

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center', color: '#0d9488' }}>
        <div style={{ fontSize: 48 }}>🐾</div>
        <p>กำลังโหลด...</p>
      </div>
    </div>
  );

  return (
    <section style={{ backgroundColor: 'var(--bg-light)', minHeight: '100vh', padding: '40px 0' }}>
      <div className="container" style={{ maxWidth: 800, margin: '0 auto' }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32, flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h2 style={{ margin: 0, color: '#0d9488', fontSize: 24 }}>🐾 นัดหมายของฉัน</h2>
            <p style={{ margin: '4px 0 0', color: '#6b7280', fontSize: 14 }}>สวัสดี, {user?.userName}</p>
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <Link href="/book" style={{ ...outlineBtnStyle }}>+ จองนัดใหม่</Link>
            <button onClick={handleLogout} style={{ ...ghostBtnStyle }}>ออกจากระบบ</button>
          </div>
        </div>

        {error && (
          <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', padding: '12px 16px', borderRadius: 8, marginBottom: 16, fontSize: 14 }}>
            {error}
          </div>
        )}

        {/* Upcoming */}
        <div style={{ marginBottom: 32 }}>
          <h3 style={{ color: '#374151', marginBottom: 16, fontSize: 18 }}>นัดหมายที่กำลังจะมาถึง</h3>
          {upcoming.length === 0 ? (
            <div style={{ background: 'white', borderRadius: 12, padding: '40px', textAlign: 'center', color: '#9ca3af' }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>📅</div>
              <p style={{ margin: 0 }}>ยังไม่มีนัดหมาย</p>
              <Link href="/book" style={{ display: 'inline-block', marginTop: 16, color: '#0d9488', fontWeight: 600 }}>จองนัดหมายแรก →</Link>
            </div>
          ) : (
            upcoming.map(appt => (
              <AppointmentCard
                key={appt.id}
                appt={appt}
                onCancel={() => handleCancel(appt.id)}
                onReschedule={() => openReschedule(appt)}
                showActions
              />
            ))
          )}
        </div>

        {/* Past */}
        {past.length > 0 && (
          <div>
            <h3 style={{ color: '#374151', marginBottom: 16, fontSize: 18 }}>ประวัติการนัดหมาย</h3>
            {past.map(appt => (
              <AppointmentCard key={appt.id} appt={appt} showActions={false} />
            ))}
          </div>
        )}
      </div>

      {/* Reschedule Modal */}
      {modalOpen && selectedAppt && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 16 }}>
          <div style={{ background: 'white', borderRadius: 16, padding: 32, width: '100%', maxWidth: 420 }}>
            <h3 style={{ margin: '0 0 8px', color: '#0d9488' }}>เลื่อนนัดหมาย</h3>
            <p style={{ color: '#6b7280', fontSize: 14, marginBottom: 24 }}>{selectedAppt.petName} — {selectedAppt.service}</p>

            <div style={{ marginBottom: 16 }}>
              <label style={labelStyle}>วันที่ใหม่</label>
              <input type="date" value={newDate} onChange={e => setNewDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]} style={inputStyle} />
            </div>
            <div style={{ marginBottom: 24 }}>
              <label style={labelStyle}>เวลาใหม่</label>
              <select value={newTime} onChange={e => setNewTime(e.target.value)} style={inputStyle}>
                {['09:00','09:30','10:00','10:30','11:00','11:30','13:00','13:30','14:00','14:30','15:00','15:30','16:00'].map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            <div style={{ display: 'flex', gap: 12 }}>
              <button onClick={() => setModalOpen(false)} style={{ flex: 1, padding: '11px', border: '1px solid #d1d5db', borderRadius: 8, background: 'white', cursor: 'pointer', fontSize: 15, fontFamily: 'inherit' }}>
                ยกเลิก
              </button>
              <button onClick={handleReschedule} disabled={modalLoading} style={{ flex: 1, padding: '11px', background: '#0d9488', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 15, fontWeight: 700, fontFamily: 'inherit' }}>
                {modalLoading ? 'กำลังบันทึก...' : 'ยืนยัน'}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

function AppointmentCard({ appt, onCancel, onReschedule, showActions }: {
  appt: Appointment;
  onCancel?: () => void;
  onReschedule?: () => void;
  showActions: boolean;
}) {
  const s = statusLabel[appt.status] || statusLabel.pending;
  return (
    <div style={{ background: 'white', borderRadius: 12, padding: '20px 24px', marginBottom: 12, boxShadow: '0 1px 4px rgba(0,0,0,0.06)', border: '1px solid #f3f4f6' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 8 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
            <span style={{ fontSize: 20 }}>{appt.petType === 'แมว' ? '🐱' : appt.petType === 'สุนัข' ? '🐶' : '🐾'}</span>
            <strong style={{ fontSize: 16, color: '#111827' }}>{appt.petName}</strong>
            <span style={{ background: s.bg, color: s.color, padding: '2px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600 }}>{s.text}</span>
          </div>
          <div style={{ color: '#6b7280', fontSize: 14, display: 'flex', flexWrap: 'wrap', gap: '4px 16px' }}>
            <span>🏥 {appt.service}</span>
            <span>📅 {appt.date}</span>
            <span>🕐 {appt.time}</span>
          </div>
          {appt.notes && <p style={{ margin: '8px 0 0', fontSize: 13, color: '#9ca3af' }}>หมายเหตุ: {appt.notes}</p>}
        </div>
        {showActions && appt.status !== 'cancelled' && appt.status !== 'completed' && (
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={onReschedule} style={{ padding: '7px 14px', border: '1px solid #0d9488', color: '#0d9488', background: 'white', borderRadius: 7, cursor: 'pointer', fontSize: 13, fontFamily: 'inherit' }}>
              เลื่อนนัด
            </button>
            <button onClick={onCancel} style={{ padding: '7px 14px', border: '1px solid #ef4444', color: '#ef4444', background: 'white', borderRadius: 7, cursor: 'pointer', fontSize: 13, fontFamily: 'inherit' }}>
              ยกเลิก
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

const labelStyle: React.CSSProperties = { display: 'block', marginBottom: 6, fontSize: 14, fontWeight: 600, color: '#374151' };
const inputStyle: React.CSSProperties = { width: '100%', padding: '10px 14px', border: '1px solid #d1d5db', borderRadius: 8, fontSize: 15, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' };
const outlineBtnStyle: React.CSSProperties = { padding: '9px 18px', border: '2px solid #0d9488', color: '#0d9488', background: 'white', borderRadius: 8, cursor: 'pointer', fontSize: 14, fontWeight: 700, textDecoration: 'none' };
const ghostBtnStyle: React.CSSProperties = { padding: '9px 18px', border: '1px solid #e5e7eb', color: '#6b7280', background: 'white', borderRadius: 8, cursor: 'pointer', fontSize: 14, fontFamily: 'inherit' };