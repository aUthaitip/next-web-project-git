// app/shop/page.tsx
import Link from 'next/link';

export default function ShopPage() {
    return (
        <section className="shop-page">
            <div className="shop-page__bg-blob shop-page__bg-blob--1" />
            <div className="shop-page__bg-blob shop-page__bg-blob--2" />

            <div className="container shop-page__container">

                {/* ===== HEADER ===== */}
                <div className="shop-page__header">
                    <span className="shop-page__label">🛒 Online Store</span>
                    <h1 className="shop-page__title">Pawplan Shop</h1>
                    <p className="shop-page__subtitle">ดูสินค้าและสั่งซื้อผ่าน LINE Official Account</p>
                    <p className="shop-page__desc">
                        ผลิตภัณฑ์ทั้งหมดคัดสรรและแนะนำโดยทีมสัตวแพทย์ของเรา<br />
                        สแกน QR Code หรือกดปุ่มเพื่อเพิ่มเพื่อนและเลือกชมสินค้า
                    </p>
                </div>

                {/* ===== QR CARD ===== */}
                <div className="shop-qr-card">

                    {/* Decorative ring */}
                    <div className="shop-qr-card__ring" />

                    {/* QR Image */}
                    <div className="shop-qr-card__image-wrap">
                        <img
                            src="/assets/line.png"
                            alt="QR Code LINE OA Pawplan"
                            className="shop-qr-card__qr"
                        />
                    </div>

                    <p className="shop-qr-card__scan-text">สแกนเพื่อเข้าสู่ร้านค้าออนไลน์</p>

                    {/* LINE Button */}
                    <a
                        href="https://lin.ee/LBZXswu"
                        className="shop-line-btn"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2C6.48 2 2 6.03 2 11c0 3.19 1.76 6.02 4.47 7.79L5.5 22l3.56-1.77C10.12 20.73 11.05 21 12 21c5.52 0 10-4.03 10-9s-4.48-9-10-9zm0 16c-.78 0-1.55-.1-2.28-.3l-.52-.15-2.18 1.08.57-1.98-.34-.43C5.45 15.13 4 13.13 4 11c0-3.87 3.58-7 8-7s8 3.13 8 7-3.58 7-8 7z" />
                        </svg>
                        คลิกเพื่อเพิ่มเพื่อน
                    </a>

                    {/* Divider */}
                    <div className="shop-qr-card__divider">
                        <span>หรือ</span>
                    </div>

                    {/* Features */}
                    <div className="shop-features">
                        <div className="shop-feature">
                            <span className="shop-feature__icon">🐾</span>
                            <span>คัดสรรโดยสัตวแพทย์</span>
                        </div>
                        <div className="shop-feature">
                            <span className="shop-feature__icon">💬</span>
                            <span>มีเจ้าหน้าที่ให้คำแนะนำ</span>
                        </div>
                        <div className="shop-feature">
                            <span className="shop-feature__icon">🚚</span>
                            <span>จัดส่งทั่วประเทศ</span>
                        </div>
                    </div>

                </div>

                {/* Footer note */}
                <p className="shop-page__note">
                    มีเจ้าหน้าที่พร้อมให้คำแนะนำสินค้าที่เหมาะสมกับสัตว์เลี้ยงของคุณ ทุกวัน 9:00–18:00 น.
                </p>

            </div>
        </section>
    );
}