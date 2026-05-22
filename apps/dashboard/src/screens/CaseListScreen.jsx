import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { TRIAGE_LABELS } from '../../../../packages/shared/src/index.js'

export default function CaseListScreen() {
  const [cases, setCases] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({ village: '', level: '' })
  const navigate = useNavigate()

  useEffect(() => {
    fetchCases()
  }, [filters])

  async function fetchCases() {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (filters.village) params.append('village', filters.village)
      if (filters.level) params.append('level', filters.level)

      const response = await fetch(`/api/dashboard/cases?${params}`)
      const data = await response.json()
      setCases(data.cases || [])
    } catch (error) {
      console.error('Failed to fetch cases:', error)
    } finally {
      setLoading(false)
    }
  }

  function getLevelBadgeClass(level) {
    const classes = {
      red: 'bg-red-100 text-red-800 border-red-200',
      yellow: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      green: 'bg-green-100 text-green-800 border-green-200',
    }
    return classes[level] || 'bg-gray-100 text-gray-800 border-gray-200'
  }

  function formatDate(dateString) {
    const date = new Date(dateString)
    return date.toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const sortedCases = [...cases].sort((a, b) => {
    const levelOrder = { red: 0, yellow: 1, green: 2 }
    return levelOrder[a.level] - levelOrder[b.level]
  })

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">รายการเคสทั้งหมด</h2>

        <div className="flex gap-4 mb-4">
          <input
            type="text"
            placeholder="กรองตามหมู่บ้าน..."
            value={filters.village}
            onChange={(e) => setFilters({ ...filters, village: e.target.value })}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
          <select
            value={filters.level}
            onChange={(e) => setFilters({ ...filters, level: e.target.value })}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value="">ทุกระดับ</option>
            <option value="red">🔴 เร่งด่วน</option>
            <option value="yellow">🟡 ควรพบแพทย์</option>
            <option value="green">🟢 ดูแลตัวเองได้</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
          <p className="mt-2 text-gray-600">กำลังโหลด...</p>
        </div>
      ) : sortedCases.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <p className="text-gray-500">ไม่มีข้อมูลเคส</p>
        </div>
      ) : (
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ระดับ
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ชื่อ-อายุ
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  หมู่บ้าน
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  อาการ
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  วันที่
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  สถานะ
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  การดำเนินการ
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedCases.map((caseItem) => (
                <tr key={caseItem.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full border ${getLevelBadgeClass(caseItem.level)}`}>
                      {TRIAGE_LABELS[caseItem.level]}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{caseItem.name}</div>
                    <div className="text-sm text-gray-500">{caseItem.age} ปี</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {caseItem.village}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                    {caseItem.symptoms?.join(', ') || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(caseItem.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {caseItem.reviewedBy ? (
                      <span className="px-2 py-1 text-xs font-medium text-green-800 bg-green-100 rounded">
                        ตรวจสอบแล้ว
                      </span>
                    ) : (
                      <span className="px-2 py-1 text-xs font-medium text-gray-600 bg-gray-100 rounded">
                        รอตรวจสอบ
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => navigate(`/cases/${caseItem.id}/review`)}
                      className="text-green-600 hover:text-green-900"
                    >
                      ดูรายละเอียด
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
