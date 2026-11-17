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
| Next.js, React, TypeScript | Go + Fiber (Clean Architecture), Next.js Route Handlers, Prisma ORM |
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

### โครงสร้าง Full Stack และขอบเขต Go API

ขอบเขตที่ย้ายไป **Go + Fiber / Clean Architecture** คือสมาชิก, นัดหมายฝั่งสมาชิก, โปรไฟล์ และการอ่านแจ้งเตือนของสมาชิก หน้าเว็บเรียก Go API โดยตรงผ่าน `features/*/api.ts` และ `lib/api-client.ts` ส่วนแอดมิน คอนเทนต์ แพทย์ ร้านค้า ติดต่อ LINE และอีเมลยังใช้ Next.js API เดิม โดย LINE/อีเมลตรวจผู้ใช้ผ่าน Go session ดู contract และวิธีตั้งค่าใน [คู่มือ Go API](api/README.md)

Frontend ใช้ **feature-based architecture**:

```text
app/                         # Next.js routes และ layouts
features/
  auth/                      # components, data, api.ts, types.ts
  appointments/              # pages, components, data, api.ts, types.ts
  profile/                   # components, data, api.ts
  notifications/             # api.ts, types.ts
  admin/                     # pages, components และ layouts ของแอดมิน (API เดิม)
  home/, about/, articles/, doctors/, shop/, petcare/
shared/layouts/              # DocumentLayout และ SiteLayout
shared/components/layout/    # Header, Footer, ScrollToTop ที่ใช้ร่วมกัน
shared/data/layout/          # ข้อความของ Header/Footer
lib/api-client.ts            # HTTP client สำหรับ Go API และการจัดการ errors
api/internal/domain/         # entities และ domain errors
api/internal/usecase/        # กฎธุรกิจและ repository interfaces
api/internal/repository/     # PostgreSQL implementations
api/internal/transport/http/ # Fiber handlers และ HTTP DTOs
```

รันสองโปรเซสคู่กัน หลังตั้งค่า PostgreSQL แล้ว:

```bash
# Terminal 1
cd api
go run ./cmd/migrate
go run ./cmd/server

# Terminal 2 — จาก root โปรเจกต์
bun dev
```

เปิด `http://localhost:3000/th/login` สมัคร → login → จอง → ดู/แก้/เลื่อน/ยกเลิกนัด → แก้โปรไฟล์ → logout ตั้ง `NEXT_PUBLIC_API_URL=http://localhost:8080/api` ใน root `.env` (เป็นค่าปริยายอยู่แล้ว) และใช้ hostname `localhost` เหมือนกันทั้งเว็บ/API เพื่อให้ cookie ใช้งานร่วมกับ LINE/อีเมลเดิมได้ สมาชิกต้อง login ใหม่ผ่าน Go; session เดิมของ Next.js ไม่ถูกนำมาใช้

### สิ่งที่ต้องมี

