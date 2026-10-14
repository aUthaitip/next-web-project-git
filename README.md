# PawPlan — ระบบจัดการคลินิกสัตว์เลี้ยง

[ดูเว็บไซต์ที่ deploy แล้ว](https://pawplan-vet-clinic.vercel.app/th)

PawPlan คือเว็บแอปพลิเคชันสำหรับคลินิกสัตว์เลี้ยงขนาดเล็ก ที่ช่วยให้เจ้าของสัตว์เลี้ยงเข้าถึงข้อมูลคลินิก จองนัดหมาย และติดตามนัดหมายของตนเองได้สะดวก ขณะเดียวกันทีมคลินิกสามารถจัดการนัดหมาย แพทย์ และเนื้อหาเว็บไซต์ผ่าน Admin Dashboard ได้จากที่เดียว

## ฟีเจอร์หลัก

- **About Us** — นำเสนอประวัติและพันธกิจของคลินิก รางวัล/การรับรอง และข่าวสารหรือกิจกรรม
- **Appointment Booking** — ฟอร์มจองนัดหมายแบบเป็นขั้นตอน เลือกบริการ วันที่ และช่วงเวลา พร้อมดูหรือจัดการนัดหมายของผู้ใช้
- **Shop** — หน้ารวมสินค้าแนะนำสำหรับสัตว์เลี้ยง เชื่อมต่อการสั่งซื้อผ่าน LINE Official Account
- **Articles** — บทความแยกหมวดสุนัข แมว และเคล็ดลับสุขภาพ พร้อมตัวกรองหมวดหมู่
- **Admin Dashboard** — ศูนย์กลางสำหรับติดตามภาพรวมและจัดการนัดหมาย แพทย์ บทความ และเนื้อหา About Us
- **Bilingual UI** — สลับการแสดงผลระหว่างภาษาไทยและภาษาอังกฤษ

## ส่วนที่ร่วมพัฒนา

โปรเจกต์นี้พัฒนาโดยทีม 2 คน โดยแบ่งหน้าที่หลักระหว่าง Frontend และ Backend พร้อมทำงานร่วมกันในส่วนที่ต้องเชื่อมต่อกัน

**Frontend Developer**

- ออกแบบและพัฒนา UI ของหน้าสาธารณะให้สื่อสารข้อมูลคลินิกได้ชัดเจนและมีภาพลักษณ์สอดคล้องกัน
- สร้างหน้าจอและองค์ประกอบสำหรับการจองนัดหมาย ร้านค้า บทความ และการจัดการข้อมูล
- พัฒนา Responsive UI, interactive states, modal และองค์ประกอบนำทางให้ใช้งานได้ดีบนหลายขนาดหน้าจอ

**Backend Developer**

- พัฒนา API และจัดการการเชื่อมต่อฐานข้อมูลสำหรับข้อมูลผู้ใช้ สัตว์เลี้ยง นัดหมาย และเนื้อหา
- ดูแลระบบ authentication, session และการเชื่อมต่อบริการภายนอก เช่น LINE และอีเมล
- พัฒนาส่วนจัดการข้อมูลสำหรับ Admin Dashboard

**ทำงานร่วมกัน**

- วางโครงสร้างฟีเจอร์และรูปแบบการรับส่งข้อมูลระหว่าง UI กับ API
- เชื่อมต่อหน้าจอเข้ากับข้อมูลจริง ทดสอบการทำงาน และปรับปรุงประสบการณ์ใช้งานร่วมกัน

## Tech Stack

| Frontend | Backend และบริการของระบบ |
| --- | --- |
| Next.js, React, TypeScript | Next.js Route Handlers, Prisma ORM |
| Tailwind CSS, CSS, shadcn/ui | PostgreSQL |
| Framer Motion, Lucide React | Authentication และ session management |
| Responsive design และ i18n (TH/EN) | LINE Login / Messaging API, Nodemailer |

## Screenshots

<p align="center">
  <img src="docs/screenshots/home.png" alt="หน้าแรก PawPlan แสดงภาพรวมบริการคลินิก" width="49%" />
  <img src="docs/screenshots/shop.png" alt="หน้า PawPlan Shop สำหรับเลือกซื้อสินค้าผ่าน LINE Official Account" width="49%" />
</p>

<p align="center">
  <img src="docs/screenshots/appointment-booking.png" alt="ฟอร์มจองนัดหมาย PawPlan" width="70%" />
</p>

## เริ่มต้นใช้งาน

### สิ่งที่ต้องมี

- [Bun](https://bun.sh/) เวอร์ชันปัจจุบัน
- PostgreSQL database หรือโปรเจกต์ Supabase ที่เข้าถึงได้

### 1. ติดตั้ง dependencies

```bash
git clone <repo-url>
cd <repository-directory>
bun install
```

### 2. ตั้งค่า environment variables

คัดลอกไฟล์ตัวอย่าง แล้วกำหนดค่าเชื่อมต่อ PostgreSQL ของตนเองใน `.env`

```bash
cp .env.example .env
```

อย่างน้อยต้องตั้งค่า `DATABASE_URL` และ `DIRECT_URL` ให้ชี้ไปยัง PostgreSQL database เดียวกัน ตัวอย่างสำหรับ local PostgreSQL:

```env
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/pawplan?schema=public"
DIRECT_URL="postgresql://USER:PASSWORD@localhost:5432/pawplan?schema=public"
```

สำหรับการพัฒนาในเครื่อง สามารถคง `MOCK_EMAIL=true` เพื่อให้ระบบแสดงรายละเอียดอีเมลใน terminal แทนการส่งอีเมลจริงได้

### 3. สร้าง schema ในฐานข้อมูล

```bash
bunx prisma db push
```

### 4. รันโปรเจกต์

```bash
bun dev
```

เปิด [http://localhost:3000](http://localhost:3000) ในเบราว์เซอร์

## การตั้งค่าอีเมลจริง (ไม่บังคับ)

หากต้องการทดสอบการส่งอีเมลจริง ให้ตั้ง `MOCK_EMAIL=false` และกำหนดค่า `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER` และ `SMTP_PASS` ใน `.env` ด้วยข้อมูล SMTP ของตนเอง ห้ามนำรหัสผ่านหรือ API keys จริงมาใส่ใน repository
