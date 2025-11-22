import Link from 'next/link';
import HideHeader from '@/components/HideHeader';

export default function AppointmentPage() {
    const sampleAppointments = [
        { id: 'A001', patient: 'สมชาย ใจดี', time: '1 พ.ย. 2568, 09:00 น.' },
        { id: 'A002', patient: 'สมหญิง สบาย', time: '1 พ.ย. 2568, 10:00 น.' },
        { id: 'A003', patient: 'เอกภพ มั่นคง', time: '1 พ.ย. 2568, 11:00 น.' },
        { id: 'A004', patient: 'สายฝน ชื่นใจ', time: '2 พ.ย. 2568, 14:00 น.' },
    ];
    // ข้อมูล sampleAppointments ถูกตัด 'status' ออกไปแล้ว

    return (
        <section className="page-section admin-appointments">
            <HideHeader />
            <div className="container">
                <header className="page-header">
                    <h1 className="page-title">รายการนัดหมายที่จอง</h1>
                    <p className="page-subtitle">แสดงข้อมูลผู้ป่วยและเวลาจอง</p>
                </header>

                <div className="appointments-list">
                    {sampleAppointments.map((a) => (
                        // ปรับ Card ให้แสดงผลข้อมูลเรียบง่าย
                        <div key={a.id} className="appointment-card card simple-view no-status">
                            <div className="card-content">
                                <div className="appointment-meta">
                                    <h2 className="patient-name">{a.patient}</h2> {/* ชื่อผู้ป่วย */}
                                    <p className="appointment-time">{a.time}</p> {/* เวลาจอง */}
                                    <p className="appointment-id">รหัส: {a.id}</p>
                                </div>
                                {/* ส่วนสำหรับแสดงสถานะ (appointment-status) ถูกลบออกไป */}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="footer-actions">
                    <Link href="/admin" className="btn btn-info large back-link">
                        &larr; กลับไปที่แผงควบคุม
                    </Link>
                </div>
            </div>
        </section>
    );
}