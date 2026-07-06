'use client';
import Link from 'next/link';
import {
    Scissors,
    Bath,
    Sparkles,
    ShieldCheck,
    CalendarDays,
    Waves
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function PetcarePage() {
    const { t } = useLanguage();

    const services = [
        {
            icon: <Scissors size={28} />,
            title: t('petcare.svc1Title'),
            desc: t('petcare.svc1Desc'),
        },
        {
            icon: <Bath size={28} />,
            title: t('petcare.svc2Title'),
            desc: t('petcare.svc2Desc'),
        },
        {
            icon: <Sparkles size={28} />,
            title: t('petcare.svc3Title'),
            desc: t('petcare.svc3Desc'),
        },
        {
            icon: <ShieldCheck size={28} />,
            title: t('petcare.svc4Title'),
            desc: t('petcare.svc4Desc'),
        }
    ];

    return (
        <section className="content-section petcare-page page-animate">
            <div className="container">

                <h2 className="page-title">
                    <Waves className="title-icon" size={40} strokeWidth={2.5} />
                    <span className="title-text">Pawplan Pet Care</span>
                </h2>
                <div className="divider"></div>
                <p className="text-content">
                    {t('petcare.subtitle')}
                </p>

                <div className="pc-grid">
                    {services.map((item, idx) => (
                        <div key={idx} className="pc-card">
                            <div className="pc-icon-box">
                                {item.icon}
                            </div>
                            <h3>{item.title}</h3>
                            <p>{item.desc}</p>
                        </div>
                    ))}
                </div>

                <div className="pc-footer">
                    <h3 className="pc-subtitle" style={{ fontWeight: 700, color: '#1e293b' }}>
                        {t('petcare.whyTitle')}
                    </h3>
                    <p className="pc-subtitle" style={{ fontSize: '1rem', marginTop: '5px' }}>
                        {t('petcare.whyDesc')}
                    </p>
                    <Link href="/appointment" className="pc-cta-btn">
                        <CalendarDays size={20} />
                        {t('petcare.ctaBtn')}
                    </Link>
                </div>

            </div>
        </section>
    );
}