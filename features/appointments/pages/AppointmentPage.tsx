'use client';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Stethoscope,
    CalendarDays,
    ClipboardCheck,
    PhoneCall,
    AlertCircle,
    ArrowRight,
    Sparkles
} from 'lucide-react';

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.12,
            delayChildren: 0.1
        }
    }
} as const;

const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            type: 'spring',
            stiffness: 100,
            damping: 15
        }
    }
} as const;

export default function AppointmentPage() {
    const { t, lang } = useLanguage();
    const [ctaHref, setCtaHref] = useState('/login');

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const service = params.get('service');

        fetch('/api/auth/me')
            .then(r => r.json())
            .then(data => {
                const dest = data.isLoggedIn ? '/book' : '/login';
                if (service) {
                    setCtaHref(`${dest}?service=${service}`);
                } else {
                    setCtaHref(dest);
                }
            })
            .catch(() => {
                if (service) {
                    setCtaHref(`/login?service=${service}`);
                } else {
                    setCtaHref('/login');
                }
            });
    }, []);

    const steps = [
        {
            number: '01',
            title: t('appointment.step1Title'),
            desc: t('appointment.step1Desc'),
            icon: <Stethoscope size={28} className="text-[#34adba] group-hover:text-white transition-colors duration-300" />
        },
        {
            number: '02',
            title: t('appointment.step2Title'),
            desc: t('appointment.step2Desc'),
            icon: <CalendarDays size={28} className="text-[#34adba] group-hover:text-white transition-colors duration-300" />
        },
        {
            number: '03',
            title: t('appointment.step3Title'),
            desc: t('appointment.step3Desc'),
            icon: <ClipboardCheck size={28} className="text-[#34adba] group-hover:text-white transition-colors duration-300" />
        },
        {
            number: '04',
            title: t('appointment.step4Title'),
            desc: t('appointment.step4Desc'),
            icon: <PhoneCall size={28} className="text-[#34adba] group-hover:text-white transition-colors duration-300" />
        }
    ];

    // Strip browser-native emojis to maintain a clean UI and allow custom styled icons
    const cleanTitle = t('appointment.title').replace(/📅/g, '').trim();
    const cleanNotesTitle = t('appointment.notesTitle').replace(/🚨/g, '').trim();
    const cleanCtaBtnText = t('appointment.ctaBtn').replace(/\(ระบบจำลอง\)/g, '').trim();

    return (
        <section className="relative appointment-page-wrapper page-animate overflow-hidden">
            {/* Ambient Background Blobs */}
            <div className="absolute top-10 left-5 w-60 h-60 bg-sky-200/40 rounded-full blur-3xl -z-10 pointer-events-none animate-pulse" />
            <div className="absolute bottom-20 right-5 w-80 h-80 bg-teal-100/40 rounded-full blur-3xl -z-10 pointer-events-none" />

            <div className="appointment-container">

                {/* Header Section */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="appointment-hero"
                >
                    <div className="appointment-badge">
                        <Sparkles size={14} className="animate-pulse text-[#34adba]" />
                        <span>Pawplan Wellness</span>
                    </div>

                    <h2 className="appointment-title">
                        {cleanTitle}
                    </h2>

                    <div className="appointment-title-line"></div>

                    <p className="appointment-subtitle">
                        {t('appointment.subtitle')}
                    </p>
                </motion.div>

                {/* Steps Section */}
                <div className="appointment-steps-wrap">
                    {/* Connecting Line for Large Screens */}
                    <div className="appointment-connector"></div>

                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        className="appointment-steps-grid"
                    >
                        {steps.map((step, idx) => (
                            <motion.div
                                key={idx}
                                variants={itemVariants}
                                className="appointment-step-card group"
                            >
                                {/* Background Step Number - positioned with low opacity to prevent clash */}
                                <div className="appointment-step-number">
                                    {step.number}
                                </div>

                                {/* Icon Container */}
                                <div className="appointment-step-icon">
                                    {step.icon}
                                </div>

                                <h3 className="appointment-step-title">
                                    {step.title}
                                </h3>
                                <p className="appointment-step-desc">
                                    {step.desc}
                                </p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>

                {/* Important Notes & CTA Section - Redesigned into a balanced 2-column layout */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="appointment-info-card"
                >
                    {/* Top Color Accent Line */}
                    <div className="appointment-accent-line"></div>

                    <div className="appointment-info-grid">

                        {/* Left Column: Guidelines List (3 of 5 cols on desktop) */}
                        <div className="appointment-notes">
                            <div className="appointment-notes-heading">
                                <div className="appointment-notes-icon">
                                    <AlertCircle size={22} />
                                </div>
                                <h3 className="appointment-notes-title">
                                    {cleanNotesTitle}
                                </h3>
                            </div>

                            <ul className="appointment-notes-list">
                                {[t('appointment.note1'), t('appointment.note2'), t('appointment.note3')].map((note, index) => (
                                    <li
                                        key={index}
                                        className="appointment-note-item"
                                    >
                                        <span className="appointment-note-check">
                                            ✓
                                        </span>
                                        <span>{note}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Right Column: CTA Panel (2 of 5 cols on desktop) */}
                        <div className="appointment-cta-panel">
                            <div className="appointment-cta-icon">
                                <Sparkles size={24} className="animate-pulse" />
                            </div>

                            <h4 className="appointment-cta-title">
                                {lang === 'th' ? 'พร้อมนัดหมายแล้วใช่ไหม?' : 'Ready to book?'}
                            </h4>

                            <p className="appointment-cta-desc">
                                {lang === 'th' ? 'คลิกปุ่มด้านล่างเพื่อเริ่มระบุบริการและวันเวลาที่ต้องการ' : 'Click below to choose your service and time.'}
                            </p>

                            <Link href={ctaHref} className="appointment-cta-button cta-button group">
                                <span>{cleanCtaBtnText}</span>
                                <ArrowRight size={18} className="transition-transform duration-300 group-hover:translate-x-1" />
                            </Link>

                        </div>

                    </div>
                </motion.div>
            </div>
        </section>
    );
}