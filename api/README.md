# PawPlan Go API — สมาชิก นัดหมาย และโปรไฟล์

Go + Fiber API สำหรับสมัครสมาชิก เข้าสู่ระบบ นัดหมายของสมาชิก โปรไฟล์ และแจ้งเตือน ใช้ PostgreSQL และแยกชั้นงานตาม Clean Architecture หน้าเว็บใน `features/auth`, `features/appointments`, `features/profile` และ `features/notifications` เชื่อม API ชุดนี้แล้ว ส่วนแอดมินและ integrations อื่นยังใช้ Next.js API เดิมตามขอบเขตงาน

## โครงสร้างและทิศทาง dependency

```text
api/
├── cmd/
│   ├── server/main.go         # ประกอบ dependencies และเปิด HTTP server
│   └── migrate/main.go        # สร้าง/ปรับตารางด้วยคำสั่งแยก
├── internal/
│   ├── domain/auth.go         # User, Session และ errors ของระบบ
│   ├── usecase/auth.go        # กฎสมัครสมาชิก/login และ repository interfaces
│   ├── repository/postgres/  # SQL ที่ implement interfaces ของ usecase
│   ├── security/             # bcrypt password hashing
│   ├── transport/http/       # Fiber routes, handlers, DTOs และ HTTP errors
│   ├── config/               # อ่านและตรวจ environment variables
│   └── integration/          # ทดสอบ API ทั้ง flow กับ PostgreSQL
└── migrations/               # SQL migrations ที่มี version tracking
```

Flow ของ request: `HTTP handler → use case → repository interface → PostgreSQL implementation`

Use case ไม่ import Fiber หรือ pgx จึงทดสอบกฎธุรกิจด้วย repository จำลองได้ ส่วน `cmd/server` เป็นจุดที่นำ implementation จริงมาเชื่อมกัน Handler รับผิดชอบ HTTP และรูปแบบ JSON ส่วน repository รับผิดชอบ SQL

## รันในเครื่อง

ต้องมี Go ตามเวอร์ชันใน `go.mod` และ PostgreSQL ที่เปิดอยู่ รันคำสั่งจากโฟลเดอร์ `api/`:

```bash
cd api
go mod download
cp .env.example .env
go run ./cmd/migrate
go run ./cmd/server
```

Config อ่านจาก environment ของโปรเซสก่อน ตามด้วย `api/.env` และ `.env` ที่ root ตามลำดับ ตัวอย่าง `api/.env` ไม่กำหนด `DATABASE_URL` เพื่อใช้ค่าจาก root ที่ตั้งไว้แล้ว ไม่ต้องคัดลอกรหัสซ้ำ

ค่าปริยาย:

| ตัวแปร | ค่า |
| --- | --- |
| `DATABASE_URL` | ต้องมี; ใช้ PostgreSQL ในเครื่องระหว่างพัฒนา |
| `API_ADDR` | `127.0.0.1:8080` |
| `FRONTEND_ORIGIN` | `http://localhost:3000` |
| `APP_ENV` | `development`; ตั้ง `production` เพื่อใช้ Secure cookie และบังคับ frontend เป็น HTTPS |
| `COOKIE_SAME_SITE` | `lax` สำหรับ localhost/same-site; `none` สำหรับ cross-site ที่เปิด HTTPS และใช้ production |
| `TRUSTED_PROXIES` | ว่างโดยปริยาย; IP/CIDR ของ reverse proxy ที่เชื่อถือได้ คั่นด้วย comma เพื่ออ่าน `X-Forwarded-For` และจำกัดการ login ตาม IP จริง |

ถ้า `DATABASE_URL` มี `?schema=clinic` API และ migration จะแปลงเป็น `search_path="clinic"` โดยรักษาตัวพิมพ์เล็ก/ใหญ่ และไม่ fallback ไป `public` ชื่อ schema รองรับอักษร ASCII ตัวเลข และ underscore ความยาวไม่เกิน 63 ตัว เริ่มด้วยอักษรหรือ underscore ห้ามระบุ `schema` และ `search_path` พร้อมกัน ต้องสร้าง schema และให้สิทธิ์ก่อนรัน migration; ถ้า schema ไม่มีหรือเข้าถึงไม่ได้ migration จะหยุดก่อนสร้างตาราง

เฉพาะเครื่องที่เคยสร้าง PostgreSQL cluster ไว้ที่ `.local/postgres` แล้ว สามารถเปิดจาก root ด้วยคำสั่งนี้ได้ (โฟลเดอร์นี้ไม่ได้อยู่ใน repository):

```bash
pg_ctl -D .local/postgres -l .local/postgres.log start
```

