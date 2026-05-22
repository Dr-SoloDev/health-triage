import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { TRIAGE_LABELS, TRIAGE_DESCRIPTIONS } from '../../../../packages/shared/src/index.js'

export default function CaseReviewScreen() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [caseData, setCaseData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [reviewNote, setReviewNote] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetchCase()
  }, [id])

  async function fetchCase() {
    setLoading(true)
    try {
      const response = await fetch('/api/dashboard/cases')
      const data = await response.json()
      const foundCase = data.cases?.find((c) => c.id === id)
      if (foundCase) {
        setCaseData(foundCase)
        setReviewNote(foundCase.reviewNote || '')
      }
    } catch (error) {
      console.error('Failed to fetch case:', error)
    } finally {
      setLoading(false)
    }
  }

  async function handleSubmitReview() {
    if (!reviewNote.trim()) {
      alert('กรุณาเขียนบันทึกการประเมิน')
      return
    }

    setSubmitting(true)
    try {
      const response = await fetch(`/api/dashboard/cases/${id}/review`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reviewNote,
          reviewedBy: 'อสม.', // TODO: ใส่ชื่อจริงจาก auth
        }),
      })

      if (response.ok) {
        alert('บันทึกการประเมินเรียบร้อย')
        navigate('/cases')
      } else {
        alert('เกิดข้อผิดพลาด กรุณาลองใหม่')
      }
    } catch (error) {
      console.error('Failed to submit review:', error)
      alert('เกิดข้อผิดพลาด กรุณาลองใหม่')
    } finally {
      setSubmitting(false)
    }
  }

  function getLevelBadgeClass(level) {
    const classes = {
      red: 'bg-red-100 text-red-800 border-red-300',
      yellow: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      green: 'bg-green-100 text-green-800 border-green-300',
    }
    return classes[level] || 'bg-gray-100 text-gray-800 border-gray-300'
  }

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
        <p className="mt-2 text-gray-600">กำลังโหลด...</p>
      </div>
    )
  }

  if (!caseData) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">ไม่พบข้อมูลเคส</p>
        <button
          onClick={() => navigate('/cases')}
          className="mt-4 text-green-600 hover:text-green-700"
        >
          กลับไปหน้ารายการ
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <button
        onClick={() => navigate('/cases')}
        className="mb-4 text-gray-600 hover:text-gray-900 flex items-center gap-2"
      >
        ← กลับ
      </button>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h2 className="text-xl font-bold text-gray-900">รายละเอียดเคส</h2>
        </div>

        <div className="px-6 py-6 space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">ชื่อ</label>
              <p className="text-lg font-semibold text-gray-900">{caseData.name}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">อายุ</label>
              <p className="text-lg font-semibold text-gray-900">{caseData.age} ปี</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">หมู่บ้าน</label>
              <p className="text-lg font-semibold text-gray-900">{caseData.village}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">ระดับความเร่งด่วน</label>
              <span className={`inline-flex px-4 py-2 text-sm font-semibold rounded-lg border-2 ${getLevelBadgeClass(caseData.level)}`}>
                {TRIAGE_LABELS[caseData.level]}
              </span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-500 mb-2">คำอธิบาย</label>
            <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">
              {TRIAGE_DESCRIPTIONS[caseData.level]}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-500 mb-2">อาการที่พบ</label>
            <div className="bg-gray-50 p-4 rounded-lg">
              {caseData.symptoms && caseData.symptoms.length > 0 ? (
                <ul className="list-disc list-inside space-y-1">
                  {caseData.symptoms.map((symptom, idx) => (
                    <li key={idx} className="text-gray-700">{symptom}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">ไม่มีข้อมูล</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-500 mb-2">สรุปจาก AI</label>
            <p className="text-gray-700 bg-blue-50 p-4 rounded-lg border border-blue-200">
              {caseData.summary || 'ไม่มีข้อมูล'}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-500 mb-2">เหตุผลการประเมิน</label>
            <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">
              {caseData.reason || 'ไม่มีข้อมูล'}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-500 mb-2">คำแนะนำ</label>
            <p className="text-gray-700 bg-green-50 p-4 rounded-lg border border-green-200">
              {caseData.advice || 'ไม่มีข้อมูล'}
            </p>
          </div>

          <div className="border-t pt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              บันทึกการประเมินโดย อสม. {caseData.reviewedBy && '(ตรวจสอบแล้ว)'}
            </label>
            <textarea
              value={reviewNote}
              onChange={(e) => setReviewNote(e.target.value)}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="เขียนบันทึกการประเมิน เช่น ได้ติดตามอาการแล้ว, แนะนำให้ไปพบแพทย์..."
            />
          </div>

          {caseData.reviewedBy && (
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <p className="text-sm text-green-800">
                <strong>ตรวจสอบโดย:</strong> {caseData.reviewedBy}
              </p>
            </div>
          )}

          <div className="flex gap-4">
            <button
              onClick={handleSubmitReview}
              disabled={submitting}
              className="flex-1 bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {submitting ? 'กำลังบันทึก...' : 'บันทึกการประเมิน'}
            </button>
            <button
              onClick={() => navigate('/cases')}
              className="px-6 py-3 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50"
            >
              ยกเลิก
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
