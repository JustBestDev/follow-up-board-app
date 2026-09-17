import 'dotenv/config';
import { Pool } from 'pg';

const USER_ID = 'm8eDnMIAPBuIE8iIkMz1oA7du1xktUaN';

const contacts = [
  {
    name: 'คุณกิตติศักดิ์ เจริญพร',
    company: 'บริษัท นครเทค จำกัด',
    email: 'kittisak@nakorntech.co.th',
    phone: '081-987-6543',
    channel: 'LINE: kittisak_tech',
    interest: 'ซอฟต์แวร์ ERP',
    status: 'talking',
    followUp: '2026-09-18T10:30:00+07:00',
    note: 'โทรยืนยันใบเสนอราคา ERP รอบสุดท้าย',
  },
  {
    name: 'คุณชลธิชา วงศ์สวัสดิ์',
    company: 'AP Marketing Group',
    email: 'chon.ap@domain.com',
    phone: '089-234-5678',
    channel: 'อีเมล',
    interest: 'บริการดูแลการตลาด',
    status: 'new',
    followUp: '2026-09-19T13:00:00+07:00',
    note: 'ส่งตัวอย่างสัญญาจ้างและ SLA รอฝ่ายกฎหมาย',
  },
  {
    name: 'คุณวรเมธ ปัญญาดี',
    company: 'Freelance Designer',
    email: null,
    phone: '092-345-6789',
    channel: 'LINE: vorameth_p',
    interest: 'ต่ออายุ License รายปี',
    status: 'talking',
    followUp: '2026-09-18T15:00:00+07:00',
    note: 'ตามใบเสร็จต่ออายุ License',
  },
  {
    name: 'คุณณัฐกานต์ ศิริรัตน์',
    company: 'บริษัท บียอนด์ ซัพพลาย จำกัด',
    email: 'natthakan@beyondsupply.com',
    phone: '065-112-9988',
    channel: 'โทรศัพท์และอีเมล',
    interest: 'ระบบบริหารซัพพลายเชน',
    status: 'closed',
    followUp: '2026-09-20T09:00:00+07:00',
    note: 'เซ็นสัญญาและชำระงวดแรกแล้ว',
  },
  {
    name: 'คุณธนภัทร ธรรมศาสตร์',
    company: 'สตาร์ทอัพ โค้ดแล็บ',
    email: null,
    phone: '083-445-5667',
    channel: 'LINE: tnp_codelab',
    interest: 'Standard Pack',
    status: 'new',
    followUp: '2026-09-21T14:00:00+07:00',
    note: 'ขอดู Deck และใบราคาก่อนนัดเดโม',
  },
  {
    name: 'คุณมณีรัตน์ แสงทอง',
    company: 'ร้านแสงทองเบเกอรี่',
    email: 'maneerat@saengthong.example.com',
    phone: '086-123-4567',
    channel: 'โทรศัพท์',
    interest: 'ระบบจองคิวหน้าร้าน',
    status: 'closed',
    followUp: '2026-09-17T11:00:00+07:00',
    note: 'ปิดงานหลังติดตั้งระบบจองคิว',
  },
  {
    name: 'คุณเอกราช สุขสำราญ',
    company: 'สุขสำราญ โลจิสติกส์',
    email: 'ekkarat@suksamran.example.com',
    phone: '081-234-5678',
    channel: 'LINE: ekkarat_s',
    interest: 'ระบบสต็อกสินค้า',
    status: 'new',
    followUp: '2026-09-22T10:00:00+07:00',
    note: 'สนใจระบบสต็อก เพิ่มเข้าคิวรอติดตาม',
  },
  {
    name: 'คุณปรียา วงศ์จันทร์',
    company: 'Priya Clinic',
    email: null,
    phone: '089-876-5432',
    channel: 'โทรศัพท์',
    interest: 'ระบบนัดหมายคนไข้',
    status: 'talking',
    followUp: '2026-09-19T16:30:00+07:00',
    note: 'คุยเรื่องแพ็กเกจคลินิก รอตัดสินใจ',
  },
  {
    name: 'คุณสมชาย ใจดี',
    company: 'ใจดี การเกษตร',
    email: 'somchai@jaidee.example.com',
    phone: '082-345-6789',
    channel: 'อีเมล',
    interest: 'ระบบบัญชีฟาร์ม',
    status: 'new',
    followUp: '2026-09-23T09:30:00+07:00',
    note: 'ขอใบเสนอราคาระบบบัญชี',
  },
  {
    name: 'คุณอรอนงค์ พิทักษ์',
    company: 'อรอนงค์ บูทีค',
    email: null,
    phone: '084-567-8901',
    channel: 'LINE: aun_boutique',
    interest: 'ระบบสมาชิกสะสมแต้ม',
    status: 'talking',
    followUp: '2026-09-20T14:00:00+07:00',
    note: 'นัดเดโมระบบสะสมแต้ม',
  },
  {
    name: 'คุณวิชัย เก่งมาก',
    company: 'เก่งมาก เอ็นจิเนียริ่ง',
    email: 'wichai@kengmak.example.com',
    phone: '085-678-9012',
    channel: 'โทรศัพท์และอีเมล',
    interest: 'ระบบใบงานซ่อมบำรุง',
    status: 'closed',
    followUp: '2026-09-16T13:00:00+07:00',
    note: 'ปิดงานหลังอบรมทีมช่าง',
  },
  {
    name: 'คุณนภา ดาวเรือง',
    company: 'ดาวเรือง โฮมสเตย์',
    email: 'napha@daorueang.example.com',
    phone: '087-789-0123',
    channel: 'LINE: napha_stay',
    interest: 'ระบบจองห้องพัก',
    status: 'new',
    followUp: '2026-09-24T11:00:00+07:00',
    note: 'เพิ่งทักมา สนใจระบบจองห้อง',
  },
];

(async () => {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  try {
    let inserted = 0;
    for (const contact of contacts) {
      const existing = await pool.query('SELECT id FROM contact WHERE "userId" = $1 AND name = $2 LIMIT 1', [USER_ID, contact.name]);
      if (existing.rowCount > 0) continue;
      await pool.query(
        'INSERT INTO contact (id, "userId", name, company, email, phone, channel, interest, status, "followUp", note, "createdAt", "updatedAt") VALUES (gen_random_uuid(),$1,$2,$3,$4,$5,$6,$7,$8,$9,$10,now(),now())',
        [USER_ID, contact.name, contact.company, contact.email, contact.phone, contact.channel, contact.interest, contact.status, contact.followUp, contact.note],
      );
      inserted += 1;
    }
    console.log(`seeded ${inserted} new contacts for user ${USER_ID} (skipped ${contacts.length - inserted} existing)`);
  } finally {
    await pool.end();
  }
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
