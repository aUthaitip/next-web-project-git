'use client';

import { useState, useEffect } from 'react';
import HideHeader from '@/components/layout/HideHeader';
import HideFooter from '@/components/layout/HideFooter';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { useLanguage } from '@/context/LanguageContext';

interface Appointment {
  id: number;
  patient: string;
  service: string;
  date: string;
  time: string;
  owner: string;
  phone: string;
  petName: string;
  petType: string;
  notes?: string;
  status?: string;
  createdAt?: string;
}

export default function HistoryPage() {
  const { lang } = useLanguage();
  const [history, setHistory] = useState<Appointment[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedAppt, setSelectedAppt] = useState<Appointment | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await fetch('/api/appointments');
        const data = await res.json();
        const confirmed = data.filter(
          (a: Appointment) => a.status?.toLowerCase() === 'confirmed'
        );
        confirmed.sort((a: Appointment, b: Appointment) =>
          (b.date || '').localeCompare(a.date || '')
        );
        setHistory(confirmed);
        if (confirmed.length > 0) {
          setSelectedDate(confirmed[0].date?.split('T')[0] || '');
        }
      } catch (error) {
        console.error('Failed to load history:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  // Group by date
  const dateGroups: Record<string, Appointment[]> = {};
  history.forEach((a) => {
    const d = a.date?.split('T')[0] || 'unknown';
    if (!dateGroups[d]) dateGroups[d] = [];
    dateGroups[d].push(a);
  });

  const sortedDates = Object.keys(dateGroups).sort((a, b) => b.localeCompare(a));
  const apptForSelectedDate = selectedDate ? (dateGroups[selectedDate] || []) : [];

  const formatDate = (dateStr: string) => {
    if (!dateStr || dateStr === 'unknown') return lang === 'th' ? 'ไม่ระบุวันที่' : 'No date specified';
    const d = new Date(dateStr);
    return d.toLocaleDateString('th-TH', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' });
  };

  const formatDateFull = (dateStr: string) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleDateString('th-TH', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  };

  const isToday = (dateStr: string) => dateStr === new Date().toISOString().split('T')[0];

  return (
    <div className="admin-layout">
      <HideHeader />
      <div className="admin-container-new">
        <AdminSidebar />

        <div className="admin-content-new">

          {/* Header */}
          <div className="admin-header-new">
            <div>
              <h1>📋 {lang === 'th' ? 'ประวัติการนัดหมาย' : 'Appointment History'}</h1>
              <p>{lang === 'th' ? 'ทั้งหมด' : 'Total'} <strong>{history.length}</strong> {lang === 'th' ? 'รายการ' : 'Items'} · {sortedDates.length} {lang === 'th' ? 'วัน' : 'Days'}</p>
            </div>
            <span style={{ background: '#6eb093', color: '#fff', padding: '6px 16px', borderRadius: 20, fontSize: 14, fontWeight: 600 }}>
              Confirmed Only
            </span>
          </div>

          {loading ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 300, flexDirection: 'column', gap: 16, color: '#64748b' }}>
              <div style={{ width: 48, height: 48, border: '4px solid #e2e8f0', borderTopColor: '#6eb093', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
              <p>{lang === 'th' ? 'กำลังโหลดข้อมูล...' : 'Loading...'}</p>
            </div>
          ) : history.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '80px 24px', color: '#94a3b8' }}>
              <div style={{ fontSize: 64, marginBottom: 16 }}>📭</div>
              <h3 style={{ fontSize: 18, fontWeight: 600, color: '#475569', marginBottom: 8 }}>{lang === 'th' ? 'ยังไม่มีประวัติการนัดหมาย' : 'No Appointment History'}</h3>
              <p style={{ fontSize: 14 }}>{lang === 'th' ? 'ประวัติจะปรากฏเมื่อมีนัดหมายที่ถูก Confirm แล้ว' : 'History will appear when there are confirmed appointments'}</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: 20, alignItems: 'start' }}>

              {/* LEFT: Date list */}
              <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', overflow: 'hidden', position: 'sticky', top: 20 }}>
                <div style={{ padding: '16px 20px', borderBottom: '1px solid #e2e8f0', background: '#eef6f2' }}>
                  <h3 style={{ fontSize: 14, fontWeight: 700, color: '#0f172a', margin: 0 }}>📅 {lang === 'th' ? 'เลือกวันที่' : 'Select Date'}</h3>
                  <p style={{ fontSize: 12, color: '#64748b', margin: '4px 0 0' }}>{sortedDates.length} {lang === 'th' ? 'วันที่มีนัดหมาย' : 'Days with appointments'}</p>
                </div>
                <div style={{ maxHeight: 560, overflowY: 'auto' }}>
                  {sortedDates.map((date) => {
                    const count = dateGroups[date].length;
                    const isSelected = selectedDate === date;
                    const todayMark = isToday(date);
                    return (
                      <button
                        key={date}
                        onClick={() => { setSelectedDate(date); setSelectedAppt(null); }}
                        style={{
                          width: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '14px 20px',
                          background: isSelected ? '#6eb093' : 'transparent',
                          color: isSelected ? '#fff' : '#334155',
                          border: 'none',
                          borderBottom: '1px solid #f1f5f9',
                          cursor: 'pointer',
                          textAlign: 'left',
                          transition: 'all 0.15s ease',
                        }}
                      >
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                            {formatDate(date)}
                            {todayMark && (
                              <span style={{ fontSize: 10, background: isSelected ? 'rgba(255,255,255,0.25)' : '#dcfce7', color: isSelected ? '#fff' : '#16a34a', padding: '1px 6px', borderRadius: 8, fontWeight: 700 }}>
                                {lang === 'th' ? 'วันนี้' : 'Today'}
                              </span>
                            )}
                          </div>
                        </div>
                        <span style={{
                          minWidth: 26, height: 26,
                          background: isSelected ? 'rgba(255,255,255,0.25)' : '#dcfce7',
                          color: isSelected ? '#fff' : '#047857',
                          borderRadius: 13,
                          fontSize: 12, fontWeight: 700,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                          {count}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* RIGHT: Appointment list */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

                {/* Selected date header */}
                {selectedDate && (
                  <div style={{ background: '#6eb093', color: '#fff', borderRadius: 12, padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ fontSize: 18, fontWeight: 700 }}>{formatDateFull(selectedDate)}</div>
                      <div style={{ fontSize: 13, opacity: 0.85, marginTop: 2 }}>{lang === 'th' ? 'มีนัดหมาย' : 'Have'} {apptForSelectedDate.length} {lang === 'th' ? 'รายการ' : 'appointments'}</div>
                    </div>
                    {isToday(selectedDate) && (
                      <span style={{ background: 'rgba(255,255,255,0.2)', padding: '4px 14px', borderRadius: 20, fontSize: 13, fontWeight: 600 }}>📍 {lang === 'th' ? 'วันนี้' : 'Today'}</span>
                    )}
                  </div>
                )}

                {/* Cards */}
                <div style={{ display: 'grid', gap: 12 }}>
                  {[...apptForSelectedDate]
                    .sort((a, b) => (a.time || '').localeCompare(b.time || ''))
                    .map((appt) => {
                      const isExpanded = selectedAppt?.id === appt.id;
                      return (
                        <div key={appt.id} style={{
                          background: '#fff',
                          borderRadius: 14,
                          border: isExpanded ? '2px solid #6eb093' : '1px solid #e2e8f0',
                          boxShadow: isExpanded ? '0 4px 20px rgba(16, 185, 129, 0.15)' : '0 2px 8px rgba(0,0,0,0.04)',
                          overflow: 'hidden',
                          transition: 'all 0.2s ease',
                        }}>
                          {/* Summary row — click to expand */}
                          <button
                            onClick={() => setSelectedAppt(isExpanded ? null : appt)}
                            style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 16, padding: '16px 20px', background: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left' }}
                          >
                            {/* Time */}
                            <div style={{
                              minWidth: 64, height: 56,
                              background: isExpanded ? '#6eb093' : '#eef6f2',
                              color: isExpanded ? '#fff' : '#6eb093',
                              borderRadius: 12,
                              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                              fontSize: 13, fontWeight: 700,
                            }}>
                              <span style={{ fontSize: 10, opacity: 0.7, marginBottom: 2 }}>{lang === 'th' ? 'เวลา' : 'Time'}</span>
                              {appt.time || '-'}
                            </div>

                            {/* Info */}
                            <div style={{ flex: 1 }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                                <span style={{ fontSize: 15, fontWeight: 700, color: '#0f172a' }}>👤 {appt.patient}</span>
                                <span style={{ fontSize: 11, background: '#dcfce7', color: '#16a34a', padding: '2px 8px', borderRadius: 8, fontWeight: 600 }}>✓ Confirmed</span>
                              </div>
                              <div style={{ fontSize: 13, color: '#64748b', display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                                <span>🏥 {appt.service}</span>
                                <span>🐾 {appt.petName} ({appt.petType})</span>
                                <span>📞 {appt.phone}</span>
                              </div>
                            </div>

                            {/* Chevron */}
                            <div style={{
                              width: 28, height: 28, background: '#f1f5f9', borderRadius: '50%',
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              fontSize: 11, color: '#64748b',
                              transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                              transition: 'transform 0.2s ease',
                            }}>▼</div>
                          </button>

                          {/* Expanded detail */}
                          {isExpanded && (
                            <div style={{ borderTop: '1px solid #e2e8f0', padding: '16px 20px', background: '#fafafa', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                              {[
                                { label: lang === 'th' ? 'เจ้าของ' : 'Owner', value: appt.owner || appt.patient, icon: '👤' },
                                { label: lang === 'th' ? 'เบอร์โทร' : 'Phone', value: appt.phone, icon: '📞' },
                                { label: lang === 'th' ? 'สัตว์เลี้ยง' : 'Pet', value: `${appt.petName} (${appt.petType})`, icon: '🐾' },
                                { label: lang === 'th' ? 'บริการ' : 'Service', value: appt.service, icon: '🏥' },
                                { label: lang === 'th' ? 'วันที่' : 'Date', value: appt.date?.split('T')[0], icon: '📅' },
                                { label: lang === 'th' ? 'เวลา' : 'Time', value: appt.time, icon: '🕐' },
                              ].map(({ label, value, icon }) => (
                                <div key={label} style={{ background: '#fff', borderRadius: 8, padding: '10px 14px', border: '1px solid #e2e8f0' }}>
                                  <div style={{ fontSize: 11, color: '#94a3b8', marginBottom: 4 }}>{icon} {label}</div>
                                  <div style={{ fontSize: 13, fontWeight: 600, color: '#0f172a' }}>{value || '-'}</div>
                                </div>
                              ))}
                              {appt.notes && (
                                <div style={{ gridColumn: '1 / -1', background: '#fffbeb', borderRadius: 8, padding: '10px 14px', border: '1px solid #fde68a' }}>
                                  <div style={{ fontSize: 11, color: '#92400e', marginBottom: 4 }}>📝 {lang === 'th' ? 'หมายเหตุ' : 'Notes'}</div>
                                  <div style={{ fontSize: 13, color: '#78350f' }}>{appt.notes}</div>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                </div>
              </div>

            </div>
          )}

        </div>
      </div>
      <HideFooter />
    </div>
  );
}
