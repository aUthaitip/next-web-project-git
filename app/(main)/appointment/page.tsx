// app/appointment/page.tsx
import Link from 'next/link';

export default function AppointmentPage() {
    return (
        <section className="content-section appointment-page page-animate">
            <div className="container">
                <h2 className="page-title">📅 ระบบจองนัดหมายออนไลน์ Pawplan</h2>
                <div className="divider"></div>
                <p className="intro-text page-subtitle">วางแผนการดูแลสุขภาพเพื่อนรักได้ง่าย ๆ เพียง 4 ขั้นตอน กรุณาเลือกบริการที่ต้องการ เพื่อให้เราเตรียมความพร้อมได้อย่างเต็มที่</p>

                <div className="steps-grid page-content">
                    <div className="step-card"><h3>ขั้นตอนที่ 1: เลือกบริการ</h3><p>ระบุความต้องการของคุณ (ตรวจสุขภาพ, วัคซีน, ทันตกรรม หรือ Pet Care)</p></div>
                    {/* ... (step-card อื่นๆ) ... */}
                </div>
                 <div className="steps-grid page-content">
                    <div className="step-card"><h3>ขั้นตอนที่ 2: เลือกวันและเวลา</h3><p>ระบุวันและเวลาที่สะดวกในการนัดหมาย</p></div>
                    <div className="step-card"><h3>ขั้นตอนที่ 3: ยืนยันข้อมูล</h3><p>ตรวจสอบรายละเอียดการนัดหมายก่อนยืนยัน</p></div>
                    <div className="step-card"><h3>ขั้นตอนที่ 4: รับการแจ้งเตือน</h3><p>เจ้าหน้าที่จะโทรกลับเพื่อคอนเฟิร์มภายใน 24 ชั่วโมง</p></div>
                </div>

                <div className="important-notes center-text page-section">
                    <h3>🚨 ข้อควรรู้ก่อนวันนัดหมาย</h3>
                    <ul style={{ textAlign: 'left', display: 'inline-block' }}>
                        <li>ระบบจะส่งข้อความแจ้งเตือนคุณล่วงหน้า **24 ชั่วโมง**</li>
                        <li>หากต้องการยกเลิกหรือเปลี่ยนแปลงเวลา กรุณาแจ้งล่วงหน้าอย่างน้อย **3 ชั่วโมง**</li>
                        <li>สำหรับการนัดหมายผ่าตัดหรือตรวจเลือด กรุณางดน้ำงดอาหารตามคำแนะนำของแพทย์</li>
                    </ul>
                    <Link href="/login" className="cta-button big-cta">เริ่มต้นจองนัดหมาย (ระบบจำลอง)</Link>
                </div>
            </div>
        </section>
    );
}