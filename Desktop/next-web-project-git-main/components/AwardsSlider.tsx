'use client'; // 1. ระบุว่าเป็น Client Component

import { useState } from 'react';
import Image from 'next/image';

// Helper component สำหรับรูปภาพรางวัล (เพื่อลดการเขียนโค้ดซ้ำ)
const AwardImage = ({ src, alt }) => (
    <Image
        src={`/assets/${src}`}
        alt={alt}
        width={400}
        height={400}
        style={{ width: '100%', height: 'auto' }}
    />
);

export default function AwardsSlider() {
    // 2. ใช้ State เพื่อติดตามว่า Grid ไหนกำลังแสดงอยู่ (0 = grid แรก, 1 = grid ที่สอง)
    const [activeGrid, setActiveGrid] = useState(0);

    // 3. ฟังก์ชันสำหรับเปลี่ยน Grid เมื่อคลิกที่จุด
    const handleDotClick = (index) => {
        setActiveGrid(index);
    };

    return (
        <div className="slider-viewport">
            <div className="logo-scroll-container">
                {/* 4. ใช้ Style เพื่อเลื่อน slider-track 
            (นี่เป็นวิธีหนึ่งในการทำ Slider โดยใช้ CSS transform)
            (คุณอาจต้องปรับ style.css ของคุณให้ .slider-track มี display: flex)
        */}
                <div
                    className="slider-track"
                    style={{
                        display: 'flex', // บังคับให้ grid เรียงต่อกัน
                        transform: `translateX(-${activeGrid * 100}%)`, // เลื่อนไปตาม State
                        transition: 'transform 0.5s ease-in-out' // เพิ่ม Animation
                    }}
                >
                    {/* Grid ที่ 1 (Slide 1) */}
                    <div className="slider-grid" style={{ width: '100%', flexShrink: 0 }}>
                        <div className="awards-grid">
                            <div className="award-item">
                                <div className="award-image-box">
                                    <AwardImage src="รางวัล1.png" alt="Accredited Veterinary Hospital" />
                                </div>
                                <div className="award-text">
                                    <h3>การรับรองมาตรฐานสถานพยาบาลสัตว์</h3>
                                    <p>Pawplan คลินิก ได้ผ่านการรับรองมาตรฐานสถานพยาบาลสัตว์ จากสภาวิชาชีพการสัตวแพทย์ มั่นใจได้ในความสะอาด ปลอดภัยของสถานที่ และเครื่องมือที่ทันสมัยตามหลักมาตรฐานสากล</p>
                                </div>
                            </div>
                            <div className="award-item">
                                <div className="award-image-box">
                                    <AwardImage src="รางวัล2.png" alt="Pet Owner's Choice Award" />
                                </div>
                                <div className="award-text">
                                    <h3>รางวัลคลินิกขวัญใจเจ้าของสัตว์เลี้ยง</h3>
                                    <p>ได้รับการโหวตจากเจ้าของสัตว์เลี้ยง ให้เป็นคลินิกที่ให้บริการยอดเยี่ยมและดูแลเอาใจใส่เสมือนเป็นสมาชิกในครอบครัว ประจำปี 2024 จากเว็บไซต์เกี่ยวกับสัตว์เลี้ยงชั้นนำ</p>
                                </div>
                            </div>
                            <div className="award-item">
                                <div className="award-image-box">
                                    <AwardImage src="รางวัล3.png" alt="Cat-Friendly Clinic" />
                                </div>
                                <div className="award-text">
                                    <h3>การรับรอง "คลินิกที่เป็นมิตรต่อแมว"</h3>
                                    <p>ได้รับการรับรองมาตรฐาน Gold จากองค์กร International Society of Feline Medicine - ISFM โดยมีการจัดสรรพื้นที่รอตรวจ ห้องตรวจ และขั้นตอนการรักษาที่ช่วยลดความเครียดให้แก่น้องแมวโดยเฉพาะ</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Grid ที่ 2 (Slide 2) */}
                    <div className="slider-grid" style={{ width: '100%', flexShrink: 0 }}>
                        <div className="awards-grid">
                            <div className="award-item">
                                <div className="award-image-box">
                                    <AwardImage src="รางวัล4.png" alt="Award" />
                                </div>
                                <div className="award-text">
                                    <h3>ทีมสัตวแพทย์ผู้เชี่ยวชาญเฉพาะทาง</h3>
                                    <p>ทีมสัตวแพทย์ของเราประกอบด้วยผู้เชี่ยวชาญที่ได้รับการรับรองวุฒิบัตรเฉพาะทางในด้านต่างๆ เช่น อายุรกรรม, ศัลยกรรมกระดูก, โรคผิวหนัง เพื่อการวินิจฉัยและการรักษาที่แม่นยำที่สุด</p>
                                </div>
                            </div>
                            <div className="award-item">
                                <div className="award-image-box">
                                    <AwardImage src="รางวัล5.png" alt="Award" />
                                </div>
                                <div className="award-text">
                                    <h3>มาตรฐานห้องปฏิบัติการ (Lab) ภายใน</h3>
                                    <p>ได้รับการรับรองมาตรฐานห้องปฏิบัติการ ISO สำหรับการตรวจเลือดและวินิจฉัยโรคภายในคลินิก ทำให้ได้ผลที่รวดเร็ว แม่นยำ และช่วยให้การรักษามีประสิทธิภาพสูงสุด</p>
                                </div>
                            </div>
                            <div className="award-item">
                                <div className="award-image-box">
                                    <AwardImage src="รางวัล6.png" alt="Award" />
                                </div>
                                <div className="award-text">
                                    <h3>รางวัลการบริการลูกค้ายอดเยี่ยม</h3>
                                    <p>ได้รับรางวัลด้านการบริการลูกค้าที่เป็นเลิศ จาก องค์กรประเมินผล สะท้อนถึงความมุ่งมั่นของเราในการสื่อสารที่ชัดเจน ให้ข้อมูลครบถ้วน และการให้บริการที่สร้างความประทับใจให้แก่เจ้าของสัตว์เลี้ยง</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 5. Pagination Dots (ปุ่มจุด) */}
            <div className="pagination-dots">
                <span
                    className={`dot ${activeGrid === 0 ? 'active' : ''}`} // เพิ่ม/ลบ class 'active'
                    onClick={() => handleDotClick(0)} // เพิ่ม onClick
                ></span>
                <span
                    className={`dot ${activeGrid === 1 ? 'active' : ''}`}
                    onClick={() => handleDotClick(1)}
                ></span>
            </div>
        </div>
    );
}