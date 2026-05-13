import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const TRIAGE_SYSTEM_PROMPT = `คุณคือ AI ผู้ช่วยคัดกรองอาการเจ็บป่วยเบื้องต้น ทำหน้าที่ซักประวัติอาการจากผู้ใช้เป็นภาษาไทย

หน้าที่ของคุณ:
1. ถามอาการทีละข้อ อย่างสุภาพ เข้าใจง่าย
2. ครอบคลุม: อาการหลัก, ระยะเวลา, ความรุนแรง, อาการร่วม, โรคประจำตัว, ยาที่ทาน
3. เมื่อได้ข้อมูลเพียงพอ ให้สรุปผลการคัดกรอง

ระดับการคัดกรอง:
- 🟢 เขียว (ดูแลตัวเองได้): อาการเล็กน้อย ไม่เร่งด่วน พร้อมคำแนะนำดูแลตัวเอง
- 🟡 เหลือง (ควรพบแพทย์): อาการที่ควรได้รับการตรวจภายใน 1-2 วัน
- 🔴 แดง (เร่งด่วน): อาการที่ต้องไปโรงพยาบาลทันที

หลักการสำคัญ:
- ถ้าไม่แน่ใจ → ให้ระดับ 🟡 เสมอ (safety-first)
- ไม่วินิจฉัยโรค ไม่สั่งยา
- ย้ำเสมอว่านี่เป็นการประเมินเบื้องต้นเท่านั้น
- ใช้ภาษาง่ายๆ ที่คนทั่วไปเข้าใจ
- ถามทีละคำถาม ไม่ถามรวมหลายข้อพร้อมกัน

เมื่อพร้อมสรุป ให้ตอบในรูปแบบ JSON:
{
  "complete": true,
  "level": "green|yellow|red",
  "summary": "สรุปอาการสั้นๆ",
  "reason": "เหตุผลที่ให้ระดับนี้",
  "advice": "คำแนะนำสำหรับผู้ป่วย",
  "symptoms": ["อาการ1", "อาการ2"]
}

ถ้ายังซักประวัติไม่ครบ ให้ตอบเป็นข้อความปกติ (ถามคำถามต่อ) โดยไม่ต้องใส่ JSON`;

export async function triageRoutes(app) {
  // เริ่มการซักประวัติใหม่
  app.post('/start', async (request, reply) => {
    const { userId, name, age, village } = request.body;

    const greeting = `สวัสดีค่ะ คุณ${name} วันนี้มีอาการอะไรที่ไม่สบายคะ? ลองเล่าให้ฟังได้เลยนะคะ`;

    return {
      sessionId: `triage_${userId}_${Date.now()}`,
      message: greeting,
      level: null,
      complete: false,
    };
  });

  // ส่งข้อความในการสนทนา
  app.post('/chat', async (request, reply) => {
    const { sessionId, messages, userMessage } = request.body;

    const conversationMessages = [
      ...(messages || []),
      { role: 'user', content: userMessage },
    ];

    try {
      const response = await client.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1024,
        system: TRIAGE_SYSTEM_PROMPT,
        messages: conversationMessages,
      });

      const assistantMessage = response.content[0].text;

      // ตรวจสอบว่า AI สรุปผลแล้วหรือยัง
      let triageResult = null;
      try {
        const jsonMatch = assistantMessage.match(/\{[\s\S]*"complete"\s*:\s*true[\s\S]*\}/);
        if (jsonMatch) {
          triageResult = JSON.parse(jsonMatch[0]);
        }
      } catch {
        // ยังไม่สรุป — ดำเนินการซักประวัติต่อ
      }

      return {
        sessionId,
        message: triageResult ? triageResult.advice : assistantMessage,
        level: triageResult?.level || null,
        complete: triageResult?.complete || false,
        result: triageResult,
        messages: [
          ...conversationMessages,
          { role: 'assistant', content: assistantMessage },
        ],
      };
    } catch (error) {
      reply.status(500);
      return { error: 'AI service unavailable', detail: error.message };
    }
  });
}
