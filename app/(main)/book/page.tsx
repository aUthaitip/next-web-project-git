'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';

const TIME_SLOTS = [
  '09:00','09:30','10:00','10:30','11:00','11:30',
  '13:00','13:30','14:00','14:30','15:00','15:30','16:00',
];

export default function BookPage() {
  const { t } = useLanguage();
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
        alert(t('book.bookingError'));
      }
    } catch { alert(t('book.bookingError')); }
    finally { setSubmitting(false); }
  };

  const today = new Date().toISOString().split('T')[0];

  const SERVICES = [
    { label: t('book.svc1'), value: 'ตรวจสุขภาพทั่วไป' },
    { label: t('book.svc2'), value: 'ฉีดวัคซีน' },
    { label: t('book.svc3'), value: 'ทำหมัน' },
    { label: t('book.svc4'), value: 'ทันตกรรม' },
    { label: t('book.svc5'), value: 'อื่นๆ' },
  ];

  const PET_TYPES = [
    { label: t('book.petDog'), value: 'สุนัข' },
    { label: t('book.petCat'), value: 'แมว' },
    { label: t('book.petRabbit'), value: 'กระต่าย' },
    { label: t('book.petBird'), value: 'นก' },
    { label: t('book.petOther'), value: 'อื่นๆ' },
  ];

  const displayService = formData.service === 'อื่นๆ' ? formData.otherService : SERVICES.find(s => s.value === formData.service)?.label || formData.service;
  const displayPetType = formData.petType === 'อื่นๆ' ? formData.otherPetType : PET_TYPES.find(p => p.value === formData.petType)?.label || formData.petType;

  return (
    <main className="book-page page-animate">
      <div className="book-container">

        {/* Hero */}
        <div className="book-hero">
          <h2>{t('book.title')}</h2>
          <p>{t('book.sub')}</p>
        </div>

        {/* Steps */}
        {step < 3 && (
          <div className="book-steps">
            <div className="book-step">
              <div className={`book-step__circle ${step >= 1 ? 'active' : ''}`}>1</div>
              <span className={`book-step__label ${step === 1 ? 'active' : ''}`}>{t('book.step1')}</span>
            </div>
            <div className={`book-step__line ${step > 1 ? 'done' : ''}`} />
            <div className="book-step">
              <div className={`book-step__circle ${step >= 2 ? 'active' : ''}`}>2</div>
              <span className={`book-step__label ${step === 2 ? 'active' : ''}`}>{t('book.step2')}</span>
            </div>
          </div>
        )}

        {/* ── STEP 1 ── */}
        {step === 1 && (
          <div className="book-card">
            {/* บริการ */}
            <div className="book-section">
              <div className="book-section__title">{t('book.serviceSectionTitle')}</div>
              <div className="book-form-row">
                <div>
                  <label className="book-label">{t('book.serviceLabel')}</label>
                  <select className="book-input" value={formData.service} onChange={e => set('service', e.target.value)} required>
                    <option value="">{t('book.serviceSelect')}</option>
                    {SERVICES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                  </select>
                </div>
                {formData.service === 'อื่นๆ' && (
                  <div>
                    <label className="book-label">{t('book.specifyLabel')}</label>
                    <input className="book-input" type="text" value={formData.otherService}
                      onChange={e => set('otherService', e.target.value)} placeholder={t('book.specifyPlaceholder')} required />
                  </div>
                )}
              </div>
            </div>

            {/* วันที่ */}
            <div className="book-section">
              <div className="book-section__title">{t('book.dateSectionTitle')}</div>
              <div className="book-form-row">
                <div>
                  <label className="book-label">{t('book.dateLabel')}</label>
                  <input className="book-input" type="date" value={formData.date}
                    onChange={e => set('date', e.target.value)} min={today} required />
                </div>
              </div>
              <div style={{ marginTop: 16 }}>
                <label className="book-label">{t('book.timeLabel')}</label>
                <div className="book-timeslots">
                  {TIME_SLOTS.map(slot => (
                    <button key={slot} type="button"
                      className={`book-timeslot ${formData.time === slot ? 'selected' : ''}`}
                      onClick={() => set('time', slot)}>
                      {slot}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* เจ้าของ */}
            <div className="book-section">
              <div className="book-section__title">{t('book.ownerSectionTitle')}</div>
              <div className="book-form-row">
                <div>
                  <label className="book-label">{t('book.ownerLabel')}</label>
                  <input className="book-input" type="text" value={formData.owner}
                    onChange={e => set('owner', e.target.value)} placeholder={t('book.ownerPlaceholder')} required />
                </div>
                <div>
                  <label className="book-label">{t('book.phoneLabel')}</label>
                  <input className="book-input" type="tel" value={formData.phone}
                    onChange={e => set('phone', e.target.value)} placeholder="08X-XXX-XXXX" required />
                </div>
              </div>
            </div>

            {/* สัตว์เลี้ยง */}
            <div className="book-section">
              <div className="book-section__title">{t('book.petSectionTitle')}</div>
              <div className="book-form-row" style={{ marginBottom: 16 }}>
                <div>
                  <label className="book-label">{t('book.petNameLabel')}</label>
                  <input className="book-input" type="text" value={formData.petName}
                    onChange={e => set('petName', e.target.value)} placeholder={t('book.petNamePlaceholder')} required />
                </div>
              </div>
              <div>
                <label className="book-label">{t('book.petTypeLabel')}</label>
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
                    placeholder={t('book.otherPetPlaceholder')} required />
                )}
              </div>
              <div style={{ marginTop: 16 }}>
                <label className="book-label">{t('book.notesLabel')}</label>
                <textarea className="book-input" rows={3} value={formData.notes}
                  onChange={e => set('notes', e.target.value)}
                  placeholder={t('book.notesPlaceholder')}
                  style={{ resize: 'vertical' }} />
              </div>
            </div>

            <div className="book-actions">
              <Link href="/appointment" className="book-btn-secondary" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {t('book.cancelBtn')}
              </Link>
              <button className="book-btn-primary" onClick={() => isStep1Valid && setStep(2)} disabled={!isStep1Valid}>
                {t('book.nextBtn')}
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 2: Summary ── */}
        {step === 2 && (
          <div className="book-summary">
            <div className="book-summary__header">
              <h3>{t('book.summaryTitle')}</h3>
              <p>{t('book.summarySubtitle')}</p>
            </div>
            <div className="book-summary__body">
              {[
                { icon: '🏥', key: t('book.summaryService'), val: displayService },
                { icon: '📅', key: t('book.summaryDate'), val: formData.date },
                { icon: '🕐', key: t('book.summaryTime'), val: `${formData.time}` },
                { icon: '👤', key: t('book.summaryOwner'), val: formData.owner },
                { icon: '📞', key: t('book.summaryPhone'), val: formData.phone },
                { icon: '🐾', key: t('book.summaryPet'), val: formData.petName },
                { icon: '🏷️', key: t('book.summaryType'), val: displayPetType },
                ...(formData.notes ? [{ icon: '📝', key: t('book.summaryNotes'), val: formData.notes }] : []),
              ].map(row => (
                <div key={row.key} className="book-summary__row">
                  <span className="book-summary__key">{row.icon} {row.key}</span>
                  <span className="book-summary__val">{row.val}</span>
                </div>
              ))}
            </div>
            <div className="book-actions">
              <button className="book-btn-secondary" onClick={() => setStep(1)}>{t('book.editBtn')}</button>
              <button className="book-btn-primary" onClick={handleConfirm} disabled={submitting}>
                {submitting ? t('book.savingBtn') : t('book.confirmBtn')}
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 3: Success ── */}
        {step === 3 && (
          <div className="book-success">
            <div className="book-success__icon">🎉</div>
            <h3 className="book-success__title">{t('book.successTitle')}</h3>
            <p className="book-success__sub">
              {t('book.successSub')}
              {sessionUser && <> • {t('book.emailSent')}</>}
            </p>
            <div className="book-success__actions">
              {sessionUser ? (
                <button className="book-btn-primary" style={{ minWidth: 180 }}
                  onClick={() => router.push('/my-appointments')}>
                  {t('book.viewApptsBtn')}
                </button>
              ) : (
                <button className="book-btn-primary" style={{ minWidth: 180 }}
                  onClick={() => router.push('/')}>
                  {t('book.backHomeBtn')}
                </button>
              )}
              <button className="book-btn-secondary"
                onClick={() => { setStep(1); setFormData(prev => ({ ...prev, service: '', date: '', time: '', petName: '', petType: '', notes: '' })); }}>
                {t('book.bookNewBtn')}
              </button>
            </div>
          </div>
        )}

      </div>
    </main>
  );
}