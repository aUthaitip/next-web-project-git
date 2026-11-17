import React from 'react';

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
  userId?: number;
}

interface SuggestForm {
  date: string;
  time: string;
  service: string;
  doctorName: string;
  notes: string;
}

interface SuggestAppointmentModalProps {
  suggestAppt: Appointment | null;
  setSuggestAppt: (appt: Appointment | null) => void;
  suggestForm: SuggestForm;
  setSuggestForm: (form: SuggestForm) => void;
  handleSuggestAppointment: (e: React.FormEvent) => void;
  lang: string;
  doctors: any[];
}

export default function SuggestAppointmentModal({
  suggestAppt,
  setSuggestAppt,
  suggestForm,
  setSuggestForm,
  handleSuggestAppointment,
  lang,
  doctors,
}: SuggestAppointmentModalProps) {
  if (!suggestAppt) return null;

  return (
    <div className="appt-modal-overlay" onClick={() => setSuggestAppt(null)}>
      <form className="appt-modal" onSubmit={handleSuggestAppointment} onClick={(e) => e.stopPropagation()}>
        <div className="doctors-modal__header">
          <div>
            <h2 className="doctors-modal__title">Suggest Next Appointment</h2>
            <div className="doctors-modal__subtitle">แนะนำวันนัดหมายครั้งถัดไปให้ลูกค้า</div>
          </div>
          <button type="button" className="doctors-modal__close" onClick={() => setSuggestAppt(null)}>✕</button>
        </div>
        <div style={{ marginBottom: 20, padding: 12, backgroundColor: '#f8fafc', borderRadius: 12, border: '1px solid #e2e8f0', color: '#334155', fontSize: 13 }}>
          <strong>Pet:</strong> {suggestAppt.petName} (Owner: {suggestAppt.patient})<br/>
          <span style={{ fontSize: 11, color: '#64748b', marginTop: 4, display: 'inline-block' }}>* ระบบจะส่งการแจ้งเตือนไปยังผู้ใช้ เพื่อให้กดยืนยันการนัดหมายนี้</span>
        </div>
        <div className="appt-modal__field" style={{ marginBottom: 16 }}>
          <label className="doctors-modal__label" style={{ fontWeight: 600, color: '#1e293b' }}>{lang === 'th' ? 'ประเภทบริการ' : 'Service / Reason'}</label>
          <select className="appt-modal__input" value={suggestForm.service} onChange={e => setSuggestForm({ ...suggestForm, service: e.target.value })} required style={{ border: '1px solid #cbd5e1', borderRadius: 8, padding: '10px 14px', width: '100%' }}>
            <option value="">{lang === 'th' ? 'กรุณาเลือกบริการ' : 'Please select a service'}</option>
            <option value="ตรวจสุขภาพทั่วไป">{lang === 'th' ? 'ตรวจสุขภาพทั่วไป' : 'General Health Check'}</option>
            <option value="ฉีดวัคซีน">{lang === 'th' ? 'ฉีดวัคซีน' : 'Vaccination'}</option>
            <option value="ทำหมัน">{lang === 'th' ? 'ทำหมัน' : 'Neutering'}</option>
            <option value="ทันตกรรม">{lang === 'th' ? 'ทันตกรรม' : 'Dentistry'}</option>
            <option value="อื่นๆ">{lang === 'th' ? 'อื่นๆ' : 'Other'}</option>
          </select>
        </div>

        {/* Doctor Selection */}
        <div className="appt-modal__field" style={{ marginBottom: 16 }}>
          <label className="doctors-modal__label" style={{ fontWeight: 600, color: '#1e293b' }}>{lang === 'th' ? 'พบแพทย์' : 'Doctor'}</label>
          <select className="appt-modal__input" value={suggestForm.doctorName || ''} onChange={e => setSuggestForm({ ...suggestForm, doctorName: e.target.value })} style={{ border: '1px solid #cbd5e1', borderRadius: 8, padding: '10px 14px', width: '100%' }}>
            <option value="">{lang === 'th' ? 'ไม่ระบุแพทย์ (แพทย์ท่านใดก็ได้)' : 'Any Doctor / Not Specified'}</option>
            {doctors.map((doc) => (
              <option key={doc.id} value={doc.name}>
                {doc.name} {doc.specialty ? `(${doc.specialty})` : ''}
              </option>
            ))}
          </select>
        </div>

        {/* Date and Time */}
        <div className="appt-modal__field" style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
          <div style={{ flex: 1 }}>
            <label className="doctors-modal__label" style={{ fontWeight: 600, color: '#1e293b' }}>Date</label>
            <input type="date" className="doctors-modal__input" value={suggestForm.date} onChange={e => setSuggestForm({ ...suggestForm, date: e.target.value })} required style={{ border: '1px solid #cbd5e1', borderRadius: 8, padding: '10px 14px', width: '100%' }} />
          </div>
          <div style={{ flex: 1 }}>
            <label className="doctors-modal__label" style={{ fontWeight: 600, color: '#1e293b' }}>Time</label>
            <input type="time" className="doctors-modal__input" value={suggestForm.time} onChange={e => setSuggestForm({ ...suggestForm, time: e.target.value })} required style={{ border: '1px solid #cbd5e1', borderRadius: 8, padding: '10px 14px', width: '100%' }} />
          </div>
        </div>

        {/* Notes Textarea */}
        <div className="appt-modal__field" style={{ marginBottom: 24 }}>
          <label className="doctors-modal__label" style={{ fontWeight: 600, color: '#1e293b' }}>{lang === 'th' ? 'หมายเหตุเพิ่มเติม' : 'Notes / Remarks'}</label>
          <textarea className="doctors-modal__input" value={suggestForm.notes || ''} onChange={e => setSuggestForm({ ...suggestForm, notes: e.target.value })} placeholder={lang === 'th' ? 'ระบุหมายเหตุการนัดหมาย เช่น แนะนำให้อดอาหารก่อนตรวจ...' : 'Enter appointment notes...'} rows={2} style={{ border: '1px solid #cbd5e1', borderRadius: 8, padding: '10px 14px', width: '100%', resize: 'vertical', minHeight: '60px', fontFamily: 'inherit' }} />
        </div>

        <div className="doctors-modal__footer" style={{ marginTop: 0 }}>
          <button type="button" className="admin-btn admin-btn-secondary" onClick={() => setSuggestAppt(null)} style={{ padding: '10px 24px', fontWeight: 600, border: '1px solid #cbd5e1', background: 'white', color: '#475569' }}>
            Cancel
          </button>
          <button type="submit" className="admin-btn admin-btn-primary" style={{ padding: '10px 24px', fontWeight: 600, background: '#0f172a', color: 'white', border: 'none', boxShadow: '0 4px 12px rgba(15, 23, 42, 0.2)' }}>
            Send Suggestion
          </button>
        </div>
      </form>
    </div>
  );
}
