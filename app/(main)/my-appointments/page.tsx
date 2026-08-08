'use client';
import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Bell, CheckCheck } from 'lucide-react';
import { useLanguage } from '../../../context/LanguageContext';
import AppointmentCard, { Appointment } from '../../../components/appointments/AppointmentCard';
import RescheduleModal from '../../../components/appointments/RescheduleModal';
import EditModal, { EditFormData } from '../../../components/appointments/EditModal';
import HideFooter from '@/components/layout/HideFooter';

interface AppNotification {
  id: number;
  message: string;
  read: boolean;
  createdAt: string;
}

export default function MyAppointmentsPage() {
  const router = useRouter();
  const { t } = useLanguage();

  const statusLabel = {
    suggested: { text: t('myAppts.statusSuggested'), color: '#4338ca', bg: '#e0e7ff' },
    pending:   { text: t('myAppts.statusPending'),   color: '#d97706', bg: '#fef3c7' },
    confirmed: { text: t('myAppts.statusConfirmed'),  color: '#059669', bg: '#d1fae5' },
    cancelled: { text: t('myAppts.statusCancelled'),  color: '#dc2626', bg: '#fee2e2' },
    completed: { text: t('myAppts.statusCompleted'),  color: '#6b7280', bg: '#f3f4f6' },
  } as Record<string, { text: string; color: string; bg: string }>;

  const [user, setUser] = useState<{ userName: string; userEmail: string } | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Tracks which appointment id currently has a cancel/confirm request in flight,
  // so we can disable that specific card's buttons and avoid double-submits.
  const [actionLoadingId, setActionLoadingId] = useState<number | null>(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedAppt, setSelectedAppt] = useState<Appointment | null>(null);
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('');
  const [modalLoading, setModalLoading] = useState(false);

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editData, setEditData] = useState<EditFormData>({ petName: '', petType: '', service: '', notes: '' });

  const fetchAppointments = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/appointments/mine');
      if (!res.ok) {
        setError(t('myAppts.loadError') || 'ไม่สามารถโหลดนัดหมายได้');
        return;
      }
      const data = await res.json();
      setAppointments(data);
    } catch {
      setError(t('myAppts.loadError') || 'ไม่สามารถโหลดนัดหมายได้');
    } finally {
      setLoading(false);
    }
  }, [t]);

  const fetchNotifications = useCallback(async () => {
    try {
      const res = await fetch('/api/notifications');
      if (!res.ok) return;
      const data = await res.json();
      setNotifications(data.notifications ?? []);
    } catch {
      // Notifications are non-critical; fail silently rather than blocking the page.
    }
  }, []);

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
      setUser(data);
      fetchAppointments();
      fetchNotifications();
    } catch {
      router.push('/login');
    }
  }, [router, fetchAppointments, fetchNotifications]);

  const markAsRead = async (id: number) => {
    try {
      const res = await fetch('/api/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      if (res.ok) {
        setNotifications(prev => prev.map(n => (n.id === id ? { ...n, read: true } : n)));
      }
    } catch {
      // Silently ignore; not critical to the user's flow.
    }
  };

  const markAllAsRead = async () => {
    try {
      const res = await fetch('/api/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ all: true }),
      });
      if (res.ok) {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      }
    } catch {
      // Silently ignore; not critical to the user's flow.
    }
  };

  const timeAgo = (iso: string) => {
    const diff = (Date.now() - new Date(iso).getTime()) / 1000;
    if (diff < 60) return t('myAppts.timeAgoJustNow');
    if (diff < 3600) return `${Math.floor(diff / 60)} ${t('myAppts.timeAgoMin')}`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} ${t('myAppts.timeAgoHour')}`;
    return `${Math.floor(diff / 86400)} ${t('myAppts.timeAgoDay')}`;
  };

  useEffect(() => {
    checkSession();
  }, [checkSession]);

  const handleCancel = async (id: number) => {
    if (!confirm(t('myAppts.confirmCancel'))) return;
    setActionLoadingId(id);
    try {
      const res = await fetch(`/api/appointments/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'cancelled' }),
      });
      if (res.ok) await fetchAppointments();
      else setError(t('myAppts.cancelError'));
    } catch {
      setError(t('myAppts.cancelError'));
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleConfirmSuggested = async (id: number) => {
    setActionLoadingId(id);
    try {
      const res = await fetch(`/api/appointments/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'confirmed' }),
      });
      if (res.ok) await fetchAppointments();
      else setError(t('myAppts.confirmSuggestedError'));
    } catch {
      setError(t('myAppts.confirmSuggestedError'));
    } finally {
      setActionLoadingId(null);
    }
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
    try {
      const res = await fetch(`/api/appointments/${selectedAppt.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date: newDate, time: newTime, status: 'pending' }),
      });
      if (res.ok) {
        setModalOpen(false);
        await fetchAppointments();
      } else {
        setError(t('myAppts.rescheduleError'));
      }
    } catch {
      setError(t('myAppts.rescheduleError'));
    } finally {
      setModalLoading(false);
    }
  };

  const openEdit = (appt: Appointment) => {
    setSelectedAppt(appt);
    setEditData({ petName: appt.petName, petType: appt.petType, service: appt.service, notes: appt.notes || '' });
    setEditModalOpen(true);
  };

  const handleEdit = async () => {
    if (!selectedAppt || !editData.petName || !editData.service) return;
    setModalLoading(true);
    try {
      const res = await fetch(`/api/appointments/${selectedAppt.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...editData }),
      });
      if (res.ok) {
        setEditModalOpen(false);
        await fetchAppointments();
      } else {
        setError(t('myAppts.editError') || 'ไม่สามารถแก้ไขนัดหมายได้');
      }
    } catch {
      setError(t('myAppts.editError') || 'ไม่สามารถแก้ไขนัดหมายได้');
    } finally {
      setModalLoading(false);
    }
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    window.dispatchEvent(new Event('user-auth-change'));
    router.push('/login');
    router.refresh();
  };

  // Sort chronologically (soonest first) so the API's row order never matters.
  const byDateTimeAsc = (a: Appointment, b: Appointment) => `${a.date}T${a.time}`.localeCompare(`${b.date}T${b.time}`);
  const byDateTimeDesc = (a: Appointment, b: Appointment) => `${b.date}T${b.time}`.localeCompare(`${a.date}T${a.time}`);

  const upcoming = appointments.filter(a => a.status !== 'cancelled' && a.status !== 'completed').sort(byDateTimeAsc);
  const past = appointments.filter(a => a.status === 'cancelled' || a.status === 'completed').sort(byDateTimeDesc);

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center', color: '#0d9488' }}>
        <div style={{ fontSize: 48 }}>🐾</div>
        <p>{t('myAppts.loading')}</p>
      </div>
    </div>
  );

  return (
    <section style={{ backgroundColor: 'var(--bg-light)', minHeight: '100vh', padding: '40px 0' }}>
      <HideFooter />
      <div className="container" style={{ maxWidth: 1100, margin: '0 auto' }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32, flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h2 style={{ margin: 0, color: '#0d9488', fontSize: 24 }}>{t('myAppts.title')}</h2>
            <p style={{ margin: '4px 0 0', color: '#6b7280', fontSize: 14 }}>{t('myAppts.hello')} {user?.userName}</p>
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <Link href="/book" style={{ ...outlineBtnStyle }}>{t('myAppts.newBooking')}</Link>
          </div>
        </div>
        
        {error && (
          <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', padding: '12px 16px', borderRadius: 8, marginBottom: 16, fontSize: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
            <span>{error}</span>
            <button onClick={() => setError('')} style={{ background: 'none', border: 'none', color: '#dc2626', cursor: 'pointer', fontSize: 16, lineHeight: 1, fontWeight: 700 }} aria-label="dismiss">×</button>
          </div>
        )}

        {/* Main Content Layout Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.1fr', gap: '32px', alignItems: 'start' }} className="appointments-layout">

          {/* Left Column: Appointments List */}
          <div>
            <div style={{ marginBottom: 32 }}>
              <h3 style={{ color: '#374151', marginBottom: 16, fontSize: 18 }}>{t('myAppts.upcoming')}</h3>
              {upcoming.length === 0 ? (
                <div style={{ background: 'white', borderRadius: 12, padding: '40px', textAlign: 'center', color: '#9ca3af' }}>
                  <div style={{ fontSize: 48, marginBottom: 12 }}>📅</div>
                  <p style={{ margin: 0 }}>{t('myAppts.noUpcoming')}</p>
                </div>
              ) : (
                upcoming.map(appt => (
                  <AppointmentCard
                    key={appt.id}
                    appt={appt}
                    statusLabel={statusLabel}
                    notesLabel={t('myAppts.notesLabel')}
                    editText={t('myAppts.editBtn')}
                    rescheduleText={t('myAppts.rescheduleBtn')}
                    cancelText={t('myAppts.cancelBtn')}
                    confirmThisAppt={t('myAppts.confirmThisAppt')}
                    onEdit={() => openEdit(appt)}
                    onCancel={() => handleCancel(appt.id)}
                    onReschedule={() => openReschedule(appt)}
                    onConfirmSuggested={() => handleConfirmSuggested(appt.id)}
                    showActions
                    actionLoading={actionLoadingId === appt.id}
                  />
                ))
              )}
            </div>

            {past.length > 0 && (
              <div>
                <h3 style={{ color: '#374151', marginBottom: 16, fontSize: 18 }}>{t('myAppts.past')}</h3>
                {past.map(appt => (
                  <AppointmentCard key={appt.id} appt={appt} statusLabel={statusLabel} notesLabel={t('myAppts.notesLabel')} editText="" rescheduleText="" cancelText="" showActions={false} />
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Notifications Panel */}
          <div>
            <div style={{ background: 'white', borderRadius: 16, padding: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', border: '1px solid #f3f4f6' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <h3 style={{ margin: 0, color: '#374151', fontSize: 18, display: 'flex', alignItems: 'center', gap: 10 }}>
                  <Bell size={20} className="text-[#0d9488]" style={{ color: '#0d9488' }} /> {t('myAppts.notifTitle')}
                </h3>
                {notifications.some(n => !n.read) && (
                  <button
                    onClick={markAllAsRead}
                    style={{ background: 'none', border: 'none', color: '#0d9488', cursor: 'pointer', fontSize: 13, fontWeight: 600, fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 4 }}
                  >
                    <CheckCheck size={14} /> {t('myAppts.markAllRead')}
                  </button>
                )}
              </div>

              {notifications.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '32px 0', color: '#9ca3af' }}>
                  <div style={{ fontSize: 40, marginBottom: 12 }}>📭</div>
                  <p style={{ margin: 0, fontSize: 14 }}>{t('myAppts.noNotif')}</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxHeight: '480px', overflowY: 'auto', paddingRight: '4px' }}>
                  {notifications.map(n => (
                    <div
                      key={n.id}
                      onClick={() => !n.read && markAsRead(n.id)}
                      style={{
                        display: 'flex', alignItems: 'flex-start', gap: 12, padding: '12px 14px', borderRadius: 10,
                        background: n.read ? '#ffffff' : '#f0fdf4',
                        border: n.read ? '1px solid #e5e7eb' : '1px solid #bbf7d0',
                        cursor: n.read ? 'default' : 'pointer',
                      }}
                      className="notif-item-hover"
                    >
                      <span style={{ width: 8, height: 8, borderRadius: '50%', background: n.read ? '#9ca3af' : '#22c55e', marginTop: 6, flexShrink: 0 }} />
                      <div style={{ flex: 1 }}>
                        <p style={{ margin: 0, fontSize: 13.5, color: '#374151', lineHeight: 1.45, fontWeight: n.read ? 400 : 500 }}>{n.message}</p>
                        <span style={{ fontSize: 11, color: '#9ca3af', display: 'block', marginTop: 4 }}>{timeAgo(n.createdAt)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

        </div>
      </div>

      <RescheduleModal
        open={modalOpen}
        appt={selectedAppt}
        date={newDate}
        time={newTime}
        loading={modalLoading}
        onDateChange={setNewDate}
        onTimeChange={setNewTime}
        onClose={() => setModalOpen(false)}
        onConfirm={handleReschedule}
      />

      <EditModal
        open={editModalOpen}
        appt={selectedAppt}
        data={editData}
        loading={modalLoading}
        onChange={setEditData}
        onClose={() => setEditModalOpen(false)}
        onConfirm={handleEdit}
      />
    </section>
  );
}

const outlineBtnStyle: React.CSSProperties = { padding: '9px 18px', border: '2px solid #0d9488', color: '#0d9488', background: 'white', borderRadius: 8, cursor: 'pointer', fontSize: 14, fontWeight: 700, textDecoration: 'none' };
const ghostBtnStyle: React.CSSProperties = { padding: '9px 18px', border: '1px solid #e5e7eb', color: '#6b7280', background: 'white', borderRadius: 8, cursor: 'pointer', fontSize: 14, fontFamily: 'inherit' };
