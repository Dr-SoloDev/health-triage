const LEVEL_CONFIG = {
  green: {
    emoji: '🟢',
    label: 'ดูแลตัวเองได้',
    color: 'bg-green-50 border-green-300',
    headerColor: 'bg-green-600',
    badgeColor: 'bg-green-100 text-green-800',
    desc: 'อาการเล็กน้อย สามารถดูแลตัวเองที่บ้านได้',
  },
  yellow: {
    emoji: '🟡',
    label: 'ควรพบแพทย์',
    color: 'bg-yellow-50 border-yellow-300',
    headerColor: 'bg-yellow-500',
    badgeColor: 'bg-yellow-100 text-yellow-800',
    desc: 'ควรไปพบแพทย์ภายใน 1-2 วัน',
  },
  red: {
    emoji: '🔴',
    label: 'เร่งด่วน!',
    color: 'bg-red-50 border-red-300',
    headerColor: 'bg-red-600',
    badgeColor: 'bg-red-100 text-red-800',
    desc: 'ต้องไปโรงพยาบาลทันที',
  },
}

export default function ResultScreen({ result, userInfo, onRestart }) {
  const cfg = LEVEL_CONFIG[result.level] || LEVEL_CONFIG.yellow

  async function saveCase() {
    try {
      await fetch('/api/dashboard/cases', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: `user_${Date.now()}`,
          name: userInfo.name,
          age: userInfo.age,
          village: userInfo.village,
          level: result.level,
          summary: result.summary,
          reason: result.reason,
          advice: result.advice,
          symptoms: result.symptoms,
        }),
      })
    } catch {
      // บันทึกไม่ได้ก็ไม่เป็นไร — UI ยังแสดงผลได้ปกติ
    }
  }

  // บันทึกผลอัตโนมัติเมื่อแสดงหน้านี้
  useState(() => { saveCase() }, [])

  return (
    <div className="flex flex-col min-h-svh">
      {/* Header */}
      <div className={`${cfg.headerColor} text-white px-6 pt-12 pb-8 text-center`}>
        <div className="text-6xl mb-3">{cfg.emoji}</div>
        <h1 className="text-2xl font-bold mb-1">{cfg.label}</h1>
        <p className="text-white/80 text-sm">{cfg.desc}</p>
      </div>

      <div className="flex-1 px-4 py-5 flex flex-col gap-4">
        {/* Summary */}
        <div className={`border rounded-xl p-4 ${cfg.color}`}>
          <p className="text-xs font-semibold text-gray-500 uppercase mb-1">สรุปอาการ</p>
          <p className="text-gray-800 text-sm leading-relaxed">{result.summary}</p>
        </div>

        {/* Reason */}
        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
          <p className="text-xs font-semibold text-gray-500 uppercase mb-1">เหตุผล</p>
          <p className="text-gray-700 text-sm leading-relaxed">{result.reason}</p>
        </div>

        {/* Advice */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <p className="text-xs font-semibold text-blue-600 uppercase mb-2">💡 คำแนะนำ</p>
          <p className="text-gray-700 text-sm leading-relaxed">{result.advice}</p>
        </div>

        {/* Symptoms */}
        {result.symptoms?.length > 0 && (
          <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
            <p className="text-xs font-semibold text-gray-500 uppercase mb-2">อาการที่พบ</p>
            <div className="flex flex-wrap gap-2">
              {result.symptoms.map((s, i) => (
                <span key={i} className={`text-xs px-3 py-1 rounded-full font-medium ${cfg.badgeColor}`}>
                  {s}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Emergency notice for red */}
        {result.level === 'red' && (
          <div className="bg-red-600 text-white rounded-xl p-4 text-center">
            <p className="font-bold text-lg mb-1">🚨 โทรสายด่วน 1669</p>
            <p className="text-red-100 text-sm">หรือไปห้องฉุกเฉินใกล้บ้านทันที</p>
          </div>
        )}

        {/* Disclaimer */}
        <p className="text-center text-xs text-gray-400 leading-relaxed">
          ผลนี้เป็นการประเมินเบื้องต้นด้วย AI เท่านั้น<br />ไม่สามารถใช้แทนการวินิจฉัยของแพทย์
        </p>

        {/* Restart */}
        <button
          onClick={onRestart}
          className="bg-gray-100 text-gray-700 rounded-xl py-3 text-sm font-medium active:bg-gray-200"
        >
          เริ่มการคัดกรองใหม่
        </button>
      </div>
    </div>
  )
}
