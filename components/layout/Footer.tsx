// components/Footer.tsx
import Link from 'next/link';

export default function Footer() {
  return (
    <footer id="contact">
      <div className="container footer-grid">
        <div>
            <h4>🐾 Pawplan คลินิก</h4>
            <p className="contact-info">&quot;วางแผนสุขภาพที่ดีที่สุด&quot;</p>
            <p>เลขที่ 99/9 ถ.สุขใจ เขตสุขุมวิท กรุงเทพฯ</p>
        </div>
        
        <div>
            <h4>ติดต่อเรา</h4>
            <ul className="contact-list">
                <li className="contact-info">📞 โทร: 02-XXX-XXXX**</li>
                <li>📧 pawplanclinic@gmail.com</li>
                <li>Line ID: @pawplan</li>
            </ul>

            <div className="social-icons" style={{ marginTop: '20px' }}>
                <a href="#" className="social-link" title="Facebook"><i className="fab fa-facebook-f"></i></a>
                <a href="#" className="social-link" title="Instagram"><i className="fab fa-instagram"></i></a>
                <a href="#" className="social-link" title="Twitter"><i className="fab fa-twitter"></i></a>
                <a href="#" className="social-link line-icon" title="Line"><i className="fab fa-line"></i></a> 
            </div>
        </div>
        
        <div>
            <h4>เวลาทำการ</h4>
            <p>จันทร์ - ศุกร์: 10:00 - 20:00 น.</p>
            <p>เสาร์ : 11:00 - 20:00 น.</p>
            <p>ปิดทุกวันอาทิตย์</p>
        </div>
        
        <div>
            <h4>ลิงก์ด่วน</h4>
            <ul>
                <li><Link href="/appointment">จองนัดหมาย</Link></li>
                <li><a href="#">บทความสุขภาพ</a></li>
                <li><a href="#">นโยบายความเป็นส่วนตัว</a></li>
            </ul>
        </div>
      </div>
      
      <div className="container footer-bottom">
        <p>© 2025 Pawplan Clinic. All rights reserved.</p>
      </div>
    </footer>
  );
}