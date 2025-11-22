// app/login/page.tsx
'use client';
import { useState } from 'react';
import Link from 'next/link';

// โค้ดที่รวม logic การ Login จาก script.js
export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault(); 

        const adminEmail = "Pawplan@gmail.com";
        const adminPassword = "123456789";
        const targetPage = "/admin"; 

        if (email.trim() === adminEmail && password.trim() === adminPassword) {
            setError(false);
            alert("เข้าสู่ระบบแอดมินสำเร็จ! กำลังนำทางไปหน้าแผงควบคุม");
            window.location.href = targetPage;
        } else {
            setError(true);
        }
    };

    return (
        <section className="content-section login-page" style={{ backgroundColor: 'var(--bg-light)', padding: '80px 0' }}>
            <div className="container">
                <div className="login-container">
                    <h2>เข้าสู่ระบบ Pawplan <br />(สำหรับเจ้าหน้าที่)</h2>
                    
                    <div id="errorMessage" style={{ color: '#dc3545', marginBottom: '15px', fontWeight: 600, display: error ? 'block' : 'none' }}>
                        อีเมลหรือรหัสผ่านไม่ถูกต้อง กรุณาลองใหม่อีกครั้ง
                    </div>
                    
                    <form className="login-form" onSubmit={handleSubmit}>
                        <label htmlFor="email">email </label>
                        <input type="email" id="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
                        
                        <label htmlFor="password">password</label>
                        <input type="password" id="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
                        
                        <button type="submit">เข้าสู่ระบบ</button>
                    </form>
                    <div className="register-link">
                        <a href="#">ลืมรหัสผ่าน?</a>
                    </div>
                </div>
            </div>
        </section>
    );
}