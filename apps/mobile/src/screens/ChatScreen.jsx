import { useState, useEffect, useRef } from 'react'

export default function ChatScreen({ userInfo, session, onComplete }) {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: session.message },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [sessionId] = useState(session.sessionId)
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  async function handleSend() {
    const text = input.trim()
    if (!text || loading) return

    const newMessages = [...messages, { role: 'user', content: text }]
    setMessages(newMessages)
    setInput('')
    setLoading(true)

    try {
      const res = await fetch('/api/triage/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          messages: newMessages,
          userMessage: text,
        }),
      })
      const data = await res.json()

      setMessages(data.messages)

      if (data.complete && data.result) {
        setTimeout(() => onComplete(data.result), 800)
      }
    } catch {
      setMessages((m) => [
        ...m,
        { role: 'assistant', content: 'ขออภัย ระบบขัดข้องชั่วคราว กรุณาลองใหม่อีกครั้ง' },
      ])
    } finally {
      setLoading(false)
    }
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="flex flex-col min-h-svh">
      {/* Header */}
      <div className="bg-green-600 text-white px-4 py-4 flex items-center gap-3 sticky top-0 z-10">
        <div className="text-2xl">🤖</div>
        <div>
          <p className="font-semibold text-sm">AI คัดกรองอาการ</p>
          <p className="text-green-200 text-xs">คุณ{userInfo.name} | {userInfo.village}</p>
        </div>
        <div className="ml-auto flex items-center gap-1">
          <span className="w-2 h-2 bg-green-300 rounded-full animate-pulse"></span>
          <span className="text-xs text-green-200">กำลังทำงาน</span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.role === 'assistant' && (
              <div className="w-7 h-7 rounded-full bg-green-600 flex items-center justify-center text-white text-xs mr-2 mt-1 shrink-0">
                AI
              </div>
            )}
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-green-600 text-white rounded-br-sm'
                  : 'bg-white text-gray-800 shadow-sm rounded-bl-sm'
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="w-7 h-7 rounded-full bg-green-600 flex items-center justify-center text-white text-xs mr-2 shrink-0">
              AI
            </div>
            <div className="bg-white rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm flex gap-1 items-center">
              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="sticky bottom-0 bg-white border-t border-gray-200 px-4 py-3 flex gap-2">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="พิมพ์อาการของคุณ..."
          rows={1}
          className="flex-1 border border-gray-300 rounded-xl px-4 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-green-400"
          style={{ maxHeight: '100px' }}
        />
        <button
          onClick={handleSend}
          disabled={!input.trim() || loading}
          className="bg-green-600 text-white rounded-xl px-4 py-2 font-medium text-sm disabled:opacity-40 active:bg-green-700 shrink-0"
        >
          ส่ง
        </button>
      </div>
    </div>
  )
}
