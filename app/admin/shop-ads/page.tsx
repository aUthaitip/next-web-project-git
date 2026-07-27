'use client';

import { useEffect, useState } from 'react';
import HideHeader from '@/components/layout/HideHeader';
import HideFooter from '@/components/layout/HideFooter';
import AdminSidebar from '@/components/admin/AdminSidebar';
import ShopAdModal, { ShopAd } from '@/components/admin/ShopAdModal';
import { useLanguage } from '@/context/LanguageContext';

export default function ShopAdsAdminPage() {
  const { lang, toggleLanguage } = useLanguage();
  const [ads, setAds] = useState<ShopAd[]>([]);
  const [selected, setSelected] = useState<ShopAd | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchAds(); }, []);

  const fetchAds = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/shop-ads');
      if (!res.ok) { setAds([]); return; }
      const data = await res.json();
      if (Array.isArray(data)) setAds(data as ShopAd[]);
      else setAds([]);
    } catch (error) {
      console.error('fetchAds error', error);
      setAds([]);
    } finally {
      setLoading(false);
    }
  };

  const deleteAd = async (id: number) => {
    if (!confirm('ยืนยันการลบโฆษณานี้?')) return;
    await fetch(`/api/shop-ads/${id}`, { method: 'DELETE' });
    fetchAds();
  };

  const saveAd = async (ad: ShopAd) => {
    const body = JSON.stringify({
      titleTh: ad.titleTh,
      titleEn: ad.titleEn,
      imageUrl: ad.imageUrl,
      linkUrl: ad.linkUrl,
      category: ad.category,
      isActive: ad.isActive,
      sortOrder: Number(ad.sortOrder),
    });

    if (ad.id) {
      await fetch(`/api/shop-ads/${ad.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body });
    } else {
      await fetch('/api/shop-ads', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body });
    }
    setSelected(null);
    fetchAds();
  };

  const toggleActive = async (ad: ShopAd) => {
    if (!ad.id) return;
    await fetch(`/api/shop-ads/${ad.id}`, { 
      method: 'PUT', 
      headers: { 'Content-Type': 'application/json' }, 
      body: JSON.stringify({ isActive: !ad.isActive }) 
    });
    fetchAds();
  };

  const filteredAds = ads.filter((ad) =>
    ad.titleTh.toLowerCase().includes(searchTerm.toLowerCase()) || 
    ad.titleEn.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="admin-layout">
      <HideHeader />

      <div className="admin-container-new">
        <AdminSidebar />

        {/* ===== MAIN CONTENT ===== */}
        <div className="admin-content-new">

          <div className="admin-header-new">
            <div>
              <h1>{lang === 'th' ? 'จัดการโฆษณา (Shop Ads)' : 'Shop Advertisements'}</h1>
              <p>{lang === 'th' ? `จัดการแบนเนอร์โฆษณาสินค้า · ทั้งหมด ${ads.length} รายการ` : `Manage store banners · Total ${ads.length} items`}</p>
            </div>
            <div style={{ display: 'flex', gap: 12 }}>
              <button onClick={toggleLanguage} className="admin-btn admin-btn-secondary" style={{ padding: '6px 12px' }}>
                {lang === 'th' ? 'EN' : 'TH'}
              </button>
              <button onClick={() => setSelected({ titleTh: '', titleEn: '', imageUrl: '', linkUrl: '', category: 'all', isActive: true, sortOrder: 0 })} className="admin-btn admin-btn-primary">
                + {lang === 'th' ? 'เพิ่มแบนเนอร์ใหม่' : 'New Banner'}
              </button>
            </div>
          </div>

          <div className="stats-grid-new">
            <div className="stat-card-new stat-blue">
              <div className="stat-top"><div className="stat-label-text">{lang === 'th' ? 'ทั้งหมด' : 'Total'}</div><div className="stat-icon-new">🖼️</div></div>
              <div className="stat-value-new">{ads.length}</div>
            </div>
            <div className="stat-card-new stat-green">
              <div className="stat-top"><div className="stat-label-text">{lang === 'th' ? 'เปิดใช้งานอยู่' : 'Active'}</div><div className="stat-icon-new">✅</div></div>
              <div className="stat-value-new">{ads.filter(a => a.isActive).length}</div>
            </div>
          </div>

          <div className="stat-card-new stat-blue">
            <div className="search-box-new">
              <span className="search-icon-new">🔍</span>
              <input
                type="text"
                placeholder={lang === 'th' ? "ค้นหาชื่อแบนเนอร์..." : "Search banners..."}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input-new"
              />
            </div>
          </div>

          {loading ? (
            <div className="doctors-grid">
              {[1, 2, 3].map((i) => <div key={i} className="doctor-skeleton" />)}
            </div>
          ) : filteredAds.length > 0 ? (
            <div className="doctors-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
              {filteredAds.map((ad: ShopAd) => {
                const categoryLabels: Record<string, string> = {
                  'all': 'ทั้งหมด', 'food': 'อาหารและขนม', 'grooming': 'กรูมมิ่ง & แชมพู', 'health': 'วิตามินและยา', 'toys': 'ของเล่นสัตว์เลี้ยง'
                };
                const catLabel = categoryLabels[ad.category] || ad.category;
                return (
                  <div key={ad.id} style={{
                    background: 'white', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
                    border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column'
                  }}>
                    <div style={{ position: 'relative', paddingBottom: '45%' }}>
                      <img src={ad.imageUrl} alt={ad.titleTh} style={{ position: 'absolute', width: '100%', height: '100%', objectFit: 'cover' }} />
                      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.4), transparent)' }} />
                      
                      <div style={{ position: 'absolute', top: 12, left: 12, display: 'flex', gap: 8 }}>
                        {ad.isActive ? (
                          <span style={{ background: '#10b981', color: 'white', padding: '4px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 700 }}>● {lang === 'th' ? 'เปิดใช้งาน' : 'Active'}</span>
                        ) : (
                          <span style={{ background: '#ef4444', color: 'white', padding: '4px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 700 }}>● {lang === 'th' ? 'ปิดใช้งาน' : 'Inactive'}</span>
                        )}
                        <span style={{ background: 'rgba(255,255,255,0.9)', color: '#0f172a', padding: '4px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 700 }}>
                          📁 {catLabel}
                        </span>
                      </div>
                    </div>
                    <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                      <div style={{ fontSize: '1.15rem', fontWeight: 700, color: '#1e293b', marginBottom: '4px' }}>{ad.titleTh}</div>
                      <div style={{ fontSize: '0.9rem', color: '#64748b', marginBottom: '8px' }}>{ad.titleEn}</div>
                      <div style={{ fontSize: '0.85rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: 6, marginBottom: '6px' }}>
                        <span>🔗</span>
                        <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '200px' }}>
                          {ad.linkUrl || (lang === 'th' ? 'ไม่มีลิงก์' : 'No link')}
                        </span>
                      </div>
                      <div style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '20px' }}>{lang === 'th' ? 'ลำดับการแสดงผล' : 'Sort Order'}: {ad.sortOrder}</div>
                      <div style={{ display: 'flex', gap: '8px', marginTop: 'auto' }}>
                        <button onClick={() => toggleActive(ad)} className="admin-btn admin-btn-secondary" style={{ flex: 1, padding: '8px', fontSize: '0.85rem' }}>
                          {ad.isActive ? (lang === 'th' ? 'ปิดใช้งาน' : 'Deactivate') : (lang === 'th' ? 'เปิดใช้งาน' : 'Activate')}
                        </button>
                        <button onClick={() => setSelected(ad)} className="admin-btn admin-btn-primary" style={{ flex: 1, padding: '8px', fontSize: '0.85rem' }}>✏️ {lang === 'th' ? 'แก้ไข' : 'Edit'}</button>
                        <button onClick={() => deleteAd(ad.id!)} style={{ background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: '8px', padding: '8px 12px', cursor: 'pointer', fontWeight: 600 }}>🗑️</button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="stat-card-new" style={{ textAlign: 'center', padding: '4rem' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🖼️</div>
              <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                {searchTerm ? (lang === 'th' ? 'ไม่พบโฆษณาที่ค้นหา' : 'No ads found') : (lang === 'th' ? 'ยังไม่มีข้อมูลโฆษณา' : 'No ads data')}
              </p>
              <button onClick={() => setSelected({ titleTh: '', titleEn: '', imageUrl: '', linkUrl: '', category: 'all', isActive: true, sortOrder: 0 })} className="admin-btn admin-btn-primary">
                + {lang === 'th' ? 'เพิ่มแบนเนอร์ใหม่' : 'New Banner'}
              </button>
            </div>
          )}

        </div>
      </div>

      <HideFooter />

      {/* ===== MODAL ===== */}
      {selected && (
        <ShopAdModal 
          selected={selected} 
          setSelected={setSelected} 
          onSave={saveAd}
          lang={lang}
        />
      )}
    </div>
  );
}