- [Bun](https://bun.sh/) เวอร์ชันปัจจุบัน
- Go ตามเวอร์ชันใน [`api/go.mod`](api/go.mod)
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
cp api/.env.example api/.env
```

อย่างน้อยต้องตั้งค่า `DATABASE_URL` และ `DIRECT_URL` ให้ชี้ไปยัง PostgreSQL database เดียวกัน ตัวอย่างสำหรับ local PostgreSQL:

```env
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/pawplan?schema=public"
DIRECT_URL="postgresql://USER:PASSWORD@localhost:5432/pawplan?schema=public"
```

สำหรับการพัฒนาในเครื่อง สามารถคง `MOCK_EMAIL=true` เพื่อให้ระบบแสดงรายละเอียดอีเมลใน terminal แทนการส่งอีเมลจริงได้

### 3. สร้าง schema ในฐานข้อมูล

สำหรับฐานข้อมูลใหม่ ให้สร้างตารางเดิมก่อน แล้วเพิ่มตารางของ Go ตามลำดับนี้:

```bash
bunx prisma db push
cd api
go run ./cmd/migrate
```

ถ้าฐานข้อมูลมี GoSession/GoMigration แล้ว ให้ใช้ migration ของ Go สำหรับส่วนสมาชิกและนัดหมาย ไม่รัน `prisma db push --accept-data-loss` เพราะ Prisma schema เดิมยังไม่ได้ประกาศตาราง Go

### 4. รันโปรเจกต์

```bash
# Terminal 1 — จาก api/
go run ./cmd/server

# Terminal 2 — จาก root
bun dev
```

เปิด [http://localhost:3000](http://localhost:3000) ในเบราว์เซอร์

## การตั้งค่าอีเมลจริง (ไม่บังคับ)

หากต้องการทดสอบการส่งอีเมลจริง ให้ตั้ง `MOCK_EMAIL=false` และกำหนดค่า `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER` และ `SMTP_PASS` ใน `.env` ด้วยข้อมูล SMTP ของตนเอง ห้ามนำรหัสผ่านหรือ API keys จริงมาใส่ใน repository

## Deploy บน Vercel และ Render

Vercel รัน Next.js และ API เดิม ส่วน Render รัน Go Fiber โดยใช้ฐานข้อมูล PostgreSQL ออนไลน์เดียวกัน `.vercelignore` ตัดเฉพาะโฟลเดอร์ `/api/` ที่ root ออกจาก Vercel; `app/api/` ยังอยู่

1. Push ไฟล์ตั้งค่าไป branch `dev` แล้วเลือก **New → Blueprint** บน Render เชื่อม repo และ branch นี้ ไฟล์ `render.yaml` กำหนด Root Directory, build/start commands และ health check ไว้แล้ว โดยใช้ free plan และไม่สร้างฐานข้อมูลใหม่
2. ในขั้นตอนสร้าง Blueprint ใส่ `DATABASE_URL` ของฐานข้อมูลออนไลน์เดิม และ `FRONTEND_ORIGIN` เป็น origin ของเว็บจริง เช่น `https://ชื่อเว็บ.vercel.app` โดยไม่มี `/` ท้าย อย่าใช้ฐานข้อมูล localhost; start command จะรัน migration ในฐานข้อมูลที่ระบุก่อนเริ่ม server
3. เมื่อ Render deploy สำเร็จ เปิด `https://ชื่อบริการ.onrender.com/api/health` ต้องได้ `{"status":"healthy"}`
4. บน Vercel ตั้ง `NEXT_PUBLIC_API_URL=/api/go` และ `GO_API_URL=https://ชื่อบริการ.onrender.com/api` โดยใช้ URL จริงจาก Render คงค่า database, session และ integrations เดิมไว้ จากนั้น redeploy environment ที่จะใช้งาน
5. ตรวจ `https://ชื่อเว็บ.vercel.app/api/go/health` แล้วลองสมัคร/login/จอง/แก้โปรไฟล์/logout การทดสอบควรใช้โดเมนเดียวกับ `FRONTEND_ORIGIN`; preview URL อื่นจะไม่ผ่านการตรวจ Origin ของ Go

`next.config.ts` ส่ง `/api/go/:path*` ไปยัง `GO_API_URL/:path*` ด้วย external rewrite ดังนั้น browser รับ session cookie บนโดเมนเว็บ และ LINE/อีเมลของ Next.js อ่าน cookie เดียวกันได้ ใช้ `COOKIE_SAME_SITE=lax` และ `APP_ENV=production` ตาม Blueprint การเปลี่ยน URL ต้อง redeploy เพราะ rewrite และ `NEXT_PUBLIC_API_URL` ถูกกำหนดตอน build

อ้างอิง: [Render Blueprint](https://render.com/docs/blueprint-spec), [Next.js rewrites](https://nextjs.org/docs/app/api-reference/config/next-config-js/rewrites), [Vercel ignore](https://vercel.com/docs/deployments/vercel-ignore)
