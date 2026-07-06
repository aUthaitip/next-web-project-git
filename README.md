🚀 Getting Started (สำหรับทีม)

1. Clone และติดตั้ง dependencies

bashgit clone <repo-url>
cd Final-Project
bun install

2. ตั้งค่า Environment Variables

bashcp .env.example .env

ค่า default ใน .env.example ใช้งานได้ทันทีสำหรับ local dev (ไม่ต้องขอ password จากใคร) ยกเว้นถ้าอยาก test ส่งอีเมลจริง ค่อยไปขอ Gmail App Password มาใส่ทีหลัง

3. รัน Database (MSSQL ผ่าน Docker)

ต้องติดตั้ง Docker Desktop ก่อน

bashdocker compose up -d

รอสักครู่ (~20-30 วิ) แล้วเช็คว่า container พร้อมใช้งาน:

bashdocker compose ps

ต้องเห็นสถานะ healthy


⚠️ ถ้า error port is already allocated แปลว่าเครื่องมี MSSQL หรือ container อื่นใช้ port 1433 อยู่แล้ว ให้แก้ docker-compose.yml เปลี่ยน port เป็น "1434:1433" แล้วแก้ DATABASE_URL ใน .env ให้ตรงกัน



4. Migrate Database Schema

bashbunx prisma migrate dev

5. รันโปรเจ็ค

bashbun dev

เปิด http://localhost:3000


📧 หมายเหตุเรื่องอีเมล

โปรเจ็คนี้ mock การส่งอีเมลไว้ตอน dev (MOCK_EMAIL=true ใน .env) เพื่อไม่ต้องขอ Gmail App Password จากทีม — เวลาทดสอบ contact form หรือ booking ให้เปิด terminal ที่รัน bun dev ไว้ดู จะเห็น log แบบนี้แทนการส่งจริง:

📧 [MOCK EMAIL] ------------------------------
To:       ...
Subject:  ...

ถ้าอยากทดสอบส่งอีเมลจริง ให้ตั้ง MOCK_EMAIL=false และใส่ EMAIL_USER / EMAIL_PASS (Gmail App Password) ของตัวเองใน .env

🛑 หยุดการทำงานของ Database

bashdocker compose down

(ข้อมูลใน database จะไม่หายเพราะเก็บใน Docker volume — หายเฉพาะถ้ารัน docker compose down -v)