'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, Calendar, FileText, Stethoscope, BookOpen, LogOut } from 'lucide-react';

import { useLanguage } from '@/context/LanguageContext';

const navItems = [
    { id: 'dashboard', labelEn: 'Dashboard', labelTh: 'แดชบอร์ด', icon: LayoutDashboard, href: '/admin' },
    { id: 'appointments', labelEn: 'Appointments', labelTh: 'นัดหมาย', icon: Calendar, href: '/admin/appointment' },
    { id: 'history', labelEn: 'History', labelTh: 'ประวัติ', icon: FileText, href: '/admin/history' },
    { id: 'doctors', labelEn: 'Doctors', labelTh: 'แพทย์', icon: Stethoscope, href: '/admin/doctors' },
    { id: 'content', labelEn: 'Content', labelTh: 'จัดการเนื้อหา', icon: BookOpen, href: '/admin/content' },
];

export default function AdminSidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const { lang } = useLanguage();

    return (
        <div className="admin-sidebar-new">

            {/* Brand */}
            <div className="sidebar-brand">
                <div className="brand-circle">🐾</div>
                <div>
                    <div className="brand-name">Pawplan</div>
                    <div className="brand-desc">{lang === 'th' ? 'ระบบจัดการคลินิก' : 'Vet Clinic Admin'}</div>
                </div>
            </div>

            {/* Nav */}
            <nav className="sidebar-nav">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    return (
                        <Link
                            key={item.id}
                            href={item.href}
                            className={`nav-item ${pathname === item.href ? 'active' : ''}`}
                        >
                            <Icon size={18} className="nav-icon" />
                            <span className="nav-label">{lang === 'th' ? item.labelTh : item.labelEn}</span>
                        </Link>
                    );
                })}
            </nav>

            {/* Logout */}
            <button className="sidebar-logout" onClick={() => {
                sessionStorage.removeItem('admin_authenticated');
                window.location.href = '/admin';
            }}>
                <div className="sidebar-logout-icon">
                    <LogOut size={18} />
                </div>
                <div>
                    <span className="sidebar-logout-title">ออกจากระบบ</span>
                    <span className="sidebar-logout-sub">คลิกเพื่อออกจากระบบ</span>
                </div>
            </button>

        </div>
    );
}
