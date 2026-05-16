# AI Health Triage 🏥

ระบบคัดกรองสุขภาพด้วย AI สำหรับชุมชน — ช่วย อสม. และประชาชนในพื้นที่ห่างไกลคัดกรองอาการเบื้องต้นก่อนพบแพทย์

> ⚠️ **BETA** — เครื่องมือนี้เป็นการประเมินเบื้องต้นเท่านั้น ไม่ใช่การวินิจฉัยทางการแพทย์

---

## สถานะปัจจุบัน (อัปเดต: 16 พฤษภาคม 2026)

| ส่วน | สถานะ | หมายเหตุ |
|------|--------|----------|
| `packages/api` | ✅ พร้อมใช้งาน | Fastify + Claude AI, รันได้จริง |
| `packages/shared` | ✅ พร้อมใช้งาน | constants ระดับสี triage |
| `apps/mobile` | ✅ เสร็จแล้ว | React PWA ครบ 3 หน้า |
| `apps/dashboard` | ❌ ยังไม่มีโค้ด | โฟลเดอร์ว่าง รอสร้าง |
| Database | ⚠️ In-memory เท่านั้น | restart แล้วข้อมูลหาย — ต้องเชื่อม Supabase |

---

## Tech Stack

- **API:** Node.js + Fastify
- **AI:** Claude API (Anthropic) — ใช้ `claude-sonnet-4-20250514`
- **Mobile:** React + Vite (PWA) — `apps/mobile`
- **Dashboard:** React Web (ยังไม่สร้าง) — `apps/dashboard`
- **Database:** In-memory (MVP) → Supabase (Phase 2)

---

## โครงสร้างโปรเจกต์

```
health-triage/
├── packages/
│   ├── api/                     # Fastify API server + AI engine
│   │   └── src/
│   │       ├── index.js         # entry point, port 3000
│   │       └── routes/
│   │           ├── triage.js    # POST /api/triage/start, /api/triage/chat
│   │           └── dashboard.js # GET/POST /api/dashboard/cases, /summary, PATCH /review
│   └── shared/
│       └── src/index.js         # TRIAGE_LEVELS, TRIAGE_LABELS constants
└── apps/
    ├── mobile/                  # PWA React app สำหรับผู้ใช้ทั่วไป
    │   └── src/screens/
    │       ├── StartScreen.jsx  # กรอกชื่อ/อายุ/หมู่บ้าน
    │       ├── ChatScreen.jsx   # chat กับ AI ซักอาการ
    │       └── ResultScreen.jsx # แสดงผล 🟢🟡🔴 + คำแนะนำ
    └── dashboard/               # ❌ ยังไม่มีโค้ด — สร้าง React Web สำหรับ อสม.
```

---

## API Endpoints

### Triage (สำหรับ mobile app)

```
POST /api/triage/start
  body: { userId, name, age, village }
  return: { sessionId, message, level: null, complete: false }

POST /api/triage/chat
  body: { sessionId, messages, userMessage }
  return: { sessionId, message, level, complete, result, messages }
  # เมื่อ complete: true จะมี result: { level, summary, reason, advice, symptoms }
```

### Dashboard (สำหรับ อสม.)

```
GET  /api/dashboard/cases?village=xxx&level=red
POST /api/dashboard/cases         # บันทึกผลการคัดกรอง
PATCH /api/dashboard/cases/:id/review  # อสม. ประเมินซ้ำ
GET  /api/dashboard/summary       # สรุปรายวัน (red/yellow/green/reviewed/pending)
```

---

## วิธีรันในเครื่อง

```bash
# 1. setup environment
cp packages/api/.env.example packages/api/.env
# แก้ไขใส่ ANTHROPIC_API_KEY=sk-ant-...

# 2. install dependencies
npm install

# 3. รัน API server (port 3000)
npm run dev:api

# 4. รัน mobile app (port 5173) — terminal อีกหน้าต่าง
npm run dev:mobile
```

Mobile app จะ proxy `/api` → `localhost:3000` อัตโนมัติ (config ใน `vite.config.js`)

---

## สิ่งที่ต้องทำต่อ (เรียงลำดับความสำคัญ)

### 1. 🔴 Dashboard สำหรับ อสม. (`apps/dashboard`)
สร้าง React Web app ที่ยังไม่มีเลย โดยใช้ API ที่มีอยู่แล้วครบ:
- ตารางรายการเคสทั้งหมด (เรียงตามความเร่งด่วน แดง > เหลือง > เขียว)
- ฟิลเตอร์ตามหมู่บ้าน / ระดับ
- หน้า review เคส — อสม. ประเมินซ้ำและเขียน note
- สรุปรายวัน (dashboard stats)

### 2. 🟡 เชื่อม Supabase (database ถาวร)
ตอนนี้ `dashboard.js` ใช้ `const cases = []` (in-memory) — restart แล้วหายหมด
- สร้าง table `cases` ใน Supabase
- แทนที่ array ด้วย Supabase client
- เพิ่ม `SUPABASE_URL` และ `SUPABASE_ANON_KEY` ใน `.env`

### 3. 🟡 อัปเกรด Claude model
`triage.js:64` ยังใช้ `claude-sonnet-4-20250514` (เวอร์ชันเก่า)
เปลี่ยนเป็น `claude-sonnet-4-6` หรือ `claude-opus-4-7` ตาม budget

### 4. 🟢 PWA Icons จริง
`public/manifest.json` อ้างถึง `icon-192.png` และ `icon-512.png` ที่ยังไม่มี
สร้าง/ใส่ icon รูปจริงเพื่อให้ติดตั้งบน homescreen ได้สมบูรณ์

### 5. 🟢 Session persistence บน mobile
ตอนนี้ถ้า user ปิด browser ระหว่างคุย จะเริ่มใหม่ทั้งหมด
เพิ่ม `sessionStorage` หรือ `localStorage` เก็บ messages ไว้ชั่วคราว

---

## ข้อควรรู้สำหรับ agent ที่มาต่อ

- **Model ID ปัจจุบัน:** `claude-sonnet-4-20250514` อยู่ใน `packages/api/src/routes/triage.js:64`
- **In-memory store:** `cases` array อยู่ใน `packages/api/src/routes/dashboard.js:5` — ต้องแทนด้วย DB
- **Proxy config:** mobile app ต้องรันคู่กับ API เสมอ (port 3000) — ดู `apps/mobile/vite.config.js`
- **ไม่มี auth เลย** — ทุก endpoint เปิด public ตั้งใจไว้สำหรับ MVP ในพื้นที่ปิด
- **Package manager:** npm workspaces — รัน `npm install` จาก root ได้เลย

---

## Team

- **Dr.Solodev** — Creator, Full-Cycle Developer
- **Turbo (เทอโบ)** — AI Agent, Co-developer (OpenClaw)
- **Claude** — AI Agent, Co-developer (Claude Code)

## License

MIT — หลังผ่าน MVP testing จะเปิด open source ให้ทุกคนใช้ได้

---

*สร้างด้วยความตั้งใจที่จะช่วยคนที่เข้าถึงบริการสาธารณสุขได้ยาก*