Migration สร้างตาราง `User` ถ้ายังไม่มี และเพิ่ม `GoSession`, `GoMigration` รวมถึง unique index ของ email ที่ไม่แยกตัวพิมพ์เล็ก/ใหญ่ ทำงานใน transaction และรันซ้ำได้ ถ้ามี email ซ้ำต่างตัวพิมพ์อยู่แล้ว migration จะหยุดโดยไม่แก้ข้อมูลให้เอง Server ไม่รัน migration อัตโนมัติ ควรตรวจ `DATABASE_URL` ก่อนรันคำสั่ง migrate

ตาราง `User` ใช้ชื่อคอลัมน์และ bcrypt ให้เข้ากับของเดิม ส่วน session ของ Go แยกจาก iron-session ของ Next.js จึงต้อง login ใหม่ผ่าน Go API ระวัง `prisma db push` หลังจากนี้ เพราะ Prisma schema ยังไม่ได้ประกาศตาราง Go และอาจเสนอให้ลบทิ้ง

## API contract

Base URL: `http://localhost:8080`

| Method | Path | ผลลัพธ์ |
| --- | --- | --- |
| GET | `/api/health` | `200 {"status":"healthy"}` เมื่อฐานข้อมูลและ auth migration พร้อม; `503` เมื่อไม่พร้อม |
| POST | `/api/auth/register` | `201` พร้อมข้อมูลสมาชิก; ยังไม่ login อัตโนมัติ |
| POST | `/api/auth/login` | `200` พร้อมข้อมูลสมาชิกและ HttpOnly session cookie |
| GET | `/api/auth/me` | `200` พร้อมข้อมูลสมาชิก หรือ `401` เมื่อไม่มี session ที่ใช้ได้ |
| POST | `/api/auth/logout` | `204` เพิกถอน session ในฐานข้อมูลและลบ cookie |
| POST | `/api/appointments` | `201` จองนัดให้สมาชิกจาก session; รับ owner, phone, petName, petType, service, date, time, notes |
| GET | `/api/appointments/mine` | `200` รายการนัดของสมาชิกปัจจุบัน |
| PATCH | `/api/appointments/:id` | แก้ข้อมูล/เลื่อน/ยกเลิกนัดของตนเอง; ยืนยันได้เฉพาะนัดที่คลินิกเสนอ |
| PUT | `/api/profile` | แก้ name, email, phone, image และเปลี่ยน password เมื่อ currentPassword ถูกต้อง |
| GET | `/api/notifications` | รายการแจ้งเตือน 20 รายการล่าสุดของตนเอง |
| PATCH | `/api/notifications` | `204` อ่านแล้วด้วย `{ "id": 1 }` หรือ `{ "all": true }` |

JSON ของสมาชิกคือ `{ "id": 1, "email": "owner@example.test", "name": "Owner", "phone": "", "image": "", "lineUserId": "" }` ไม่มี password หรือ token ใน response body เปลี่ยนรหัสผ่านแล้ว session อื่นของ Go จะถูกเพิกถอน โดย session ที่ใช้แก้โปรไฟล์ยังใช้งานได้

Migration `002_appointments` เพิ่มตาราง Appointment/Notification เมื่อยังไม่มี และเพิ่ม index ของ userId/createdAt บนตารางเดิม รันซ้ำได้โดยรักษาข้อมูล นัดหมายใช้เวลาไทย UTC+7 และช่วงเวลาที่เลือกได้ในหน้าจอง ทุก mutation ตรวจเจ้าของจาก session และล็อกแถวก่อนเปลี่ยนสถานะ ไม่อนุญาตให้สมาชิกตั้ง completed/arrived หรือแก้นัดที่ยกเลิกแล้ว รูปโปรไฟล์จำกัด 1.5 MB; request ทั่วไปจำกัด 16 KiB และโปรไฟล์จำกัด 3 MiB

Errors ใช้ `{ "error": "ข้อความ" }`: `400` ข้อมูลไม่ถูกต้อง, `401` login/session ไม่ผ่าน, `403` origin ไม่ได้รับอนุญาต, `404` ไม่พบนัดของสมาชิก, `409` email ซ้ำ, `413` request ใหญ่เกินกำหนด, `415` ไม่ใช่ JSON, `429` เกินจำนวนครั้งที่อนุญาต, `500` ข้อผิดพลาดภายในที่ไม่เปิดเผยรายละเอียดฐานข้อมูล

การสมัครใหม่กำหนดรหัสผ่านอย่างน้อย 8 ตัวอักษร และไม่เกิน 72 bytes ตามข้อจำกัด bcrypt ส่วน login รองรับรหัสผ่านเก่าที่ยาวกว่า 72 bytes เพื่อให้บัญชีที่สร้างด้วย bcryptjs เดิมยังใช้งานได้ โดยยังจำกัดขนาด input/request การสมัครสมาชิกและ login จำกัดแยกกันที่ 10 ครั้งต่อนาทีต่อ IP ต่อโปรเซส

## ทดลองทีละขั้นด้วย curl

