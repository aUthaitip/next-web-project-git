'use client';

import Link from 'next/link';
import { useState, useRef, useEffect, useCallback } from 'react';
import { Menu, User, CalendarDays, LogOut, UserLock, ChevronDown } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';

interface DropdownItem { label: string; href: string }
interface NavItem { label: string; dropdown?: DropdownItem[]; href?: string }

export interface SessionUser {
  id: number;
  name: string;
  email: string;
  image?: string | null;
}



function DropdownMenu({ items, visible }: { items: DropdownItem[]; visible: boolean }) {
  return (
    <ul className={`hdr-dropdown${visible ? ' visible' : ''}`}>
      {items.map((item, i) => (
        <li key={i} style={{ '--i': i } as React.CSSProperties}>
          <a href={item.href} className="hdr-dropdown-item">{item.label}</a>
        </li>
      ))}
    </ul>
  );
}

interface HeaderProps {
  initialUser?: SessionUser | null;
}

export default function Header({ initialUser = null }: HeaderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { t, lang, toggleLanguage } = useLanguage();
  const [user, setUser] = useState<SessionUser | null>(initialUser);

  const fetchUser = useCallback(() => {
    fetch('/api/me')
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => setUser(data?.user ?? null))
      .catch(() => {});
  }, []);

  useEffect(() => {
    fetchUser();
  }, [pathname, fetchUser]);

  useEffect(() => {
    window.addEventListener('user-auth-change', fetchUser);
    return () => window.removeEventListener('user-auth-change', fetchUser);
  }, [fetchUser]);

  const navItems: NavItem[] = [
    { label: t('nav.home'), href: '/' },
    {
      label: t('nav.aboutUs'),
      dropdown: [
        { label: t('nav.historyMission'), href: '/about-us/history_mission' },
        { label: t('nav.newsActivities'), href: '/about-us/news_activities' },
        { label: t('nav.awardsAccreditations'), href: '/about-us/awards_accreditations' },
        { label: t('nav.contactUs'), href: '/#contact' },
      ],
    },
    {
      label: t('nav.services'),
      dropdown: [
        { label: t('nav.bookAppointment'), href: '/appointment' },
        { label: t('nav.petCare'), href: '/petcare' },
        { label: t('nav.shop'), href: '/shop' },
      ],
    },
    {
      label: t('nav.clinicDoctors'),
      dropdown: [
        { label: t('nav.medicalServices'), href: '/#services' },
        { label: t('nav.veterinaryTeam'), href: '/doctors' },
      ],
    },
    {
      label: t('nav.articles'),
      dropdown: [
        { label: t('nav.dogArticles'), href: '/articles/dog' },
        { label: t('nav.catArticles'), href: '/articles/cat' },
        { label: t('nav.healthTips'), href: '/articles/health-tips' },
      ],
    },
  ];

  const appointmentNavItems: NavItem[] = [
    { label: t('nav.bookAppointment'), href: '/book' },
    { label: t('nav.myAppointments'), href: '/my-appointments' },
  ];

  const isBookingFlow = pathname === '/book' || pathname === '/my-appointments' || pathname === '/profile';
  const currentNavItems = isBookingFlow ? appointmentNavItems : navItems;

  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [mobileOpenSub, setMobileOpenSub] = useState<number | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleMouseEnter = (index: number) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setOpenIndex(index);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setOpenIndex(null);
    }, 150);
  };

  const handleLogout = async () => {
    await fetch('/api/logout', { method: 'POST' });
    setUser(null);
    setMenuOpen(false);
    router.push('/');
    router.refresh();
  };

  const getInitial = (name: string) => name.charAt(0).toUpperCase();

  return (
    <header>
      <div className="container">
        <div className="navbar">
          {pathname === '/my-appointments' ? (
            <a href="#" onClick={(e) => { e.preventDefault(); window.location.reload(); }} className="hdr-logo">🐾 Pawplan</a>
          ) : (
            <Link href="/" className="hdr-logo">🐾 Pawplan</Link>
          )}

          <nav className="hdr-desktop-nav">
            <ul className="nav-links">
              {currentNavItems.map((item, i) => (
                <li
                  key={i}
                  className={item.dropdown ? 'hdr-dropdown-wrap' : ''}
                  onMouseEnter={() => item.dropdown && handleMouseEnter(i)}
                  onMouseLeave={() => item.dropdown && handleMouseLeave()}
                >
                  {item.dropdown ? (
                    <>
                      <a
                        href="#"
                        className={`hdr-navlink ${openIndex === i ? 'open' : ''}`}
                        onClick={(e) => e.preventDefault()}
                      >
                        {item.label}
                      </a>
                      <DropdownMenu items={item.dropdown} visible={openIndex === i} />
                      <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, height: 8 }} />
                    </>
                  ) : (
                    <Link href={item.href!} className="hdr-navlink">{item.label}</Link>
                  )}
                </li>
              ))}
            </ul>
          </nav>

          <div className="header-actions">
            <button
              onClick={toggleLanguage}
              title={lang === 'th' ? t('common.switchToEnglish') : t('common.switchToThai')}
              style={{
                background: 'none',
                border: '1.5px solid currentColor',
                borderRadius: 6,
                padding: '4px 10px',
                fontSize: '0.8rem',
                fontWeight: 700,
                cursor: 'pointer',
                letterSpacing: '0.5px',
                color: 'inherit',
                transition: 'opacity 0.2s',
                opacity: 0.85,
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.85')}
            >
              {lang === 'th' ? 'EN' : 'TH'}
            </button>
            {user ? (
              <div className="hdr-user-section">
                <div className="hdr-user-chip" ref={menuRef}>
                  <button
                    className="hdr-user-trigger"
                    onClick={() => { setMenuOpen((v) => !v); }}
                  >
                    <span className="hdr-avatar" style={{ overflow: 'hidden' }}>
                      {user.image ? (
                        <img src={user.image} alt={user.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        getInitial(user.name)
                      )}
                    </span>
                    <span className="hdr-username">{user.name}</span>
                    <ChevronDown size={14} strokeWidth={2.5} className="hdr-arrow" />
                  </button>

                  {menuOpen && (
                    <div className="hdr-user-menu">
                      <div className="hdr-menu-profile">
                        <p className="hdr-menu-name">{user.name}</p>
                        <p className="hdr-menu-email">{user.email}</p>
                      </div>
                      <button
                        className="hdr-menu-item"
                        onClick={() => { router.push('/profile'); setMenuOpen(false); }}
                      >
                        <User size={16} strokeWidth={1.8} /> {t('nav.editProfile')}
                      </button>
                      <button
                        className="hdr-menu-item"
                        onClick={() => { router.push('/my-appointments'); setMenuOpen(false); }}
                      >
                        <CalendarDays size={16} strokeWidth={1.8} /> {t('nav.myAppointments')}
                      </button>
                      <button className="hdr-menu-item danger" onClick={handleLogout}>
                        <LogOut size={16} strokeWidth={1.8} /> {t('nav.logout')}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <Link href="/login" className="hdr-login hdr-desktop-only" title={t('nav.login')}>
                <UserLock size={30} strokeWidth={2} />
              </Link>
            )}

            {/* General Hamburger Button visible on mobile screens */}
            <button className="hdr-hamburger" onClick={() => setMobileNavOpen(true)} title={t('common.menu')}>
              <Menu size={24} strokeWidth={2} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Overlay Menu */}
      {mobileNavOpen && (
        <>
          <div className="hdr-mobile-backdrop" onClick={() => setMobileNavOpen(false)} />
          <div className="hdr-mobile-overlay">
            <div className="hdr-mobile-header">
              {pathname === '/my-appointments' ? (
                <a href="#" onClick={(e) => { e.preventDefault(); setMobileNavOpen(false); window.location.reload(); }} className="hdr-logo">🐾 Pawplan</a>
              ) : (
                <Link href="/" className="hdr-logo" onClick={() => setMobileNavOpen(false)}>🐾 Pawplan</Link>
              )}
              <button className="hdr-mobile-close" onClick={() => setMobileNavOpen(false)}>✕</button>
            </div>
            <div className="hdr-mobile-nav">
              {currentNavItems.map((item, i) => (
                <div key={i}>
                  {item.dropdown ? (
                    <>
                      <div 
                        className="hdr-mobile-item"
                        onClick={() => setMobileOpenSub(mobileOpenSub === i ? null : i)}
                        style={{ cursor: 'pointer', userSelect: 'none' }}
                      >
                        <span>{item.label}</span>
                        <span style={{ fontSize: '0.8rem', display: 'inline-block', transition: 'transform 0.2s', transform: mobileOpenSub === i ? 'rotate(180deg)' : 'rotate(0deg)' }}>▼</span>
                      </div>
                      {mobileOpenSub === i && (
                        <div className="hdr-mobile-sub">
                          {item.dropdown.map((sub, j) => (
                            <Link
                              key={j}
                              href={sub.href}
                              className="hdr-mobile-subitem"
                              onClick={() => { setMobileNavOpen(false); setMobileOpenSub(null); }}
                            >
                              {sub.label}
                            </Link>
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    <Link
                      href={item.href!}
                      className="hdr-mobile-item"
                      onClick={() => setMobileNavOpen(false)}
                    >
                      {item.label}
                    </Link>
                  )}
                </div>
              ))}
              
              {user ? (
                <>
                  <div className="hdr-mobile-item" style={{ borderTop: '1px solid #f3f4f6', marginTop: 12, fontWeight: 600 }}>
                    👤 {user.name}
                  </div>
                  <Link href="/my-appointments" className="hdr-mobile-subitem" onClick={() => setMobileNavOpen(false)}>
                    {t('nav.myAppointments')}
                  </Link>
                  <button
                    onClick={() => { handleLogout(); setMobileNavOpen(false); }}
                    className="hdr-mobile-subitem"
                    style={{ border: 'none', background: 'none', width: '100%', textAlign: 'left', cursor: 'pointer', color: 'var(--text-danger)' }}
                  >
                    {t('nav.logout')}
                  </button>
                </>
              ) : (
                <Link
                  href="/login"
                  className="hdr-mobile-item"
                  style={{ borderTop: '1px solid #f3f4f6', marginTop: 12, color: 'var(--main-blue)', fontWeight: 600 }}
                  onClick={() => setMobileNavOpen(false)}
                >
                  {t('nav.login')}
                </Link>
              )}
            </div>
          </div>
        </>
      )}
    </header>
  );
}
