import React from 'react';

interface AboutUsForm {
  section: string;
  title: string;
  category: string;
  content: string;
  imageUrl: string;
  published: boolean;
  sortOrder: number;
}

interface AboutUsModalProps {
  isOpen: boolean;
  isNew: boolean;
  form: AboutUsForm;
  setForm: (form: AboutUsForm) => void;
  onSave: (e: React.FormEvent) => void;
  onClose: () => void;
  isSaving: boolean;
  sections: { value: string; label: string }[];
  lang?: string;
}

export default function AboutUsModal({
  isOpen,
  isNew,
  form,
  setForm,
  onSave,
  onClose,
  isSaving,
  sections,
  lang = 'th',
}: AboutUsModalProps) {
  if (!isOpen) return null;

  return (
    <div className="appt-modal-overlay" onClick={onClose}>
      <form className="appt-modal" onSubmit={onSave} onClick={(e) => e.stopPropagation()} style={{ maxWidth: 600 }}>
        <div className="appt-modal__header">
          <h2 className="appt-modal__title">{isNew ? (lang === 'th' ? '➕ เพิ่มเนื้อหา About Us' : '➕ Add About Us Content') : (lang === 'th' ? '✏️ แก้ไขเนื้อหา About Us' : '✏️ Edit About Us Content')}</h2>
          <button type="button" className="appt-modal__close" onClick={onClose}>✕</button>
        </div>
        <div className="appt-modal__row">
          <div className="appt-modal__field">
            <label className="appt-modal__label">Section *</label>
            <select required className="appt-modal__input" value={form.section} onChange={(e) => setForm({ ...form, section: e.target.value })}>
              {sections.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
          </div>
          <div className="appt-modal__field">
            <label className="appt-modal__label">{lang === 'th' ? 'สถานะ' : 'Status'}</label>
            <select className="appt-modal__input" value={form.published ? 'published' : 'draft'} onChange={(e) => setForm({ ...form, published: e.target.value === 'published' })}>
              <option value="draft">📝 Draft</option>
              <option value="published">✅ Published</option>
            </select>
          </div>
        </div>
        <div className="appt-modal__field">
          <label className="appt-modal__label">{lang === 'th' ? 'ชื่อหัวข้อ' : 'Title'}</label>
          <input required className="appt-modal__input" placeholder={lang === 'th' ? 'เช่น ประวัติคลินิก' : 'e.g. Clinic History'} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
        </div>
        <div className="appt-modal__row">
          <div className="appt-modal__field">
            <label className="appt-modal__label">Image URL (Optional)</label>
            <input className="appt-modal__input" placeholder="https://example.com/image.jpg" value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} />
          </div>
          <div className="appt-modal__field">
            <label className="appt-modal__label">{lang === 'th' ? 'ลำดับการแสดง' : 'Sort Order'}</label>
            <input type="number" className="appt-modal__input" min={0} value={form.sortOrder} onChange={(e) => setForm({ ...form, sortOrder: Number(e.target.value) })} />
          </div>
        </div>
        <div className="appt-modal__field">
          <label className="appt-modal__label">{lang === 'th' ? 'เนื้อหา *' : 'Content *'}</label>
          <textarea required className="appt-modal__input appt-modal__textarea" placeholder={lang === 'th' ? 'เขียนเนื้อหาที่นี่...' : 'Write content here...'} rows={6} value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} />
        </div>
        <div className="appt-modal__footer">
          <button type="button" className="admin-btn admin-btn-secondary" onClick={onClose}>{lang === 'th' ? 'ยกเลิก' : 'Cancel'}</button>
          <button type="submit" className="admin-btn admin-btn-primary" disabled={isSaving}>{isSaving ? (lang === 'th' ? '⏳ กำลังบันทึก...' : '⏳ Saving...') : (lang === 'th' ? '💾 บันทึก' : '💾 Save')}</button>
        </div>
      </form>
    </div>
  );
}
