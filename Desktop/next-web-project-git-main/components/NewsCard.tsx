// components/NewsCard.stx

"use client"; // this component uses event handlers and must be a Client Component

import Image from 'next/image';

interface NewsCardProps {
    imgSrc: string;
    imgAlt: string;
    title: string;
    description: string;
    onOpen: () => void;
}

// รับ props 5 ตัว
export default function NewsCard({ imgSrc, imgAlt, title, description, onOpen }: NewsCardProps) {
    return (
        <article className="news-card">
            <div className="card-image">

                <Image src={imgSrc} alt={imgAlt} width={400} height={300} style={{ width: '100%', height: 'auto', objectFit: 'cover' }} />
            </div>
            <div className="card-content">
                <h3 className="card-title">{title}</h3>
                <p className="card-description">{description}</p>

                <a
                    href="#"
                    className="card-link"
                    onClick={(e) => {
                        e.preventDefault(); // ป้องกันหน้าเว็บเลื่อนขึ้น
                        onOpen(); // เรียกฟังก์ชันที่ส่งมาจาก parent เพื่อเปิด Modal
                    }}
                >
                    ดูเพิ่มเติม
                </a>
            </div>
        </article>
    );
}