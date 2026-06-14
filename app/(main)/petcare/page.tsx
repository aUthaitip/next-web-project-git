import Link from 'next/link';
import {
    Scissors,
    Bath,
    Sparkles,
    ShieldCheck,
    CalendarDays,
    Waves
} from 'lucide-react';

export default function PetcarePage() {
    const services = [
        {
            icon: <Scissors size={28} />,
            title: "ตัดขนสไตล์พรีเมียม",
            desc: "ออกแบบทรงขนให้เข้ากับบุคลิกและสายพันธุ์ โดยช่างผู้ชำนาญการที่มีประสบการณ์สูง"
        },
        {
            icon: <Bath size={28} />,
            title: "อาบน้ำโอโซน",
            desc: "ทำความสะอาดล้ำลึกด้วยน้ำโอโซน ช่วยกำจัดแบคทีเรียและกลิ่นตัวได้อย่างมีประสิทธิภาพ"
        },
        {
            icon: <Sparkles size={28} />,
            title: "สปาบำรุงขน",
            desc: "ทรีทเมนท์สูตรพิเศษช่วยให้เส้นขนเงางาม นุ่มสลวย และลดการพันกันของเส้นขน"
        },
        {
            icon: <ShieldCheck size={28} />,
            title: "กำจัดเห็บหมัด",
            desc: "โปรแกรมดูแลความสะอาดและป้องกันปรสิตภายนอก ด้วยผลิตภัณฑ์ที่ปลอดภัยต่อสัตว์เลี้ยง"
        }
    ];

    return (
        <section className="content-section petcare-page page-animate">
            <div className="container">

                <h2 className="page-title">
                    <Waves className="title-icon" size={40} strokeWidth={2.5} />
                    <span className="title-text">Pawplan Pet Care</span>
                </h2>
                <div className="divider"></div>
                <p className="text-content">
                    เรามุ่งเน้นการดูแลที่คำนึงถึง &quot;สุขภาพผิวหนังและอารมณ์&quot; ของเพื่อนรักเป็นอันดับแรก
                    เพื่อให้ทุกการดูแลเป็นช่วงเวลาแห่งความสุขของเด็กๆ
                </p>

                <div className="pc-grid">
                    {services.map((item, idx) => (
                        <div key={idx} className="pc-card">
                            <div className="pc-icon-box">
                                {item.icon}
                            </div>
                            <h3>{item.title}</h3>
                            <p>{item.desc}</p>
                        </div>
                    ))}
                </div>

                <div className="pc-footer">
                    <h3 className="pc-subtitle" style={{ fontWeight: 700, color: '#1e293b' }}>
                        💖 ทำไมต้องเลือก Pawplan Pet Care?
                    </h3>
                    <p className="pc-subtitle" style={{ fontSize: '1rem', marginTop: '5px' }}>
                        เพราะเราเชื่อว่าการดูแลที่ดีคือส่วนหนึ่งของเวชศาสตร์ป้องกัน
                    </p>
                    <Link href="/appointment" className="pc-cta-btn">
                        <CalendarDays size={20} />
                        จองบริการล่วงหน้า
                    </Link>
                </div>

            </div>
        </section>
    );
}