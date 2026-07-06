'use client';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';

export default function AppointmentPage() {
    const { t } = useLanguage();
    return (
        <section className="content-section appointment-page page-animate">
            <div className="container">
                <h2 className="page-title">{t('appointment.title')}</h2>
                <div className="divider"></div>
                <p className="intro-text page-subtitle">{t('appointment.subtitle')}</p>

                <div className="steps-grid page-content">
                    <div className="step-card"><h3>{t('appointment.step1Title')}</h3><p>{t('appointment.step1Desc')}</p></div>
                    {/* ... (step-card อื่นๆ) ... */}
                </div>
                 <div className="steps-grid page-content">
                    <div className="step-card"><h3>{t('appointment.step2Title')}</h3><p>{t('appointment.step2Desc')}</p></div>
                    <div className="step-card"><h3>{t('appointment.step3Title')}</h3><p>{t('appointment.step3Desc')}</p></div>
                    <div className="step-card"><h3>{t('appointment.step4Title')}</h3><p>{t('appointment.step4Desc')}</p></div>
                </div>

                <div className="important-notes center-text page-section">
                    <h3>{t('appointment.notesTitle')}</h3>
                    <ul style={{ textAlign: 'left', display: 'inline-block' }}>
                        <li>{t('appointment.note1')}</li>
                        <li>{t('appointment.note2')}</li>
                        <li>{t('appointment.note3')}</li>
                    </ul>
                    <Link href="/login" className="cta-button big-cta">{t('appointment.ctaBtn')}</Link>
                </div>
            </div>
        </section>
    );
}