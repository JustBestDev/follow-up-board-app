# Follow-up Board

Web App สำหรับจัดการรายชื่อผุ้ติดต่อ สถานะ และวันติดตาม

## Tech Stack
- Next.js
- Typescript
- Prisma ใช้ PG Adeptor ด้วย
- Supabase PostgreSQL
- Better Auth
- Vitest ใช้ ui ด้วย

## Setup Roles
- ใช้ Package เวอร์ชั่น Stable ล่าสุด
- ห้ามใช้ Beta, Canary หรือ Exprimental version
- หากจำเป็นต้องเพิ่ม Package ให้ตรวจสอบความเข้ากันได้กับ Next.js

## Working Rules
- ทำเฉพาะงานที่ได้รับคำสั่งในแต่ละครั้ง
- ห้ามเพิ่ม Feature, Logic หรือ UI ที่ไม่ได้ระบุ
- ห้ามแก้ไขส่วนที่ไม่เกี่ยวข้องกับงานเดิมที่มีอยู่
- หากข้อมูลไม่พอหรือจำเป็นต้องขยายขอบเขต ให้ถามก่อนทำ
- ไม่ต้อง npm run build จะทดสอบเอง

## Access
- จะเข้าดูข้อหน้าภายในได้ ต้องเป็น User ที่ล็อคอินอยู่
- ผู้ใช้ที่ดู เพิ่มแก้ไข และลบได้ เฉพาะข้อมูลของ contact ตัวเอง