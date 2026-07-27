'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Search, ShoppingBag, MessageSquare, Truck, ShieldCheck, HelpCircle, Star, X, Heart } from 'lucide-react';

interface Product {
  id: number;
  nameTh: string;
  nameEn: string;
  category: string;
  price: number;
  originalPrice?: number;
  tagTh?: string;
  tagEn?: string;
  image: string;
  rating: number;
  reviewsCount: number;
  descTh: string;
  descEn: string;
}

export default function ShopCatalog() {
  const { t, lang } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [ads, setAds] = useState<any[]>([]);


  
  useEffect(() => {
    fetch('/api/shop-ads')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setAds(data.filter((ad: any) => ad.isActive));
        }
      })
      .catch(err => console.error('Error fetching ads', err));
  }, []);

  const products: Product[] = [];

  const categories = [
    { id: 'all', labelTh: 'ทั้งหมด', labelEn: 'All Products' },
    { id: 'food', labelTh: 'อาหารและขนม', labelEn: 'Food & Treats' },
    { id: 'grooming', labelTh: 'กรูมมิ่ง & แชมพู', labelEn: 'Grooming & Shampoo' },
    { id: 'health', labelTh: 'วิตามินและยา', labelEn: 'Health & Vitamins' },
    { id: 'toys', labelTh: 'ของเล่นสัตว์เลี้ยง', labelEn: 'Toys & Accessories' }
  ];

  const filteredAds = ads.filter(ad => {
    const matchesCategory = selectedCategory === 'all' || ad.category === 'all' || ad.category === selectedCategory;
    const adTitle = lang === 'th' ? ad.titleTh : ad.titleEn;
    const matchesSearch = adTitle?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="container" style={{ maxWidth: 1200, margin: '0 auto' }}>
      
      {/* Banner Section */}
      <div style={{
        background: 'linear-gradient(135deg, #0d9488, #14b8a6)',
        borderRadius: 20,
        padding: '48px 32px',
        color: 'white',
        position: 'relative',
        overflow: 'hidden',
        marginBottom: 40,
        boxShadow: '0 10px 30px rgba(13, 148, 136, 0.15)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 24,
      }}>
        <div style={{ position: 'absolute', width: 250, height: 250, borderRadius: '50%', background: 'rgba(255,255,255,0.06)', top: -100, right: -50, pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', width: 180, height: 180, borderRadius: '50%', background: 'rgba(255,255,255,0.08)', bottom: -80, left: -20, pointerEvents: 'none' }} />

        <div style={{ maxWidth: 600, zIndex: 1 }}>
          <span style={{
            background: 'rgba(255,255,255,0.2)',
            color: 'white',
            fontSize: '0.8rem',
            fontWeight: 700,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            padding: '6px 16px',
            borderRadius: 50,
            display: 'inline-block',
            marginBottom: 16
          }}>
            {t('shop.label')}
          </span>
          <h1 style={{ margin: 0, fontSize: 36, fontWeight: 700, lineHeight: 1.2 }}>{t('shop.title')}</h1>
          <p style={{ margin: '8px 0 0', color: '#ccfbf1', fontSize: 16, fontWeight: 500 }}>{t('shop.subtitle')}</p>
          <p style={{ margin: '16px 0 0', color: 'white', opacity: 0.9, fontSize: 14, lineHeight: 1.6 }}>
            {t('shop.desc1')} {t('shop.desc2')}
          </p>
        </div>

        <div style={{
          background: 'white',
          borderRadius: 16,
          padding: 16,
          boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
          zIndex: 1,
          textAlign: 'center',
          minWidth: 200,
          flexShrink: 0
        }}>
          <img
            src="/assets/line.png"
            alt={t('shop.qrAlt')}
            style={{ width: 120, height: 120, objectFit: 'contain', margin: '0 auto 8px' }}
          />
          <p style={{ margin: 0, color: '#374151', fontSize: 12, fontWeight: 700 }}>{t('shop.scanText')}</p>
        </div>
      </div>

      {/* Search and Main Content Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: 32 }} className="shop-layout-grid">
        
        {/* Sidebar */}
        <div>
          {/* Search Input widget */}
          <div style={{
            background: 'white',
            borderRadius: 16,
            padding: 18,
            boxShadow: '0 4px 15px rgba(0,0,0,0.03)',
            border: '1px solid #f1f5f9',
            marginBottom: 24,
          }}>
            <label style={{ display: 'block', marginBottom: 8, fontSize: 14, fontWeight: 700, color: '#374151' }}>
              {lang === 'th' ? 'ค้นหาสินค้า' : 'Search Products'}
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                placeholder={lang === 'th' ? 'พิมพ์ชื่อสินค้า...' : 'Product name...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 14px 10px 38px',
                  borderRadius: 10,
                  border: '1.5px solid #e2e8f0',
                  fontSize: 14,
                  outline: 'none',
                  fontFamily: 'inherit',
                  boxSizing: 'border-box'
                }}
              />
              <Search size={16} color="#94a3b8" style={{ position: 'absolute', top: '50%', left: 12, transform: 'translateY(-50%)' }} />
            </div>
          </div>

          {/* Categories filter */}
          <div style={{
            background: 'white',
            borderRadius: 16,
            padding: 18,
            boxShadow: '0 4px 15px rgba(0,0,0,0.03)',
            border: '1px solid #f1f5f9',
            marginBottom: 24
          }}>
            <h3 style={{ margin: '0 0 12px', fontSize: 15, fontWeight: 700, color: '#1e293b' }}>
              {lang === 'th' ? 'หมวดหมู่สินค้า' : 'Categories'}
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  style={{
                    display: 'block',
                    width: '100%',
                    textAlign: 'left',
                    padding: '10px 12px',
                    borderRadius: 10,
                    border: 'none',
                    background: selectedCategory === cat.id ? '#e0f2fe' : 'transparent',
                    color: selectedCategory === cat.id ? '#0d9488' : '#475569',
                    fontWeight: selectedCategory === cat.id ? 700 : 500,
                    fontSize: 14,
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    fontFamily: 'inherit'
                  }}
                >
                  {lang === 'th' ? cat.labelTh : cat.labelEn}
                </button>
              ))}
            </div>
          </div>

          {/* Store Features widgets */}
          <div style={{
            background: 'white',
            borderRadius: 16,
            padding: 18,
            boxShadow: '0 4px 15px rgba(0,0,0,0.03)',
            border: '1px solid #f1f5f9',
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                <ShieldCheck size={18} color="#0d9488" style={{ marginTop: 2, flexShrink: 0 }} />
                <div>
                  <h4 style={{ margin: 0, fontSize: 13, fontWeight: 700, color: '#334155' }}>{t('shop.feat1')}</h4>
                  <p style={{ margin: '2px 0 0', fontSize: 11.5, color: '#64748b' }}>ปลอดภัย มีคุณภาพสูง</p>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                <MessageSquare size={18} color="#0d9488" style={{ marginTop: 2, flexShrink: 0 }} />
                <div>
                  <h4 style={{ margin: 0, fontSize: 13, fontWeight: 700, color: '#334155' }}>{t('shop.feat2')}</h4>
                  <p style={{ margin: '2px 0 0', fontSize: 11.5, color: '#64748b' }}>แนะนำสินค้าที่ตรงจุด</p>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                <Truck size={18} color="#0d9488" style={{ marginTop: 2, flexShrink: 0 }} />
                <div>
                  <h4 style={{ margin: 0, fontSize: 13, fontWeight: 700, color: '#334155' }}>{t('shop.feat3')}</h4>
                  <p style={{ margin: '2px 0 0', fontSize: 11.5, color: '#64748b' }}>จัดส่งไว ทั่วประเทศไทย</p>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Ads Grid Area */}
        <div>
          
          {filteredAds.length === 0 ? (
            <div style={{
              background: 'white',
              borderRadius: 20,
              padding: '80px 20px',
              textAlign: 'center',
              color: '#64748b',
              border: '1px solid #f1f5f9'
            }}>
              <ShoppingBag size={48} style={{ margin: '0 auto 16px', color: '#94a3b8' }} />
              <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: '#334155' }}>
                {lang === 'th' ? 'ไม่พบข้อมูลที่ตรงกับการค้นหา' : 'No items match your search'}
              </h3>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: 24
            }}>
              {filteredAds.map(ad => (
                <div
                  key={ad.id}
                  style={{
                    background: 'white',
                    borderRadius: 20,
                    boxShadow: '0 10px 30px rgba(0,0,0,0.06)',
                    border: '1px solid #f8fafc',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'relative',
                    transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), boxShadow 0.3s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-8px)';
                    e.currentTarget.style.boxShadow = '0 20px 40px rgba(13, 148, 136, 0.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.06)';
                  }}
                >
                  <div style={{ width: '100%', height: 240, overflow: 'hidden', position: 'relative' }}>
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.4), transparent)', zIndex: 1 }} />
                    <img
                      src={ad.imageUrl}
                      alt={lang === 'th' ? ad.titleTh : ad.titleEn}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>

                  <div style={{ padding: 24, display: 'flex', flexDirection: 'column', flex: 1 }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: '#0d9488', textTransform: 'uppercase', marginBottom: 8 }}>
                      {categories.find(c => c.id === ad.category)?.labelTh || 'โฆษณา'}
                    </span>
                    <h4 style={{
                      margin: 0,
                      fontSize: 18,
                      fontWeight: 800,
                      color: '#1e293b',
                      lineHeight: 1.4,
                    }}>
                      {lang === 'th' ? ad.titleTh : ad.titleEn}
                    </h4>

                    {ad.linkUrl && (
                      <a
                        href={ad.linkUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          marginTop: 24,
                          width: '100%',
                          padding: '12px',
                          background: 'linear-gradient(135deg, #0d9488, #14b8a6)',
                          color: 'white',
                          border: 'none',
                          borderRadius: 12,
                          fontSize: 14,
                          fontWeight: 700,
                          cursor: 'pointer',
                          textDecoration: 'none',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: 8,
                          boxShadow: '0 4px 15px rgba(13, 148, 136, 0.2)'
                        }}
                      >
                        ดูรายละเอียดเพิ่มเติม
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* Info footer banner */}
      <div style={{
        marginTop: 48,
        background: 'white',
        borderRadius: 20,
        padding: 24,
        boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
        border: '1px solid #f1f5f9',
        textAlign: 'center'
      }}>
        <p style={{ margin: 0, color: '#475569', fontSize: 13.5, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, flexWrap: 'wrap' }}>
          <HelpCircle size={18} color="#0d9488" />
          <span>{t('shop.note')}</span>
          <a href="https://lin.ee/LBZXswu" target="_blank" rel="noopener noreferrer" style={{ color: '#0d9488', fontWeight: 700, textDecoration: 'underline' }}>
            {lang === 'th' ? 'พูดคุยทาง LINE Official' : 'Chat via LINE Official'}
          </a>
        </p>
      </div>



    </div>
  );
}
