import { useState } from 'react'

export default function StartScreen({ onStart }) {
  const [form, setForm] = useState({ name: '', age: '', village: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  function handleChange(e) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.name || !form.age || !form.village) {
      setError('กรุณากรอกข้อมูลให้ครบทุกช่อง')
      return
    }
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/triage/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: `user_${Date.now()}`, ...form }),
      })
      const data = await res.json()
      onStart(form, data)
    } catch {
      setError('ไม่สามารถเชื่อมต่อกับระบบได้ กรุณาลองใหม่')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col min-h-svh">
      {/* Header */}
      <div className="bg-green-600 text-white px-6 pt-12 pb-8 text-center">
        <div className="text-5xl mb-3">🏥</div>
        <h1 className="text-2xl font-bold mb-1">AI Health Triage</h1>
        <p className="text-green-100 text-sm">ระบบคัดกรองอาการเบื้องต้น</p>
      </div>

      {/* Disclaimer */}
      <div className="mx-4 mt-4 bg-yellow-50 border border-yellow-200 rounded-xl p-3 flex gap-2">
        <span className="text-yellow-500 text-lg">⚠️</span>
        <p className="text-yellow-800 text-xs leading-relaxed">
          เครื่องมือนี้ใช้ประเมินเบื้องต้นเท่านั้น <strong>ไม่ใช่การวินิจฉัยทางการแพทย์</strong> หากมีอาการรุนแรงให้ไปโรงพยาบาลทันที
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="flex-1 px-4 py-6 flex flex-col gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">ชื่อ-นามสกุล</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="กรอกชื่อของคุณ"
            className="w-full border border-gray-300 rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-green-400"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">อายุ (ปี)</label>
          <input
            type="number"
            name="age"
            value={form.age}
            onChange={handleChange}
            placeholder="เช่น 35"
            min="1"
            max="120"
            className="w-full border border-gray-300 rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-green-400"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">หมู่บ้าน / ชุมชน</label>
          <input
            type="text"
            name="village"
            value={form.village}
            onChange={handleChange}
            placeholder="เช่น บ้านโนนสวรรค์"
            className="w-full border border-gray-300 rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-green-400"
          />
        </div>

        {error && (
          <p className="text-red-500 text-sm text-center">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="mt-auto bg-green-600 text-white rounded-xl py-4 text-lg font-semibold disabled:opacity-60 active:bg-green-700"
        >
          {loading ? 'กำลังเชื่อมต่อ...' : 'เริ่มการคัดกรอง →'}
        </button>
      </form>
    </div>
  )
}
