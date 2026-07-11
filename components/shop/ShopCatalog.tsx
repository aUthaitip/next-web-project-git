'use client';

import { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Search, ShoppingBag, MessageSquare, Truck, ShieldCheck, HelpCircle, Star, X } from 'lucide-react';

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
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const products: Product[] = [
    {
      id: 1,
      nameTh: 'อาหารสุนัข Premium Renal Care (2kg)',
      nameEn: 'Premium Renal Care Dog Kibbles (2kg)',
      category: 'food',
      price: 1250,
      originalPrice: 1450,
      tagTh: 'แนะนำโดยหมอ',
      tagEn: 'Vet Recommended',
      image: 'https://images.unsplash.com/photo-1589722244358-f0ec9c024517?auto=format&fit=crop&q=80&w=400',
      rating: 4.9,
      reviewsCount: 42,
      descTh: 'อาหารประกอบการรักษาโรคไตสำหรับสุนัข สูตรไขมันและโปรตีนควบคุม ช่วยลดภาระการทำงานของไต คัดสรรส่วนผสมเกรดพรีเมียมย่อยง่าย',
      descEn: 'Veterinary diet formulated for dogs with chronic kidney disease. Controlled phosphorus and protein levels help reduce kidney workload. Made with high-quality digestible ingredients.',
    },
    {
      id: 2,
      nameTh: 'แชมพูสูตรออร์แกนิกสูตรผิวบอบบาง (500ml)',
      nameEn: 'Organic Sensitive Skin Shampoo (500ml)',
      category: 'grooming',
      price: 390,
      tagTh: 'ขายดี',
      tagEn: 'Best Seller',
      image: 'https://images.unsplash.com/photo-1516733725897-1aa73b87c8e8?auto=format&fit=crop&q=80&w=400',
      rating: 4.8,
      reviewsCount: 128,
      descTh: 'แชมพูสูตรสมุนไพรออร์แกนิกสำหรับสุนัขและแมวที่มีผิวบอบบางแพ้ง่าย ปราศจากสารพาราเบนและน้ำหอมสังเคราะห์ ช่วยบำรุงเส้นขนให้นุ่มสลวยลดอาการคัน',
      descEn: 'Organic herbal shampoo for dogs and cats with sensitive skin. Paraben-free and synthetic fragrance-free. Nourishes coat, reduces itching, and leaves fur soft and shiny.',
    },
    {
      id: 3,
      nameTh: 'วิตามินบำรุงข้อต่อสัตว์เลี้ยง Joint Care (60 เม็ด)',
      nameEn: 'Pet Joint Care Supplement (60 Tabs)',
      category: 'health',
      price: 790,
      originalPrice: 890,
      tagTh: 'ขายดี',
      tagEn: 'Hot',
      image: 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&q=80&w=400',
      rating: 4.7,
      reviewsCount: 86,
      descTh: 'วิตามินเสริมอาหารบำรุงข้อต่อสำหรับสัตว์เลี้ยงอายุเยอะ หรือสายพันธุ์ที่เสี่ยงต่อโรคข้อเสื่อม มีกลูโคซามีนและคอนดรอยตินช่วยเสริมสร้างน้ำหล่อเลี้ยงข้อต่อ',
      descEn: 'Premium joint support supplement containing Glucosamine and Chondroitin. Formulated for senior pets or breeds prone to hip and joint dysplasia to improve mobility.',
    },
    {
      id: 4,
      nameTh: 'ของเล่นฝึกทักษะ Interactive Treat Dispenser',
      nameEn: 'Interactive Treat Dispenser Toy',
      category: 'toys',
      price: 450,
      image: 'https://images.unsplash.com/photo-1576201836106-db1758fd1c97?auto=format&fit=crop&q=80&w=400',
      rating: 4.6,
      reviewsCount: 37,
      descTh: 'ของเล่นฝึกทักษะและเสริมพัฒนาการสมองสัตว์เลี้ยง ช่วยลดความเครียดและความเบื่อหน่ายจากการอยู่บ้านคนเดียว เพียงใส่อาหารเม็ดหรือขนมด้านใน',
      descEn: 'Educational and brain stimulation toy for pets. Helps relieve anxiety and boredom by rewarding your pet with treats as they roll and play with the dispenser.',
    },
    {
      id: 5,
      nameTh: 'ขนมแมวเลียสูตรบำรุงขนเงางาม (20 ซอง)',
      nameEn: 'Shiny Coat Cat Puree Treats (20 Packs)',
      category: 'food',
      price: 280,
      tagTh: 'ใหม่',
      tagEn: 'New',
      image: 'https://images.unsplash.com/photo-1569591159212-b02ea8a9f239?auto=format&fit=crop&q=80&w=400',
      rating: 4.9,
      reviewsCount: 64,
      descTh: 'ขนมครีมแมวเลียเกรดโฮลิสติก ทำจากปลาทูน่าและแซลมอนแท้ ผสมโอเมก้า 3 และ 6 ช่วยบำรุงเส้นขนให้หนานุ่มและเงางามเป็นพิเศษ',
      descEn: 'Holistic puree cat treat made from real tuna and salmon. Enriched with Omega 3 & 6 to improve coat thickness, reduce shedding, and boost shine.',
    },
    {
      id: 6,
      nameTh: 'วิตามินรวมสำหรับสัตว์เลี้ยงบำรุงภูมิคุ้มกัน (100ml)',
      nameEn: 'Pet Immune Booster Multivitamin (100ml)',
      category: 'health',
      price: 520,
      image: 'https://images.unsplash.com/photo-1628771065518-0d82f1938462?auto=format&fit=crop&q=80&w=400',
      rating: 4.8,
      reviewsCount: 51,
      descTh: 'วิตามินรวมชนิดน้ำสำหรับทานง่าย ช่วยกระตุ้นระบบภูมิคุ้มกันของสัตว์เลี้ยง ป้องกันการเจ็บป่วย ฟื้นฟูร่างกายหลังการผ่าตัดหรือเจ็บป่วย',
      descEn: 'Liquid multivitamin supplement for pets. Boosts natural immunity, protects against illnesses, and aids recovery after veterinary surgeries or illness.',
    }
  ];

  const categories = [
    { id: 'all', labelTh: 'ทั้งหมด', labelEn: 'All Products' },
    { id: 'food', labelTh: 'อาหารและขนม', labelEn: 'Food & Treats' },
    { id: 'grooming', labelTh: 'กรูมมิ่ง & แชมพู', labelEn: 'Grooming & Shampoo' },
    { id: 'health', labelTh: 'วิตามินและยา', labelEn: 'Health & Vitamins' },
    { id: 'toys', labelTh: 'ของเล่นสัตว์เลี้ยง', labelEn: 'Toys & Accessories' }
  ];

  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const name = lang === 'th' ? product.nameTh : product.nameEn;
    const matchesSearch = name.toLowerCase().includes(searchQuery.toLowerCase());
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

        {/* Product Grid Area */}
        <div>
          {filteredProducts.length === 0 ? (
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
                {lang === 'th' ? 'ไม่พบสินค้าที่ตรงกับการค้นหา' : 'No products match your search'}
              </h3>
              <p style={{ margin: '6px 0 0', fontSize: 14 }}>
                {lang === 'th' ? 'โปรดลองใช้คำค้นหาอื่น หรือเลือกหมวดหมู่อื่น' : 'Please try a different search term or filter'}
              </p>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))',
              gap: 24
            }}>
              {filteredProducts.map(product => (
                <div
                  key={product.id}
                  onClick={() => setSelectedProduct(product)}
                  style={{
                    background: 'white',
                    borderRadius: 16,
                    boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
                    border: '1px solid #f1f5f9',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    transition: 'all 0.25s',
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'relative'
                  }}
                  className="product-card-hover"
                >
                  {(product.tagTh || product.tagEn) && (
                    <span style={{
                      position: 'absolute',
                      top: 12,
                      left: 12,
                      background: '#0d9488',
                      color: 'white',
                      padding: '4px 10px',
                      borderRadius: 30,
                      fontSize: 11,
                      fontWeight: 700,
                      zIndex: 2,
                      boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
                    }}>
                      {lang === 'th' ? product.tagTh : product.tagEn}
                    </span>
                  )}

                  <div style={{ width: '100%', height: 200, overflow: 'hidden', backgroundColor: '#f8fafc', position: 'relative' }}>
                    <img
                      src={product.image}
                      alt={lang === 'th' ? product.nameTh : product.nameEn}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s' }}
                      className="product-img"
                    />
                  </div>

                  <div style={{ padding: 18, display: 'flex', flexDirection: 'column', flex: 1 }}>
                    <h4 style={{
                      margin: 0,
                      fontSize: 14.5,
                      fontWeight: 700,
                      color: '#1e293b',
                      lineHeight: 1.45,
                      height: 42,
                      overflow: 'hidden',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical'
                    }}>
                      {lang === 'th' ? product.nameTh : product.nameEn}
                    </h4>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 8, marginBottom: 12 }}>
                      <div style={{ display: 'flex', gap: 1 }}>
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={12}
                            fill={i < Math.floor(product.rating) ? '#f59e0b' : 'none'}
                            color={i < Math.floor(product.rating) ? '#f59e0b' : '#cbd5e1'}
                          />
                        ))}
                      </div>
                      <span style={{ fontSize: 12, fontWeight: 700, color: '#475569' }}>{product.rating}</span>
                      <span style={{ fontSize: 11.5, color: '#94a3b8' }}>({product.reviewsCount})</span>
                    </div>

                    <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'baseline', gap: 8 }}>
                      <span style={{ fontSize: 18, fontWeight: 800, color: '#0d9488' }}>
                        ฿{product.price.toLocaleString()}
                      </span>
                      {product.originalPrice && (
                        <span style={{ fontSize: 13, textDecoration: 'line-through', color: '#94a3b8' }}>
                          ฿{product.originalPrice.toLocaleString()}
                        </span>
                      )}
                    </div>

                    <button
                      style={{
                        marginTop: 14,
                        width: '100%',
                        padding: '9px',
                        background: 'linear-gradient(135deg, #0d9488, #14b8a6)',
                        color: 'white',
                        border: 'none',
                        borderRadius: 10,
                        fontSize: 13,
                        fontWeight: 700,
                        cursor: 'pointer',
                        fontFamily: 'inherit',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 6
                      }}
                    >
                      <ShoppingBag size={14} />
                      {lang === 'th' ? 'สั่งซื้อผ่าน LINE' : 'Order via LINE'}
                    </button>
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

      {/* Product Detail Modal */}
      {selectedProduct && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.6)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: 20
        }}>
          <div style={{
            background: 'white',
            borderRadius: 24,
            width: '100%',
            maxWidth: 720,
            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
            position: 'relative',
            overflow: 'hidden',
            display: 'grid',
            gridTemplateColumns: '1fr 1.2fr',
          }} className="shop-modal-grid">
            
            <button
              onClick={() => setSelectedProduct(null)}
              style={{
                position: 'absolute',
                top: 16,
                right: 16,
                background: 'white',
                border: 'none',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                width: 32,
                height: 32,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                zIndex: 3
              }}
            >
              <X size={18} color="#475569" />
            </button>

            <div style={{ backgroundColor: '#f8fafc', height: '100%', minHeight: 320, position: 'relative' }}>
              <img
                src={selectedProduct.image}
                alt={lang === 'th' ? selectedProduct.nameTh : selectedProduct.nameEn}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              {(selectedProduct.tagTh || selectedProduct.tagEn) && (
                <span style={{
                  position: 'absolute',
                  top: 16,
                  left: 16,
                  background: '#0d9488',
                  color: 'white',
                  padding: '4px 10px',
                  borderRadius: 30,
                  fontSize: 11,
                  fontWeight: 700,
                  boxShadow: '0 2px 6px rgba(0,0,0,0.15)'
                }}>
                  {lang === 'th' ? selectedProduct.tagTh : selectedProduct.tagEn}
                </span>
              )}
            </div>

            <div style={{ padding: 32, display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: '#0d9488', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {categories.find(c => c.id === selectedProduct.category)?.labelTh || ''}
              </span>
              <h2 style={{ margin: '6px 0 10px', fontSize: 20, fontWeight: 800, color: '#1e293b', lineHeight: 1.4 }}>
                {lang === 'th' ? selectedProduct.nameTh : selectedProduct.nameEn}
              </h2>

              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 16 }}>
                <div style={{ display: 'flex', gap: 1 }}>
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={14}
                      fill={i < Math.floor(selectedProduct.rating) ? '#f59e0b' : 'none'}
                      color={i < Math.floor(selectedProduct.rating) ? '#f59e0b' : '#cbd5e1'}
                    />
                  ))}
                </div>
                <span style={{ fontSize: 13, fontWeight: 700, color: '#334155' }}>{selectedProduct.rating}</span>
                <span style={{ fontSize: 12.5, color: '#64748b' }}>({selectedProduct.reviewsCount} {lang === 'th' ? 'รีวิว' : 'reviews'})</span>
              </div>

              <p style={{ margin: '0 0 24px', fontSize: 13.5, color: '#475569', lineHeight: 1.6, flexGrow: 1 }}>
                {lang === 'th' ? selectedProduct.descTh : selectedProduct.descEn}
              </p>

              <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 20 }}>
                <span style={{ fontSize: 24, fontWeight: 800, color: '#0d9488' }}>
                  ฿{selectedProduct.price.toLocaleString()}
                </span>
                {selectedProduct.originalPrice && (
                  <span style={{ fontSize: 15, textDecoration: 'line-through', color: '#94a3b8' }}>
                    ฿{selectedProduct.originalPrice.toLocaleString()}
                  </span>
                )}
              </div>

              <a
                href={`https://line.me/R/oaMessage/@pawplan/?${encodeURIComponent(lang === 'th' ? `สวัสดีค่ะ สนใจสั่งซื้อสินค้า: ${selectedProduct.nameTh}` : `Hello, I'm interested in ordering: ${selectedProduct.nameEn}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  width: '100%',
                  padding: '12px 24px',
                  background: 'linear-gradient(135deg, #0d9488, #14b8a6)',
                  color: 'white',
                  border: 'none',
                  borderRadius: 12,
                  fontSize: 15,
                  fontWeight: 700,
                  cursor: 'pointer',
                  textDecoration: 'none',
                  boxShadow: '0 4px 14px rgba(13, 148, 136, 0.25)',
                  transition: 'opacity 0.2s',
                  textAlign: 'center'
                }}
              >
                <ShoppingBag size={18} />
                {lang === 'th' ? 'สั่งซื้อสินค้าผ่านทาง LINE' : 'Order via LINE Chat'}
              </a>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
