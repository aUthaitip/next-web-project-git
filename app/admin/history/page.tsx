'use client';

import { useState, useEffect } from 'react';
import HideHeader from '@/components/layout/HideHeader';
import HideFooter from '@/components/layout/HideFooter';
import AdminSidebar from '@/components/AdminSidebar';

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
  const [history, setHistory] = useState<Appointment[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await fetch('/api/appointments');
        const data = await res.json();
        // กรองเฉพาะ status Confirmed (case-insensitive)
        const confirmed = data.filter(
          (a: Appointment) => a.status?.toLowerCase() === 'confirmed'
        );
        setHistory(confirmed);
      } catch (error) {
        console.error('Failed to load history:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const filteredHistory = history.filter((a) => {
    // date จาก DB อาจเป็น ISO string เช่น "2026-03-01T00:00:00.000Z" หรือ "2026-03-01"
    const apptDate = a.date?.split('T')[0]; // normalize เป็น YYYY-MM-DD
    const matchDate = !selectedDate || apptDate === selectedDate;
    const matchPatient = !selectedPatient || a.patient === selectedPatient;
    return matchDate && matchPatient;
  });

  return (
    <div className="admin-layout">
      <HideHeader />

      <div className="admin-container-new">

        <AdminSidebar />

        {/* ===== MAIN CONTENT ===== */}
        <div className="admin-content-new">

          <div className="admin-header-new">
            <div>
              <h1>Appointment History</h1>
              <p>All <strong>{history.length}</strong> items · All Appointments</p>
            </div>
            <span className="history-header-badge">All Appointments</span>
          </div>

          <div className="stat-card-new stat-blue history-filter-card">
            <h3 className="history-filter-title">🔍 ตัวกรอง</h3>
            <div className="history-filter-row">
              <label className="history-filter-label">
                📅 ค้นหาตามวันที่:
                <input
                  type="date"
                  className="history-date-input"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                />
              </label>
            </div>
          </div>

          {loading ? (
            <div className="stat-card-new history-loading-state">
              <p>⏳ กำลังโหลดข้อมูล...</p>
            </div>

          ) : filteredHistory.length === 0 ? (
            <div className="stat-card-new history-empty-state">
              <p className="history-empty-text">📭 ไม่มีข้อมูลการจองในวันที่นี้</p>
            </div>

          ) : (
            <div className="history-content-grid">

              <div className="stat-card-new stat-blue">
                <h3 className="history-section-title">👥 รายชื่อผู้จอง</h3>
                <div className="history-patient-list">
                  <button
                    onClick={() => setSelectedPatient('')}
                    className={`history-patient-btn ${selectedPatient === '' ? 'active' : ''}`}
                  >
                    <span>All</span>
                    <span className="admin-status-badge admin-status-confirmed">{filteredHistory.length}</span>
                  </button>
                  {[...new Set(filteredHistory.map((a) => a.patient))].map((patient) => {
                    const count = filteredHistory.filter((a) => a.patient === patient).length;
                    return (
                      <button
                        key={patient}
                        onClick={() => setSelectedPatient(patient)}
                        className={`history-patient-btn ${selectedPatient === patient ? 'active' : ''}`}
                      >
                        <strong>{patient}</strong>
                        <span className="admin-status-badge admin-status-confirmed">{count}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="stat-card-new stat-green">
                <h3 className="history-section-title">📅 รายละเอียด</h3>
                {selectedPatient ? (
                  <div className="history-details-list">
                    {filteredHistory
                      .filter((a) => a.patient === selectedPatient)
                      .map((appt) => (
                        <div key={appt.id} className="admin-card">
                          <div className="admin-list-item history-detail-item">
                            <span><strong>🏥 บริการ:</strong></span><span>{appt.service}</span>
                          </div>
                          <div className="admin-list-item history-detail-item">
                            <span><strong>📅 วันเวลา:</strong></span><span>{appt.date?.split('T')[0]} @ {appt.time}</span>
                          </div>
                          <div className="admin-list-item history-detail-item">
                            <span><strong>🐾 สัตว์:</strong></span><span>{appt.petName} ({appt.petType})</span>
                          </div>
                          <div className="admin-list-item history-detail-item">
                            <span><strong>📞 เบอร์:</strong></span><span>{appt.phone}</span>
                          </div>
                          {appt.notes && (
                            <div className="admin-list-item history-detail-item">
                              <span><strong>📝 หมายเหตุ:</strong></span><span>{appt.notes}</span>
                            </div>
                          )}
                        </div>
                      ))}
                  </div>
                ) : (
                  <div className="history-appointments-grid">
                    {filteredHistory.map((appt) => (
                      <div key={appt.id} className="history-appointment-card">
                        <div><strong>👤 ชื่อ:</strong> {appt.patient}</div>
                        <div><strong>🏥 บริการ:</strong> {appt.service}</div>
                        <div><strong>📅 เวลา:</strong> {appt.time}</div>
                        <div><strong>🐾 สัตว์:</strong> {appt.petName} ({appt.petType})</div>
                        <div><strong>📞 เบอร์:</strong> {appt.phone}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          )}

        </div>
      </div>

      <HideFooter />
    </div>
  );
}
