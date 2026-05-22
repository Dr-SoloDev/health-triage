# Agent Brain — health-triage

โฟลเดอร์นี้คือ "สมอง" ของ AI agent ที่ทำงานในโปรเจกต์นี้
ใช้ได้กับทุก harness: Claude Code, Cursor, Windsurf, OpenClaw ฯลฯ

---

## เริ่ม session ใหม่ — อ่านตามลำดับนี้

1. `memory/personal/PREFERENCES.md` — วิธีทำงานของ user
2. `memory/working/WORKSPACE.md` — งานที่กำลังทำอยู่
3. `memory/working/REVIEW_QUEUE.md` — บทเรียนที่รอ review
4. `memory/semantic/LESSONS.md` — บทเรียนที่ผ่านการ approve แล้ว

---

## Memory

| ไฟล์ | หน้าที่ |
|------|---------|
| `memory/personal/PREFERENCES.md` | preference และ convention ของ user |
| `memory/working/WORKSPACE.md` | งานปัจจุบัน — อัปเดตระหว่างทำงาน ล้างเมื่อเสร็จ |
| `memory/working/REVIEW_QUEUE.md` | candidate lessons รอ review |
| `memory/semantic/DECISIONS.md` | การตัดสินใจสถาปัตยกรรมที่ผ่านมา |
| `memory/semantic/LESSONS.md` | บทเรียนที่ distill แล้ว (render จาก `lessons.jsonl`) |
| `memory/episodic/AGENT_LEARNINGS.jsonl` | raw experience log |

---

## Skills

- `skills/_index.md` — ดูรายการ skill ทั้งหมดก่อน
- `skills/_manifest.jsonl` — metadata แบบ machine-readable
- โหลด `SKILL.md` เฉพาะ skill ที่ trigger ตรงกับงานปัจจุบัน

---

## Protocols

- `protocols/permissions.md` — อ่านก่อนทุก tool call
- `protocols/tool_schemas/` — typed interfaces สำหรับ external tools
- `protocols/delegation.md` — กฎการส่งงานให้ sub-agent

---

## CLI Tools (ใน `tools/`)

| คำสั่ง | ใช้เมื่อ |
|--------|---------|
| `recall.py "<intent>"` | **รันก่อนเสมอ** เมื่อจะ deploy / migrate / debug / refactor |
| `learn.py "<rule>" --rationale "<why>"` | สอน agent กฎใหม่ทันที |
| `show.py` | ดูภาพรวม brain state ทั้งหมดในหน้าเดียว |
| `memory_reflect.py <skill> <action> <outcome>` | log เหตุการณ์สำคัญ |
| `list_candidates.py` | ดู candidate lessons รอ review |
| `graduate.py <id> --rationale "..."` | approve candidate |
| `reject.py <id> --reason "..."` | reject candidate |

---

## Review Queue

ถ้า `REVIEW_QUEUE.md` มี pending > 10 หรือ oldest > 7 วัน
→ review ก่อนเริ่มงานใหม่เสมอ

ขั้นตอน:
1. `python .agent/tools/list_candidates.py`
2. พิจารณาแต่ละ candidate — accept / reject / defer
3. `graduate.py` หรือ `reject.py` พร้อม rationale
4. review เป็น batch ไม่ใช่ทีละอัน

---

## กฎที่ต้องทำตามเสมอ

1. เช็ค memory ก่อนตัดสินใจในเรื่องที่เคยถูก correct มาก่อน
2. รัน `recall.py` ก่อน deploy / migration / debug ทุกครั้ง
3. Log ทุก action สำคัญผ่าน `memory_reflect.py`
4. อัปเดต `WORKSPACE.md` ระหว่างทำงาน ล้างเมื่อเสร็จ
5. **ห้าม** แก้ `LESSONS.md` ด้วยมือ — ใช้ `graduate.py` เท่านั้น
6. ทำตาม `protocols/permissions.md` เสมอ — blocked คือ blocked
