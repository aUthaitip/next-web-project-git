'use client';

import Link from 'next/link';
import {
    Scissors,
    Bath,
    Sparkles,
    ShieldCheck,
    CalendarDays,
    Waves,
    ArrowRight,
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function PetcarePage() {
    const { t } = useLanguage();

    const services = [
        {
            icon: <Scissors size={28} strokeWidth={2} />,
            title: t('petcare.svc1Title'),
            desc: t('petcare.svc1Desc'),
        },
        {
            icon: <Bath size={28} strokeWidth={2} />,
            title: t('petcare.svc2Title'),
            desc: t('petcare.svc2Desc'),
        },
        {
            icon: <Sparkles size={28} strokeWidth={2} />,
            title: t('petcare.svc3Title'),
            desc: t('petcare.svc3Desc'),
        },
        {
            icon: <ShieldCheck size={28} strokeWidth={2} />,
            title: t('petcare.svc4Title'),
            desc: t('petcare.svc4Desc'),
        },
    ];

    return (
        <section className="content-section petcare-page page-animate">
            <div className="container petcare-container">

                {/* Page Header */}
                <header className="petcare-header">
                    <div className="petcare-eyebrow">
                        <span className="petcare-eyebrow__icon">
                            <Waves size={18} strokeWidth={2.5} />
                        </span>
                        <span>Pawplan Pet Care</span>
                    </div>

                    <div className="petcare-title-row">
                        <div className="petcare-title-line" />
                        <h1 className="petcare-title">Pawplan Pet Care</h1>
                        <div className="petcare-title-line" />
                    </div>

                    <p className="petcare-intro">
                        {t('petcare.subtitle')}
                    </p>
                </header>

                {/* Service Cards */}
                <div className="pc-grid petcare-service-grid">
                    {services.map((item, idx) => (
                        <article key={idx} className="pc-card petcare-service-card">
                            <span className="petcare-card-number">
                                {String(idx + 1).padStart(2, '0')}
                            </span>

                            <div className="pc-icon-box ">
                                {item.icon}
                            </div>

                            <div className="petcare-card-content">
                                <h2>{item.title}</h2>
                                <p>{item.desc}</p>
                            </div>

                            <div className="petcare-card-accent" />
                        </article>
                    ))}
                </div>

                {/* CTA */}
                <div className="pc-footer petcare-cta">
                    <div className="petcare-cta__content">
                        <div className="petcare-cta__badge">
                            <Sparkles size={16} />
                            <span>Why Pawplan?</span>
                        </div>

                        <h2>{t('petcare.whyTitle')}</h2>
                        <p>{t('petcare.whyDesc')}</p>
                    </div>

                    <div className="petcare-cta__action">
                        <div className="petcare-cta__icon">
                            <CalendarDays size={24} />
                        </div>

                        <Link href="/appointment" className="pc-cta-btn petcare-cta-btn">
                            <span>{t('petcare.ctaBtn')}</span>
                            <ArrowRight size={18} />
                        </Link>

                        <span className="petcare-cta__hint">
                            ดูแลน้องให้ดีที่สุด เริ่มต้นได้ที่นี่
                        </span>
                    </div>
                </div>

            </div>
        </section>
    );
}