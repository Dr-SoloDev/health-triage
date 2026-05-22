import { useState, useEffect } from 'react'

export default function DashboardStatsScreen() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  async function fetchStats() {
    setLoading(true)
    try {
      const response = await fetch('/api/dashboard/summary')
      const data = await response.json()
      setStats(data)
    } catch (error) {
      console.error('Failed to fetch stats:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
        <p className="mt-2 text-gray-600">กำลังโหลด...</p>
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="text-center py-12 bg-white rounded-lg shadow">
        <p className="text-gray-500">ไม่สามารถโหลดข้อมูลได้</p>
      </div>
    )
  }

  const statCards = [
    {
      title: 'เคสเร่งด่วน',
      value: stats.red || 0,
      icon: '🔴',
      bgColor: 'bg-red-50',
      textColor: 'text-red-700',
      borderColor: 'border-red-200',
    },
    {
      title: 'ควรพบแพทย์',
      value: stats.yellow || 0,
      icon: '🟡',
      bgColor: 'bg-yellow-50',
      textColor: 'text-yellow-700',
      borderColor: 'border-yellow-200',
    },
    {
      title: 'ดูแลตัวเองได้',
      value: stats.green || 0,
      icon: '🟢',
      bgColor: 'bg-green-50',
      textColor: 'text-green-700',
      borderColor: 'border-green-200',
    },
    {
      title: 'ตรวจสอบแล้ว',
      value: stats.reviewed || 0,
      icon: '✅',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-700',
      borderColor: 'border-blue-200',
    },
    {
      title: 'รอตรวจสอบ',
      value: stats.pending || 0,
      icon: '⏳',
      bgColor: 'bg-gray-50',
      textColor: 'text-gray-700',
      borderColor: 'border-gray-200',
    },
  ]

  const totalCases = (stats.red || 0) + (stats.yellow || 0) + (stats.green || 0)

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">สรุปรายวัน</h2>
        <p className="text-gray-600 mt-1">ภาพรวมการคัดกรองสุขภาพ</p>
      </div>

      <div className="mb-8 bg-white shadow rounded-lg p-6">
        <div className="text-center">
          <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">จำนวนเคสทั้งหมด</p>
          <p className="text-5xl font-bold text-gray-900 mt-2">{totalCases}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((card) => (
          <div
            key={card.title}
            className={`${card.bgColor} border-2 ${card.borderColor} rounded-lg p-6 shadow-sm`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{card.title}</p>
                <p className={`text-3xl font-bold ${card.textColor} mt-2`}>{card.value}</p>
              </div>
              <div className="text-4xl">{card.icon}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">สถิติเพิ่มเติม</h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center py-2 border-b border-gray-200">
            <span className="text-gray-600">อัตราการตรวจสอบ</span>
            <span className="font-semibold text-gray-900">
              {totalCases > 0
                ? `${Math.round(((stats.reviewed || 0) / totalCases) * 100)}%`
                : '0%'}
            </span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-gray-200">
            <span className="text-gray-600">เคสที่ต้องติดตามเร่งด่วน</span>
            <span className="font-semibold text-red-600">{stats.red || 0}</span>
          </div>
          <div className="flex justify-between items-center py-2">
            <span className="text-gray-600">เคสรอการตรวจสอบ</span>
            <span className="font-semibold text-gray-900">{stats.pending || 0}</span>
          </div>
        </div>
      </div>

      <div className="mt-6 text-center">
        <button
          onClick={fetchStats}
          className="px-6 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700"
        >
          รีเฟรชข้อมูล
        </button>
      </div>
    </div>
  )
}
