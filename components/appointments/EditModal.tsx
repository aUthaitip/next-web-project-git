'use client';
import { useLanguage } from '../../context/LanguageContext';
import Modal from './Modal';
import type { Appointment } from './AppointmentCard';

export interface EditFormData {
  petName: string;
  petType: string;
  service: string;
  notes: string;
}

interface EditModalProps {
  open: boolean;
  appt: Appointment | null;
  data: EditFormData;
  loading: boolean;
  onChange: (data: EditFormData) => void;
  onClose: () => void;
  onConfirm: () => void;
}

export default function EditModal({
  open,
  appt,
  data,
  loading,
  onChange,
  onClose,
  onConfirm,
}: EditModalProps) {
  const { t } = useLanguage();

  const setField = (field: keyof EditFormData, value: string) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <Modal open={open && !!appt} onClose={onClose}>
      {appt && (
        <>
          <h3 style={{ margin: '0 0 8px', color: '#0d9488', fontSize: '1.4rem', fontWeight: 700 }}>
            {t('myAppts.editModalTitle')}
          </h3>
          <p style={{ color: '#6b7280', fontSize: 14, marginBottom: 24 }}>
            {t('myAppts.editModalSubtitle')} {appt.petName}
          </p>

          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle}>{t('myAppts.petNameLabel')}</label>
            <input
              type="text"
              value={data.petName}
              onChange={e => setField('petName', e.target.value)}
              className="book-input"
            />
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle}>{t('myAppts.petTypeLabel')}</label>
            <select value={data.petType} onChange={e => setField('petType', e.target.value)} className="book-input">
              <option value="สุนัข">{t('book.petDog')}</option>
              <option value="แมว">{t('book.petCat')}</option>
              <option value="กระต่าย">{t('book.petRabbit')}</option>
              <option value="นก">{t('book.petBird')}</option>
              <option value="อื่นๆ">{t('book.petOther')}</option>
            </select>
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle}>{t('myAppts.serviceLabel')}</label>
            <select value={data.service} onChange={e => setField('service', e.target.value)} className="book-input">
              <option value="">{t('book.serviceSelect') || 'กรุณาเลือกบริการ'}</option>
              <option value="ตรวจสุขภาพทั่วไป">{t('book.svc1') || 'ตรวจสุขภาพทั่วไป'}</option>
              <option value="ฉีดวัคซีน">{t('book.svc2') || 'ฉีดวัคซีน'}</option>
              <option value="ทำหมัน">{t('book.svc3') || 'ทำหมัน'}</option>
              <option value="ทันตกรรม">{t('book.svc4') || 'ทันตกรรม'}</option>
              <option value="อื่นๆ">{t('book.svc5') || 'อื่นๆ'}</option>
            </select>
          </div>

          <div style={{ marginBottom: 24 }}>
            <label style={labelStyle}>{t('myAppts.notesModalLabel')}</label>
            <textarea
              value={data.notes}
              onChange={e => setField('notes', e.target.value)}
              className="book-input"
              rows={2}
              style={{ resize: 'vertical' }}
            />
          </div>

          <div style={{ display: 'flex', gap: 12 }}>
            <button onClick={onClose} className="book-btn-secondary" style={{ padding: '10px', fontSize: '0.95rem' }}>
              {t('myAppts.cancelModalBtn')}
            </button>
            <button
              onClick={onConfirm}
              disabled={loading}
              className="book-btn-primary"
              style={{ padding: '10px', fontSize: '0.95rem', boxShadow: 'none' }}
            >
              {loading ? t('myAppts.savingBtn') : t('myAppts.confirmBtn')}
            </button>
          </div>
        </>
      )}
    </Modal>
  );
}

const labelStyle: React.CSSProperties = { display: 'block', marginBottom: 6, fontSize: 14, fontWeight: 600, color: '#374151' };