```bash
curl http://localhost:8080/api/health

curl -i http://localhost:8080/api/auth/register \
  -H 'Content-Type: application/json' \
  -d '{"email":"owner@example.test","password":"example-password-123","name":"Owner","phone":"0812345678"}'

curl -i -c /tmp/pawplan-go.cookies http://localhost:8080/api/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"email":"owner@example.test","password":"example-password-123"}'

curl -b /tmp/pawplan-go.cookies http://localhost:8080/api/auth/me

curl -i -X POST -b /tmp/pawplan-go.cookies \
  http://localhost:8080/api/auth/logout

# หลัง logout ต้องได้ 401 แม้ส่ง cookie เดิม
curl -i -b /tmp/pawplan-go.cookies http://localhost:8080/api/auth/me
```

Session เป็น token สุ่ม 32 bytes อายุ 7 วัน เก็บเฉพาะ SHA-256 ของ token ในฐานข้อมูล Cookie ใช้ HttpOnly, SameSite=Lax เป็นค่าเริ่มต้น และ path `/api` การ logout ลบ session จริง จึงไม่สามารถนำ token เดิมกลับมาใช้ได้ Session ที่หมดอายุถูกปฏิเสธ แต่ยังไม่มีงานล้างแถวที่หมดอายุอัตโนมัติ

Frontend ใช้ `credentials: 'include'` แล้ว ตั้ง `NEXT_PUBLIC_API_URL` ใน root `.env` ให้ชี้ API และใช้ hostname เดียวกัน (`localhost` ทั้ง frontend/API) ต่างกันเฉพาะ port เพื่อให้ Next.js integrations ที่เหลืออ่าน Go session cookie ได้ `GO_API_URL` เป็น URL ภายในสำหรับ adapter ของ LINE/อีเมล; การ deploy API คนละ site ต้องเพิ่ม adapter/reverse proxy ให้ cookie ไปถึง Next.js ก่อนใช้ integrations เหล่านี้

กรณี deploy frontend และ API คนละ site ให้เปิด HTTPS ที่ API (เช่นผ่าน reverse proxy) และตั้ง:

```env
APP_ENV=production
FRONTEND_ORIGIN=https://your-frontend.example
COOKIE_SAME_SITE=none
```

Cookie จะใช้ `SameSite=None; Secure` และทุก request ที่เปลี่ยนข้อมูล รวมถึง register/login/logout ต้องมี `Origin` ตรงกับ `FRONTEND_ORIGIN` แบบ exact match เพื่อป้องกัน CSRF Browser ส่ง header นี้ให้ตามปกติ ส่วน curl/Postman ในโหมดนี้ต้องเพิ่ม `-H 'Origin: https://your-frontend.example'` ไม่มีการใช้ wildcard กับ credentials โหมด localhost เดิมยังใช้ `lax` ได้ เบราว์เซอร์บางตัวอาจบล็อก third-party cookies แม้ตั้ง None แล้ว; การใช้ frontend/API แบบ same-site จะลดข้อจำกัดนี้

## ทดสอบ

```bash
go test -race ./...
go vet ./...
```

Integration test เป็น opt-in: ตั้ง `TEST_DATABASE_URL` ให้ชี้ไป PostgreSQL ในเครื่อง แล้วรัน:

```bash
go test -race ./internal/integration -v
```

Test สร้าง schema ชั่วคราวแยกจากข้อมูลแอป ทดสอบการแปลง `?schema=` กับ PostgreSQL จริง, migration ซ้ำ/ไม่มี schema, สมัคร, email ซ้ำ, login ผิด/ถูก, บัญชี bcryptjs เดิมที่มีรหัสผ่านยาว, cookie, password hash, token hash, logout และหมดอายุ แล้วลบเฉพาะ schema ของ test เมื่อจบ ไม่ยอมรับ remote database host ส่วน HTTP tests ตรวจ trusted/untrusted/missing Origin, CORS preflight และ cookie ของโหมด cross-site

## ขอบเขตที่คง API เดิม

แอดมินจัดการนัด แพทย์ บทความ ข้อมูลคลินิก ร้านค้า ติดต่อ LINE และอีเมลยังอยู่ใน Next.js และใช้ฐานข้อมูลเดียวกัน Go อ่านการเปลี่ยนสถานะ/แจ้งเตือนจากแอดมินเดิมได้ ส่วน LINE และอีเมลใช้ `backend/member-session.ts` ตรวจ session กับ Go ก่อนทำงาน งานนี้ไม่ได้ย้ายทุก API หรือเพิ่มระบบสิทธิ์แอดมินใหม่ การเปิดใช้งานหลาย instance ยังต้องพิจารณา shared rate-limit storage

เอกสารอ้างอิง: [Fiber v3](https://docs.gofiber.io/), [CORS](https://docs.gofiber.io/middleware/cors/), [SameSite/Secure cookies](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Set-Cookie), [PostgreSQL schemas](https://www.postgresql.org/docs/current/ddl-schemas.html)
