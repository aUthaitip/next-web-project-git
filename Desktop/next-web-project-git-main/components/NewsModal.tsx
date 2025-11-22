// components/Modal.tsx

'use client'; // ต้องเป็น Client Component เพื่อรับ event onClick

export default function Modal({ onClose, children }: { onClose: () => void, children: React.ReactNode }) {
    return (
        // เมื่อ Component นี้ถูก Render (เพราะ state ใน page.js เป็น true)
        // ให้มันมีคลาส 'modal' และ 'is-visible' พร้อมกันเลย
        // CSS ของคุณจะจัดการที่เหลือเอง (ทำให้มันแสดงผลและมี animation)
        <div className="modal is-visible">

            {/* คลิกที่พื้นหลังสีเทาเพื่อปิด */}
            <div className="modal-overlay" onClick={onClose}></div>

            <div className="modal-content">
                {/* คลิกที่ปุ่มกากบาทเพื่อปิด */}
                <span className="modal-close" onClick={onClose}>&times;</span>

                {/* 'children' คือเนื้อหาทั้งหมดที่ถูกส่งมา */}
                {children}
            </div>
        </div>
    );
}