// Dashboard routes สำหรับ อสม.
// TODO: เชื่อม Supabase เมื่อ setup DB เสร็จ

// In-memory store สำหรับ MVP testing
const cases = [];

export async function dashboardRoutes(app) {
  // ดูเคสทั้งหมดในพื้นที่
  app.get('/cases', async (request) => {
    const { village, level } = request.query;
    let filtered = [...cases];

    if (village) {
      filtered = filtered.filter((c) => c.village === village);
    }
    if (level) {
      filtered = filtered.filter((c) => c.level === level);
    }

    // เรียงตามความเร่งด่วน (แดง > เหลือง > เขียว) แล้วตามเวลา
    const priority = { red: 0, yellow: 1, green: 2 };
    filtered.sort((a, b) => {
      if (priority[a.level] !== priority[b.level]) {
        return priority[a.level] - priority[b.level];
      }
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

    return { cases: filtered, total: filtered.length };
  });

  // บันทึกผลการคัดกรอง (เรียกจาก triage flow เมื่อ complete)
  app.post('/cases', async (request) => {
    const { userId, name, age, village, level, summary, reason, advice, symptoms } = request.body;

    const newCase = {
      id: `case_${Date.now()}`,
      userId,
      name,
      age,
      village,
      level,
      summary,
      reason,
      advice,
      symptoms,
      createdAt: new Date().toISOString(),
      reviewedBy: null,
      reviewedAt: null,
      reviewLevel: null,
      notes: null,
    };

    cases.push(newCase);
    return { success: true, case: newCase };
  });

  // อสม. ประเมินซ้ำ
  app.patch('/cases/:id/review', async (request) => {
    const { id } = request.params;
    const { reviewedBy, reviewLevel, notes } = request.body;

    const caseItem = cases.find((c) => c.id === id);
    if (!caseItem) {
      return { error: 'Case not found' };
    }

    caseItem.reviewedBy = reviewedBy;
    caseItem.reviewedAt = new Date().toISOString();
    caseItem.reviewLevel = reviewLevel;
    caseItem.notes = notes;

    return { success: true, case: caseItem };
  });

  // สรุปรายวัน
  app.get('/summary', async (request) => {
    const today = new Date().toISOString().split('T')[0];
    const todayCases = cases.filter((c) => c.createdAt.startsWith(today));

    return {
      date: today,
      total: todayCases.length,
      red: todayCases.filter((c) => c.level === 'red').length,
      yellow: todayCases.filter((c) => c.level === 'yellow').length,
      green: todayCases.filter((c) => c.level === 'green').length,
      reviewed: todayCases.filter((c) => c.reviewedBy).length,
      pending: todayCases.filter((c) => !c.reviewedBy).length,
    };
  });
}
