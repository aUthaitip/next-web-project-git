import React, { useRef, useState, useEffect } from 'react';

export interface ShopAd {
  id?: number;
  titleTh: string;
  titleEn: string;
  imageUrl: string;
  linkUrl?: string;
  category: string;
  isActive: boolean;
  sortOrder: number;
}

interface ShopAdModalProps {
  selected: ShopAd;
  setSelected: (ad: ShopAd | null) => void;
  onSave: (ad: ShopAd) => Promise<void>;
  lang?: string;
}

export default function ShopAdModal({ selected, setSelected, onSave, lang = 'th' }: ShopAdModalProps) {
  const [formData, setFormData] = useState<ShopAd>({ ...selected, category: selected.category || 'all' });
  const [imagePreview, setImagePreview] = useState<string>('');
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setImagePreview(selected.imageUrl || '');
    setFormData(selected);
  }, [selected]);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      setUploadError('รองรับเฉพาะ JPG, PNG, WebP, GIF เท่านั้น');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setUploadError('ขนาดรูปต้องไม่เกิน 5MB');
      return;
    }

    setUploadError('');
    const localUrl = URL.createObjectURL(file);
    setImagePreview(localUrl);
    setUploading(true);

    try {
      const form = new FormData();
      form.append('file', file);
      const res = await fetch('/api/upload', { method: 'POST', body: form });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Upload failed');
      const uploadedUrl = data.url || data.imageUrl || data.path;
      setImagePreview(uploadedUrl);
      setFormData(prev => ({ ...prev, imageUrl: uploadedUrl }));
    } catch (err: any) {
      setUploadError(err.message || 'อัพโหลดไม่สำเร็จ กรุณาลองใหม่');
      setImagePreview(selected.imageUrl || '');
    } finally {
      setUploading(false);
    }
  };

  const removeImage = () => {
    setImagePreview('');
    setFormData(prev => ({ ...prev, imageUrl: '' }));
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.imageUrl) {
      alert('กรุณาอัพโหลดรูปภาพโฆษณา');
      return;
    }
    await onSave(formData);
  };

  return (
    <div className="doctors-modal-overlay" onClick={() => setSelected(null)}>
      <form className="doctors-modal" onSubmit={handleSubmit} onClick={(e) => e.stopPropagation()}>
        <div className="doctors-modal__header">
          <div>
            <div className="doctors-modal__title">
              {formData.id ? (lang === 'th' ? '✏️ แก้ไขแบนเนอร์ / Edit Banner' : '✏️ Edit Banner') : (lang === 'th' ? '➕ เพิ่มแบนเนอร์ใหม่ / Add New Banner' : '➕ Add New Banner')}
            </div>
            <div className="doctors-modal__subtitle">{lang === 'th' ? 'กรอกข้อมูลและอัพโหลดรูปภาพ' : 'Fill in the details and upload an image'}</div>
          </div>
          <button type="button" className="doctors-modal__close" onClick={() => setSelected(null)}>✕</button>
        </div>

        <div className="doctors-modal__fields">
          <div style={{ gridColumn: '1 / -1' }}>
            <label className="doctors-modal__label">📷 {lang === 'th' ? 'รูปภาพแบนเนอร์ (แนะนำสัดส่วน 16:9) *' : 'Banner Image (Recommended 16:9) *'}</label>
            <div style={{ display: 'flex', gap: 20, padding: 16, background: '#f8fafc', borderRadius: 12, border: '1px solid #e2e8f0' }}>
              <div style={{
                width: 200, height: 112, borderRadius: 12,
                background: imagePreview ? 'transparent' : 'linear-gradient(135deg,#e0f2fe)',
                border: '2px dashed #cbd5e1', display: 'flex', alignItems: 'center', justifyContent: 'center',
                overflow: 'hidden', flexShrink: 0, position: 'relative'
              }}>
                {imagePreview ? (
                  <>
                    <img src={imagePreview} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    {uploading && (
                      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <div style={{ width: 28, height: 28, border: '3px solid rgba(255,255,255,0.4)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                      </div>
                    )}
                  </>
                ) : <span style={{ fontSize: 36 }}>🖼️</span>}
              </div>

              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 8 }}>
                  <button type="button" onClick={() => fileInputRef.current?.click()} disabled={uploading}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px',
                      background: uploading ? '' : 'linear-gradient(135deg,#0d9488',
                      color: uploading ? '#94a3b8' : '#fff', border: 'none', borderRadius: 8,
                      fontSize: 13, fontWeight: 600, cursor: uploading ? 'not-allowed' : 'pointer'
                    }}>
                    {uploading ? (lang === 'th' ? 'กำลังอัพโหลด...' : 'Uploading...') : (imagePreview ? (lang === 'th' ? 'เปลี่ยนรูปภาพ' : 'Change Image') : (lang === 'th' ? 'อัพโหลดรูปภาพ' : 'Upload Image'))}
                  </button>
                  {imagePreview && !uploading && (
                    <button type="button" onClick={removeImage}
                      style={{ padding: '8px 14px', background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                      🗑️ {lang === 'th' ? 'ลบรูป' : 'Remove Image'}
                    </button>
                  )}
                </div>
                <p style={{ fontSize: 12, color: '#94a3b8', margin: 0 }}>{lang === 'th' ? 'รองรับ JPG, PNG, WebP · ขนาดสูงสุด 5MB' : 'Supports JPG, PNG, WebP · Max size 5MB'}</p>
                {uploadError && <p style={{ fontSize: 12, color: '#dc2626', marginTop: 4, fontWeight: 500 }}>⚠️ {uploadError}</p>}
              </div>
            </div>
            <input ref={fileInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImageChange} />
          </div>

          <div>
            <label className="doctors-modal__label">ชื่อแบนเนอร์ (ภาษาไทย) *</label>
            <input required className="doctors-modal__input" placeholder="เช่น โปรโมชั่นอาหารสุนัข" value={formData.titleTh} onChange={(e) => setFormData({ ...formData, titleTh: e.target.value })} />
          </div>

          <div>
            <label className="doctors-modal__label">Banner Title (English) *</label>
            <input required className="doctors-modal__input" placeholder="e.g. Dog Food Promotion" value={formData.titleEn} onChange={(e) => setFormData({ ...formData, titleEn: e.target.value })} />
          </div>

          <div>
            <label className="doctors-modal__label">{lang === 'th' ? 'หมวดหมู่ของแบนเนอร์' : 'Banner Category'}</label>
            <select
              className="doctors-modal__input"
              value={formData.category || 'all'}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              style={{ backgroundColor: 'white' }}
            >
              <option value="all">แสดงทั้งหมด (All Categories)</option>
              <option value="food">อาหารและขนม (Food & Treats)</option>
              <option value="grooming">กรูมมิ่ง & แชมพู (Grooming & Shampoo)</option>
              <option value="health">วิตามินและยา (Health & Vitamins)</option>
              <option value="toys">ของเล่นสัตว์เลี้ยง (Toys & Accessories)</option>
            </select>
          </div>

          <div>
            <label className="doctors-modal__label">{lang === 'th' ? 'ลิงก์ปลายทาง (Link URL)' : 'Target Link (URL)'}</label>
            <input className="doctors-modal__input" placeholder="https://..." value={formData.linkUrl || ''} onChange={(e) => setFormData({ ...formData, linkUrl: e.target.value })} />
          </div>

          <div>
            <label className="doctors-modal__label">{lang === 'th' ? 'ลำดับการแสดงผล (ตัวเลข)' : 'Sort Order (Number)'}</label>
            <input type="number" className="doctors-modal__input" value={formData.sortOrder} onChange={(e) => setFormData({ ...formData, sortOrder: parseInt(e.target.value) || 0 })} />
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 30 }}>
            <input type="checkbox" id="isActive" checked={formData.isActive} onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })} style={{ width: 20, height: 20 }} />
            <label htmlFor="isActive" style={{ fontWeight: 'bold', cursor: 'pointer' }}>{lang === 'th' ? 'เปิดแสดงผล' : 'Active'}</label>
          </div>
        </div>

        <div className="doctors-modal__footer">
          <button type="button" onClick={() => setSelected(null)} className="admin-btn admin-btn-secondary">{lang === 'th' ? 'ยกเลิก' : 'Cancel'}</button>
          <button type="submit" disabled={uploading || !imagePreview} className="admin-btn admin-btn-primary" style={{ opacity: uploading || !imagePreview ? 0.6 : 1 }}>
            {uploading ? (lang === 'th' ? '⏳ กำลังอัพโหลด...' : '⏳ Uploading...') : (lang === 'th' ? '💾 บันทึกข้อมูล' : '💾 Save')}
          </button>
        </div>
      </form>
    </div>
  );
}
