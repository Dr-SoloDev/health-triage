# AI Health Triage

ระบบคัดกรองสุขภาพด้วย AI สำหรับชุมชน

> ⚠️ **BETA** — เครื่องมือนี้เป็นการประเมินเบื้องต้นเท่านั้น ไม่ใช่การวินิจฉัยทางการแพทย์ ไม่สามารถใช้แทนการพบแพทย์

## Overview

AI Health Triage ช่วยคัดกรองอาการเจ็บป่วยเบื้องต้นสำหรับประชาชนทั่วไป โดยเฉพาะในพื้นที่ที่เข้าถึงบริการสาธารณสุขได้ยาก ออกแบบมาเพื่อช่วย อสม. (อาสาสมัครสาธารณสุขประจำหมู่บ้าน) คัดกรองผู้ป่วยในชุมชนอย่างมีประสิทธิภาพ

## Features (MVP)

- 🤖 AI ซักประวัติอาการภาษาไทย
- 🚦 คัดกรอง 3 ระดับ (🟢 เขียว / 🟡 เหลือง / 🔴 แดง)
- 📊 Dashboard สำหรับ อสม. ดูเคสในพื้นที่
- 🔒 ระบบประเมิน 2 ชั้น (AI + เจ้าหน้าที่)

## Tech Stack

- **API:** Node.js + Fastify
- **AI:** Claude API (Anthropic)
- **Mobile:** React Native (PWA)
- **Dashboard:** React Web
- **Database:** Supabase (Phase 2)

## Project Structure

```
health-triage/
├── apps/
│   ├── mobile/          # React Native app สำหรับผู้ใช้ทั่วไป
│   └── dashboard/       # React Web สำหรับ อสม.
├── packages/
│   ├── api/             # Fastify API server + AI engine
│   └── shared/          # Shared types & utilities
└── docs/                # Documentation
```

## Getting Started

```bash
# Install dependencies
npm install

# Setup environment
cp packages/api/.env.example packages/api/.env
# แก้ไข .env ใส่ ANTHROPIC_API_KEY

# Run API server
npm run dev:api
```

## Team

- **Dr.Solodev** — Creator, Full-Cycle Developer
- **Turbo (เทอโบ)** — AI Agent, Co-developer (OpenClaw)

## License

MIT — หลังผ่าน MVP testing จะเปิด open source ให้ทุกคนใช้ได้

---

*สร้างด้วยความตั้งใจที่จะช่วยคนที่เข้าถึงบริการสาธารณสุขได้ยาก*
