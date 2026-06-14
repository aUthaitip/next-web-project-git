'use client';

import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import { Bell, Menu, User, CalendarDays, LogOut, UserLock } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useNotifications, Notification } from '@/hooks/useNotifications';

interface DropdownItem { label: string; href: string }
interface NavItem { label: string; dropdown?: DropdownItem[]; href?: string }

export interface SessionUser {
  id: number;
  name: string;
  email: string;
}

const navItems: NavItem[] = [
  { label: 'หน้าแรก', href: '/' },
  {
    label: 'เกี่ยวกับเรา',
    dropdown: [
      { label: 'ประวัติและพันธกิจ', href: '/about-us/history_mission' },
      { label: 'ข่าวสารและกิจกรรม', href: '/about-us/news_activities' },
      { label: 'รางวัลและการรับรอง', href: '/about-us/awards_accreditations' },
      { label: 'ติดต่อเรา', href: '/#contact' },
    ],
  },
  {
    label: 'บริการ',
    dropdown: [
      { label: 'จองนัดหมาย', href: '/appointment' },
      { label: 'Pawplan Pet Care', href: '/petcare' },
      { label: 'Pawplan Shop', href: '/shop' },
    ],
  },
  {
    label: 'คลินิกและแพทย์',
    dropdown: [
      { label: 'บริการทางการแพทย์', href: '/#services' },
      { label: 'ทีมสัตวแพทย์', href: '/doctors' },
    ],
  },
  {
    label: 'บทความ',
    dropdown: [
      { label: 'บทความสุนัข', href: '/articles/dog' },
      { label: 'บทความแมว', href: '/articles/cat' },
      { label: 'เคล็ดลับสุขภาพ', href: '/articles/health-tips' },
    ],
  },
];

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
  const [user, setUser] = useState<SessionUser | null>(initialUser);

useEffect(() => {
    fetch('/api/me')
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => setUser(data?.user ?? null))
      .catch(() => {});
  }, []);

  const { notifications, unreadCount, markRead, markAllRead } = useNotifications(user);

  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (
        menuRef.current && !menuRef.current.contains(e.target as Node) &&
        notifRef.current && !notifRef.current.contains(e.target as Node)
      ) {
        setMenuOpen(false);
        setNotifOpen(false);
      }
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleMouseEnter = (i: number) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setOpenIndex(i);
  };
  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => setOpenIndex(null), 120);
  };

  const handleLogout = async () => {
    await fetch('/api/logout', { method: 'POST' });
    setUser(null);
    setMenuOpen(false);
    router.push('/');
    router.refresh();
  };

  const getInitial = (name: string) => name.charAt(0).toUpperCase();

  const timeAgo = (iso: string) => {
    const diff = (Date.now() - new Date(iso).getTime()) / 1000;
    if (diff < 60) return 'เมื่อกี้';
    if (diff < 3600) return `${Math.floor(diff / 60)} นาทีที่แล้ว`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} ชั่วโมงที่แล้ว`;
    return `${Math.floor(diff / 86400)} วันที่แล้ว`;
  };

  return (
    <header>
      <div className="container">
        <div className="navbar">
          <Link href="/" className="hdr-logo">🐾 Pawplan</Link>

          <nav>
            <ul className="nav-links">
              {navItems.map((item, i) => (
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
            {user ? (
              <div className="hdr-user-section">
                <div className="hdr-notif-wrap" ref={notifRef}>
                  <button
                    className="hdr-icon-btn"
                    onClick={() => { setNotifOpen((v) => !v); setMenuOpen(false); }}
                    title="การแจ้งเตือน"
                  >
                    <Bell size={22} strokeWidth={1.8} />
                    {unreadCount > 0 && (
                      <span className="hdr-notif-badge">{unreadCount}</span>
                    )}
                  </button>

                  {notifOpen && (
                    <div className="hdr-notif-panel">
                      <div className="hdr-notif-header">
                        <span>การแจ้งเตือน</span>
                        {unreadCount > 0 && (
                          <button className="hdr-notif-clear" onClick={markAllRead}>
                            อ่านทั้งหมด
                          </button>
                        )}
                      </div>
                      {notifications.length === 0 ? (
                        <p className="hdr-notif-empty">ไม่มีการแจ้งเตือน</p>
                      ) : (
                        notifications.map((n: Notification) => (
                          <div
                            key={n.id}
                            className={`hdr-notif-item${n.read ? '' : ' unread'}`}
                            onClick={() => markRead(n.id)}
                          >
                            <span className={`hdr-notif-dot${n.read ? ' read' : ''}`} />
                            <div>
                              <p className="hdr-notif-text">{n.message}</p>
                              <p className="hdr-notif-time">{timeAgo(n.createdAt)}</p>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>

                <div className="hdr-user-chip" ref={menuRef}>
                  <button
                    className="hdr-user-trigger"
                    onClick={() => { setMenuOpen((v) => !v); setNotifOpen(false); }}
                  >
                    <span className="hdr-avatar">{getInitial(user.name)}</span>
                    <span className="hdr-username">{user.name}</span>
                    <Menu size={18} strokeWidth={2} className="hdr-hamburger" />
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
                        <User size={16} strokeWidth={1.8} /> แก้ไขโปรไฟล์
                      </button>
                      <button
                        className="hdr-menu-item"
                        onClick={() => { router.push('/my-appointments'); setMenuOpen(false); }}
                      >
                        <CalendarDays size={16} strokeWidth={1.8} /> นัดหมายของฉัน
                      </button>
                      <button className="hdr-menu-item danger" onClick={handleLogout}>
                        <LogOut size={16} strokeWidth={1.8} /> ออกจากระบบ
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <Link href="/login" className="hdr-login" title="เข้าสู่ระบบ">
                <UserLock size={30} strokeWidth={2} />
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
