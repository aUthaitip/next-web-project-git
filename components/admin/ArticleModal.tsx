import React from 'react';

interface ArticleForm {
  title: string;
  category: string;
  content: string;
  imageUrl: string;
  published: boolean;
}

interface ArticleModalProps {
  isOpen: boolean;
  isNew: boolean;
  form: ArticleForm;
  setForm: (form: ArticleForm) => void;
  onSave: (e: React.FormEvent) => void;
  onClose: () => void;
  isSaving: boolean;
  categories: string[];
  lang?: string;
}

export default function ArticleModal({
  isOpen,
  isNew,
  form,
  setForm,
  onSave,
  onClose,
  isSaving,
  categories,
  lang = 'th',
}: ArticleModalProps) {
  if (!isOpen) return null;

  return (
    <div className="appt-modal-overlay" onClick={onClose}>
      <form className="appt-modal" onSubmit={onSave} onClick={(e) => e.stopPropagation()} style={{ maxWidth: 600 }}>
        <div className="appt-modal__header">
          <h2 className="appt-modal__title">{isNew ? (lang === 'th' ? '➕ เพิ่มบทความใหม่' : '➕ Add New Article') : (lang === 'th' ? '✏️ แก้ไขบทความ' : '✏️ Edit Article')}</h2>
          <button type="button" className="appt-modal__close" onClick={onClose}>✕</button>
        </div>
        <div className="appt-modal__field">
          <label className="appt-modal__label">{lang === 'th' ? 'ชื่อบทความ *' : 'Article Title *'}</label>
          <input required className="appt-modal__input" placeholder={lang === 'th' ? 'เช่น วิธีดูแลสุขภาพสัตว์เลี้ยงในหน้าร้อน' : 'e.g. How to take care of your pet in summer'} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
        </div>
        <div className="appt-modal__row">
          <div className="appt-modal__field">
            <label className="appt-modal__label">{lang === 'th' ? 'หมวดหมู่' : 'Category'}</label>
            <select className="appt-modal__input" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
              {categories.map((c) => <option key={c} value={c}>{c}</option>)}
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
          <label className="appt-modal__label">Image URL (Optional)</label>
          <input className="appt-modal__input" placeholder="https://example.com/image.jpg" value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} />
        </div>
        <div className="appt-modal__field">
          <label className="appt-modal__label">{lang === 'th' ? 'เนื้อหา *' : 'Content *'}</label>
          <textarea required className="appt-modal__input appt-modal__textarea" placeholder={lang === 'th' ? 'เขียนเนื้อหาบทความที่นี่...' : 'Write article content here...'} rows={6} value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} />
        </div>
        <div className="appt-modal__footer">
          <button type="button" className="admin-btn admin-btn-secondary" onClick={onClose}>{lang === 'th' ? 'ยกเลิก' : 'Cancel'}</button>
          <button type="submit" className="admin-btn admin-btn-primary" disabled={isSaving}>{isSaving ? (lang === 'th' ? '⏳ กำลังบันทึก...' : '⏳ Saving...') : (lang === 'th' ? '💾 บันทึก' : '💾 Save')}</button>
        </div>
      </form>
    </div>
  );
}
