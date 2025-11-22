// app/admin/page.tsx
import Link from 'next/link';
import HideHeader from '@/components/HideHeader';

export default function AdminPanelPage() {
    return (
        <section className="admin-dashboard">
            {/* client component hides global header when this page mounts */}
            <HideHeader />
            <div className="container">
                <h1>ยินดีต้อนรับสู่ Admin Panel</h1>
                <p>เข้าสู่ระบบด้วยสิทธิ์ผู้ดูแลระบบเรียบร้อยแล้ว</p>

                <div className="admin-actions">
                    <Link href="/admin/appointment" className="action-card">
                        <h3>จัดการนัดหมาย</h3>
                        <p>ดูและอนุมัติการจองนัดหมาย</p>
                    </Link>
                      <Link href="/admin/docters" className="action-card">
                        <h3>จัดการบัญชีผู้ใช้</h3>
                        <p>เพิ่ม แก้ไข หรือลบข้อมูลหมอ</p>
                    </Link>
                    <div className="action-card">
                        <h3>จัดการหน้าเว็บไซต์</h3>
                        <p>เพิ่ม แก้ไข ลบ หรืออัพเดทข้อมูล</p>
                    </div>
                </div>
            </div>
        </section>
    );
}