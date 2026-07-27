'use client';

// app/shop/page.tsx
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';

export default function ShopPage() {
    const { t } = useLanguage();

    return (
        <section className="shop-page">
            <div className="shop-page__bg-blob shop-page__bg-blob--1" />
            <div className="shop-page__bg-blob shop-page__bg-blob--2" />

            <div className="container shop-page__container">

                {/* ===== HEADER ===== */}
                <div className="shop-page__header">
                    <span className="shop-page__label">{t('shop.label')}</span>
                    <h1 className="shop-page__title">{t('shop.title')}</h1>
                    <p className="shop-page__subtitle">{t('shop.subtitle')}</p>
                    <p className="shop-page__desc">
                        {t('shop.desc1')}<br />
                        {t('shop.desc2')}
                    </p>
                </div>

                {/* ===== TICKET CARD ===== */}
                <div className="shop-qr-card">

                    {/* Decorative dashed ring */}
                    <div className="shop-qr-card__ring" />

                    {/* Ink stamp badge */}
                    <span className="shop-qr-card__badge">{t('shop.badge')}</span>

                    {/* QR Image */}
                    <div className="shop-qr-card__image-wrap">
                        <img
                            src="/assets/line.png"
                            alt={t('shop.qrAlt')}
                            className="shop-qr-card__qr"
                        />
                    </div>

                    <p className="shop-qr-card__scan-text">{t('shop.scanText')}</p>

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
                        {t('shop.lineBtn')}
                    </a>

                    {/* Divider */}
                    <div className="shop-qr-card__divider">
                        <span>{t('shop.dividerOr')}</span>
                    </div>

                    {/* Features */}
                    <div className="shop-features">
                        <div className="shop-feature">
                            <span className="shop-feature__icon">🐾</span>
                            <span>{t('shop.feat1')}</span>
                        </div>
                        <div className="shop-feature">
                            <span className="shop-feature__icon">💬</span>
                            <span>{t('shop.feat2')}</span>
                        </div>
                        <div className="shop-feature">
                            <span className="shop-feature__icon">🚚</span>
                            <span>{t('shop.feat3')}</span>
                        </div>
                    </div>

                </div>

                {/* Footer note */}
                <p className="shop-page__note">
                    {t('shop.note')}
                </p>

            </div>
        </section>
    );
}