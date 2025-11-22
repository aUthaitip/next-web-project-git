// app/shop/page.tsx
import Link from 'next/link';
import Image from 'next/image';

export default function ShopPage() {
    return (
        <section className="content-section shop-qr-page" style={{ textAlign: 'center', padding: '80px 0' }}>
            <div className="container">
                <h2>🛒 Pawplan Shop | ดูสินค้าและสั่งซื้อผ่าน LINE Official Account</h2>
                <p className="intro-text" style={{ maxWidth: '800px', margin: '0 auto 50px' }}>
                    ผลิตภัณฑ์ทั้งหมดจาก Pawplan คัดสรรและแนะนำโดยทีมสัตวแพทย์<br />
                    **กรุณาสแกน QR Code หรือเพิ่มเพื่อนทาง LINE Official Account เพื่อเลือกชมสินค้าและสั่งซื้อ**
                </p>
                
                <div className="qr-box" style={{ display: 'inline-block', padding: '40px', backgroundColor: 'var(--bg-light)', borderRadius: '15px', boxShadow: '0 8px 20px rgba(0, 0, 0, 0.1)' }}>
                    {/* รูปภาพต้องอยู่ใน public/assets/line.png */}
                    <img 
                        src="/assets/line.png" 
                        alt="QR Code Line OA Pawplan" 
                        style={{ width: '250px', height: '250px', border: '5px solid var(--main-blue)', borderRadius: '10px' }} 
                    />
                    
                    <h3 style={{ marginTop: '25px', color: 'var(--accent-blue)', fontSize: '1.8rem' }}>สแกนเพื่อเข้าสู่ร้านค้าออนไลน์</h3>
                      <a 
                        href="https://lin.ee/LBZXswu" 
                        className="cta-button big-cta" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        style={{ backgroundColor: '#06C755', color: 'white', display: 'block', width: '100%' }}
                    >
                        คลิกเพื่อเพิ่มเพื่อน 
                    </a>
                </div>
                
                <div style={{ marginTop: '50px' }}>
                    <p style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>
                        มีเจ้าหน้าที่พร้อมให้คำแนะนำสินค้าที่เหมาะสมกับสัตว์เลี้ยงของคุณ
                    </p>
                </div>
            </div>
        </section>
    );
}