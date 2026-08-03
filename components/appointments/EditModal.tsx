'use client';
import { useLanguage } from '../../context/LanguageContext';
import Modal from './Modal';
import type { Appointment } from './AppointmentCard';
import { editModalData } from '@/data/appointments/EditModal';

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
  const { lang } = useLanguage();
  const dataText = editModalData[lang];

  const setField = (field: keyof EditFormData, value: string) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <Modal open={open && !!appt} onClose={onClose}>
      {appt && (
        <>
          <h3 style={{ margin: '0 0 8px', color: '#0d9488', fontSize: '1.4rem', fontWeight: 700 }}>
            {dataText.title}
          </h3>
          <p style={{ color: '#6b7280', fontSize: 14, marginBottom: 24 }}>
            {dataText.subtitle} {appt.petName}
          </p>

          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle}>{dataText.petNameLabel}</label>
            <input
              type="text"
              value={data.petName}
              onChange={e => setField('petName', e.target.value)}
              className="book-input"
            />
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle}>{dataText.petTypeLabel}</label>
            <select value={data.petType} onChange={e => setField('petType', e.target.value)} className="book-input">
              <option value="สุนัข">{dataText.petOptions.dog}</option>
              <option value="แมว">{dataText.petOptions.cat}</option>
              <option value="กระต่าย">{dataText.petOptions.rabbit}</option>
              <option value="นก">{dataText.petOptions.bird}</option>
              <option value="อื่นๆ">{dataText.petOptions.other}</option>
            </select>
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle}>{dataText.serviceLabel}</label>
            <select value={data.service} onChange={e => setField('service', e.target.value)} className="book-input">
              <option value="">{dataText.serviceSelect}</option>
              <option value="ตรวจสุขภาพทั่วไป">{dataText.services.svc1}</option>
              <option value="ฉีดวัคซีน">{dataText.services.svc2}</option>
              <option value="ทำหมัน">{dataText.services.svc3}</option>
              <option value="ทันตกรรม">{dataText.services.svc4}</option>
              <option value="อื่นๆ">{dataText.services.svc5}</option>
            </select>
          </div>

          <div style={{ marginBottom: 24 }}>
            <label style={labelStyle}>{dataText.notesLabel}</label>
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
