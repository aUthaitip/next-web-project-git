'use client';
import { useLanguage } from '../../context/LanguageContext';
import Modal from './Modal';
import type { Appointment } from './AppointmentCard';
import { rescheduleModalData } from '@/data/appointments/RescheduleModal';

const TIME_SLOTS = ['09:00','09:30','10:00','10:30','11:00','11:30','13:00','13:30','14:00','14:30','15:00','15:30','16:00'];

interface RescheduleModalProps {
  open: boolean;
  appt: Appointment | null;
  date: string;
  time: string;
  loading: boolean;
  onDateChange: (date: string) => void;
  onTimeChange: (time: string) => void;
  onClose: () => void;
  onConfirm: () => void;
}

export default function RescheduleModal({
  open,
  appt,
  date,
  time,
  loading,
  onDateChange,
  onTimeChange,
  onClose,
  onConfirm,
}: RescheduleModalProps) {
  const { lang } = useLanguage();
  const dataText = rescheduleModalData[lang];

  return (
    <Modal open={open && !!appt} onClose={onClose}>
      {appt && (
        <>
          <h3 style={{ margin: '0 0 8px', color: '#0d9488', fontSize: '1.4rem', fontWeight: 700 }}>
            {dataText.title}
          </h3>
          <p style={{ color: '#6b7280', fontSize: 14, marginBottom: 24 }}>
            {appt.petName} — {appt.service}
          </p>

          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle}>{dataText.newDateLabel}</label>
            <input
              type="date"
              value={date}
              onChange={e => onDateChange(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              className="book-input"
            />
          </div>

          <div style={{ marginBottom: 24 }}>
            <label style={labelStyle}>{dataText.newTimeLabel}</label>
            <select value={time} onChange={e => onTimeChange(e.target.value)} className="book-input">
              {TIME_SLOTS.map(ts => (
                <option key={ts} value={ts}>{ts}</option>
              ))}
            </select>
          </div>

          <div style={{ display: 'flex', gap: 12 }}>
            <button onClick={onClose} className="book-btn-secondary" style={{ padding: '10px', fontSize: '0.95rem' }}>
              {dataText.cancelBtn}
            </button>
            <button
              onClick={onConfirm}
              disabled={loading}
              className="book-btn-primary"
              style={{ padding: '10px', fontSize: '0.95rem', boxShadow: 'none' }}
            >
              {loading ? dataText.savingBtn : dataText.confirmBtn}
            </button>
          </div>
        </>
      )}
    </Modal>
  );
}

const labelStyle: React.CSSProperties = { display: 'block', marginBottom: 6, fontSize: 14, fontWeight: 600, color: '#374151' };
