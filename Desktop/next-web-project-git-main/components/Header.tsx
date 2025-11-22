// components/Header.tsx
import Link from 'next/link';

export default function Header() {
  return (
    <header>
      <div className="container">
        <div className="navbar">
          <Link href="/" className="logo">
            🐾 Pawplan
          </Link>
          <nav>
            <ul className="nav-links" id="navLinks">
              <li><Link href="/">หน้าแรก</Link></li>
              <li className="dropdown">
                <a href="#" className="dropbtn">เกี่ยวกับเรา <span className="arrow">▼</span></a>
                <ul className="dropdown-content">
                  <li><a href="/about-us/history_mission">ประวัติและพันธกิจ</a></li>
                  <li><a href="/about-us/news_activities">ข่าวสารและกิจกรรม</a></li>
                  <li><a href="/about-us/awards_accreditations">รางวัลและการรับรอง</a></li>
                  <li><Link href="/#contact">ติดต่อเรา</Link></li>
                </ul>
              </li>
              <li className="dropdown">
                <a href="#" className="dropbtn">บริการ <span className="arrow">▼</span></a>
                <ul className="dropdown-content">
                  <li><Link href="/appointment">จองนัดหมาย</Link></li>
                  <li><Link href="/petcare">Pawplan Pet Care</Link></li>
                  <li><Link href="/shop">Pawplan Shop</Link></li>
                </ul>
              </li>
              <li className="dropdown">
                <a href="#" className="dropbtn">คลินิกและแพทย์ <span className="arrow">▼</span></a>
                <ul className="dropdown-content">
                  <li><Link href="/#services">บริการทางการแพทย์</Link></li>
                  <li><Link href="/doctors">ทีมสัตวแพทย์</Link></li>
                </ul>
              </li>
              <li className="dropdown">
                <a href="#" className="dropbtn">บทความ <span className="arrow">▼</span></a>
                <ul className="dropdown-content">
                  <li><a href="/articles/dog">บทความสุนัข</a></li>
                  <li><a href="/articles/cat">บทความแมว</a></li>
                  <li><a href="/articles/health-tips">เคล็ดลับสุขภาพ</a></li>
                </ul>
              </li>
            </ul>
          </nav>
          <div className="header-actions">
            <Link href="/login" className="login-icon" title="เข้าสู่ระบบ">👤</Link>
          </div>
        </div>
      </div>
    </header>
  );
}