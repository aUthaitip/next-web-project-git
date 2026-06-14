'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

const SERVICES = ['ตรวจสุขภาพทั่วไป', 'ฉีดวัคซีน', 'ทำหมัน', 'ทันตกรรม', 'อื่นๆ'];
const PET_TYPES = [
  { label: '🐶 สุนัข', value: 'สุนัข' },
  { label: '🐱 แมว', value: 'แมว' },
  { label: '🐰 กระต่าย', value: 'กระต่าย' },
  { label: '🐦 นก', value: 'นก' },
  { label: '🐾 อื่นๆ', value: 'อื่นๆ' },
];
const TIME_SLOTS = [
  '09:00','09:30','10:00','10:30','11:00','11:30',
  '13:00','13:30','14:00','14:30','15:00','15:30','16:00',
];

export default function BookPage() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [submitting, setSubmitting] = useState(false);
  const [sessionUser, setSessionUser] = useState<{ userName: string; userEmail: string; userPhone: string } | null>(null);

  const [formData, setFormData] = useState({
    service: '', otherService: '',
    date: '', time: '',
    owner: '', phone: '',
    petName: '', petType: '', otherPetType: '',
    notes: '',
  });

  useEffect(() => {
    fetch('/api/auth/me').then(r => r.json()).then(data => {
      if (data.isLoggedIn) {
        setSessionUser(data);
        setFormData(prev => ({ ...prev, owner: data.userName || '', phone: data.userPhone || '' }));
      }
    });
  }, []);

  const set = (key: string, val: string) => setFormData(prev => ({ ...prev, [key]: val }));

  const resolvedService = formData.service === 'อื่นๆ' ? formData.otherService : formData.service;
  const resolvedPetType = formData.petType === 'อื่นๆ' ? formData.otherPetType : formData.petType;

  const isStep1Valid =
    resolvedService && formData.date && formData.time &&
    formData.owner && formData.phone && formData.petName && resolvedPetType;

  const handleConfirm = async () => {
    setSubmitting(true);
    try {
      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patient: formData.owner, service: resolvedService,
          date: formData.date, time: formData.time,
          owner: formData.owner, phone: formData.phone,
          petName: formData.petName, petType: resolvedPetType,
          notes: formData.notes || '', status: 'pending',
        }),
      });
      if (res.ok) {
        if (sessionUser?.userEmail) {
          fetch('/api/appointments/confirm-email', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ petName: formData.petName, service: resolvedService, date: formData.date, time: formData.time }),
          }).catch(() => {});
        }
        setStep(3);
      } else {
        alert('เกิดข้อผิดพลาด กรุณาลองใหม่');
      }
    } catch { alert('เกิดข้อผิดพลาด กรุณาลองใหม่'); }
    finally { setSubmitting(false); }
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <main className="book-page page-animate">
      <div className="book-container">

        {/* Hero */}
        <div className="book-hero">
          <h2>📅 จองนัดหมาย</h2>
          <p>กรอกรายละเอียดเพื่อนรักของคุณ ทีมงานจะยืนยันภายใน 24 ชั่วโมง</p>
        </div>

        {/* Steps */}
        {step < 3 && (
          <div className="book-steps">
            <div className="book-step">
              <div className={`book-step__circle ${step >= 1 ? 'active' : ''}`}>1</div>
              <span className={`book-step__label ${step === 1 ? 'active' : ''}`}>กรอกข้อมูล</span>
            </div>
            <div className={`book-step__line ${step > 1 ? 'done' : ''}`} />
            <div className="book-step">
              <div className={`book-step__circle ${step >= 2 ? 'active' : ''}`}>2</div>
              <span className={`book-step__label ${step === 2 ? 'active' : ''}`}>ตรวจสอบ</span>
            </div>
          </div>
        )}

        {/* Session Banner */}
        {sessionUser && step === 1 && (
          <div className="book-banner">
            <span>👋 สวัสดี <strong>{sessionUser.userName}</strong> — กรอกข้อมูลให้แล้ว</span>
            <Link href="/my-appointments">ดูนัดของฉัน →</Link>
          </div>
        )}

        {/* ── STEP 1 ── */}
        {step === 1 && (
          <div className="book-card">
            {/* บริการ */}
            <div className="book-section">
              <div className="book-section__title">🏥 บริการที่ต้องการ</div>
              <div className="book-form-row">
                <div>
                  <label className="book-label">ประเภทบริการ *</label>
                  <select className="book-input" value={formData.service} onChange={e => set('service', e.target.value)} required>
                    <option value="">กรุณาเลือกบริการ</option>
                    {SERVICES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                {formData.service === 'อื่นๆ' && (
                  <div>
                    <label className="book-label">โปรดระบุ *</label>
                    <input className="book-input" type="text" value={formData.otherService}
                      onChange={e => set('otherService', e.target.value)} placeholder="ระบุบริการ..." required />
                  </div>
                )}
              </div>
            </div>

            {/* วันที่ */}
            <div className="book-section">
              <div className="book-section__title">📅 วันที่นัดหมาย</div>
              <div className="book-form-row">
                <div>
                  <label className="book-label">วันที่ *</label>
                  <input className="book-input" type="date" value={formData.date}
                    onChange={e => set('date', e.target.value)} min={today} required />
                </div>
              </div>
              <div style={{ marginTop: 16 }}>
                <label className="book-label">เวลา *</label>
                <div className="book-timeslots">
                  {TIME_SLOTS.map(t => (
                    <button key={t} type="button"
                      className={`book-timeslot ${formData.time === t ? 'selected' : ''}`}
                      onClick={() => set('time', t)}>
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* เจ้าของ */}
            <div className="book-section">
              <div className="book-section__title">👤 ข้อมูลเจ้าของ</div>
              <div className="book-form-row">
                <div>
                  <label className="book-label">ชื่อเจ้าของ *</label>
                  <input className="book-input" type="text" value={formData.owner}
                    onChange={e => set('owner', e.target.value)} placeholder="ชื่อ-นามสกุล" required />
                </div>
                <div>
                  <label className="book-label">เบอร์โทรศัพท์ *</label>
                  <input className="book-input" type="tel" value={formData.phone}
                    onChange={e => set('phone', e.target.value)} placeholder="08X-XXX-XXXX" required />
                </div>
              </div>
            </div>

            {/* สัตว์เลี้ยง */}
            <div className="book-section">
              <div className="book-section__title">🐾 ข้อมูลสัตว์เลี้ยง</div>
              <div className="book-form-row" style={{ marginBottom: 16 }}>
                <div>
                  <label className="book-label">ชื่อสัตว์เลี้ยง *</label>
                  <input className="book-input" type="text" value={formData.petName}
                    onChange={e => set('petName', e.target.value)} placeholder="ชื่อน้องหมา/แมว" required />
                </div>
              </div>
              <div>
                <label className="book-label">ประเภทสัตว์เลี้ยง *</label>
                <div className="book-pet-pills">
                  {PET_TYPES.map(p => (
                    <button key={p.value} type="button"
                      className={`book-pet-pill ${formData.petType === p.value ? 'selected' : ''}`}
                      onClick={() => set('petType', p.value)}>
                      {p.label}
                    </button>
                  ))}
                </div>
                {formData.petType === 'อื่นๆ' && (
                  <input className="book-input" style={{ marginTop: 10 }} type="text"
                    value={formData.otherPetType} onChange={e => set('otherPetType', e.target.value)}
                    placeholder="ระบุประเภทสัตว์เลี้ยง..." required />
                )}
              </div>
              <div style={{ marginTop: 16 }}>
                <label className="book-label">รายละเอียดเพิ่มเติม</label>
                <textarea className="book-input" rows={3} value={formData.notes}
                  onChange={e => set('notes', e.target.value)}
                  placeholder="อาการ, ประวัติการรักษา, หรือข้อมูลอื่นๆ..."
                  style={{ resize: 'vertical' }} />
              </div>
            </div>

            <div className="book-actions">
              <Link href="/appointment" className="book-btn-secondary" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                ยกเลิก
              </Link>
              <button className="book-btn-primary" onClick={() => isStep1Valid && setStep(2)} disabled={!isStep1Valid}>
                ถัดไป → ตรวจสอบข้อมูล
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 2: Summary ── */}
        {step === 2 && (
          <div className="book-summary">
            <div className="book-summary__header">
              <h3>🔍 ตรวจสอบรายละเอียด</h3>
              <p>กรุณาตรวจสอบข้อมูลก่อนยืนยันการจอง</p>
            </div>
            <div className="book-summary__body">
              {[
                { icon: '🏥', key: 'บริการ', val: resolvedService },
                { icon: '📅', key: 'วันที่', val: formData.date },
                { icon: '🕐', key: 'เวลา', val: `${formData.time} น.` },
                { icon: '👤', key: 'ชื่อเจ้าของ', val: formData.owner },
                { icon: '📞', key: 'เบอร์โทร', val: formData.phone },
                { icon: '🐾', key: 'ชื่อสัตว์', val: formData.petName },
                { icon: '🏷️', key: 'ประเภท', val: resolvedPetType },
                ...(formData.notes ? [{ icon: '📝', key: 'หมายเหตุ', val: formData.notes }] : []),
              ].map(row => (
                <div key={row.key} className="book-summary__row">
                  <span className="book-summary__key">{row.icon} {row.key}</span>
                  <span className="book-summary__val">{row.val}</span>
                </div>
              ))}
            </div>
            <div className="book-actions">
              <button className="book-btn-secondary" onClick={() => setStep(1)}>← แก้ไข</button>
              <button className="book-btn-primary" onClick={handleConfirm} disabled={submitting}>
                {submitting ? 'กำลังบันทึก...' : '✅ ยืนยันการจอง'}
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 3: Success ── */}
        {step === 3 && (
          <div className="book-success">
            <div className="book-success__icon">🎉</div>
            <h3 className="book-success__title">จองนัดหมายสำเร็จ!</h3>
            <p className="book-success__sub">
              ทีมงานจะติดต่อกลับเพื่อยืนยันรายละเอียดภายใน 24 ชั่วโมง
              {sessionUser && ' • ระบบส่ง email ยืนยันแล้ว'}
            </p>
            <div className="book-success__actions">
              {sessionUser ? (
                <button className="book-btn-primary" style={{ minWidth: 180 }}
                  onClick={() => router.push('/my-appointments')}>
                  ดูนัดหมายของฉัน →
                </button>
              ) : (
                <button className="book-btn-primary" style={{ minWidth: 180 }}
                  onClick={() => router.push('/')}>
                  กลับหน้าหลัก
                </button>
              )}
              <button className="book-btn-secondary"
                onClick={() => { setStep(1); setFormData(prev => ({ ...prev, service: '', date: '', time: '', petName: '', petType: '', notes: '' })); }}>
                จองนัดใหม่
              </button>
            </div>
          </div>
        )}

      </div>
    </main>
  );
}