import React from 'react';

interface NewAppointmentForm {
  patientName: string;
  date: string;
  status: string;
  reason: string;
  notes: string;
}

interface AppointmentModalProps {
  showModal: boolean;
  setShowModal: (show: boolean) => void;
  form: NewAppointmentForm;
  setForm: (form: NewAppointmentForm) => void;
  handleSaveAppointment: (e: React.FormEvent) => void;
  lang: string;
}

export default function AppointmentModal({
  showModal,
  setShowModal,
  form,
  setForm,
  handleSaveAppointment,
  lang,
}: AppointmentModalProps) {
  if (!showModal) return null;

  return (
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
          <label className="appt-modal__label">{lang === 'th' ? 'ประเภทบริการ' : 'Reason for Visit'}</label>
          <select className="appt-modal__input" value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })} required>
            <option value="">{lang === 'th' ? 'กรุณาเลือกบริการ' : 'Please select a service'}</option>
            <option value="ตรวจสุขภาพทั่วไป">{lang === 'th' ? 'ตรวจสุขภาพทั่วไป' : 'General Health Check'}</option>
            <option value="ฉีดวัคซีน">{lang === 'th' ? 'ฉีดวัคซีน' : 'Vaccination'}</option>
            <option value="ทำหมัน">{lang === 'th' ? 'ทำหมัน' : 'Neutering'}</option>
            <option value="ทันตกรรม">{lang === 'th' ? 'ทันตกรรม' : 'Dentistry'}</option>
            <option value="อื่นๆ">{lang === 'th' ? 'อื่นๆ' : 'Other'}</option>
          </select>
        </div>
        <div className="appt-modal__field">
          <label className="appt-modal__label">Internal Notes</label>
          <textarea className="appt-modal__input appt-modal__textarea" placeholder="Additional notes..." value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
        </div>
        <div className="appt-modal__footer">
          <button type="button" className="admin-btn admin-btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
          <button type="submit" className="appt-modal__submit">Save Appointment</button>
        </div>
      </form>
    </div>
  );
}
