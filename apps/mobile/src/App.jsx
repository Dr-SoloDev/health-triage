import { useState } from 'react'
import StartScreen from './screens/StartScreen'
import ChatScreen from './screens/ChatScreen'
import ResultScreen from './screens/ResultScreen'

function App() {
  const [screen, setScreen] = useState('start')
  const [userInfo, setUserInfo] = useState(null)
  const [session, setSession] = useState(null)
  const [result, setResult] = useState(null)

  function handleStart(info, sessionData) {
    setUserInfo(info)
    setSession(sessionData)
    setScreen('chat')
  }

  function handleComplete(triageResult) {
    setResult(triageResult)
    setScreen('result')
  }

  function handleRestart() {
    setScreen('start')
    setUserInfo(null)
    setSession(null)
    setResult(null)
  }

  return (
    <div className="min-h-svh bg-green-50 flex flex-col max-w-lg mx-auto">
      {screen === 'start' && <StartScreen onStart={handleStart} />}
      {screen === 'chat' && (
        <ChatScreen
          userInfo={userInfo}
          session={session}
          onComplete={handleComplete}
        />
      )}
      {screen === 'result' && (
        <ResultScreen result={result} userInfo={userInfo} onRestart={handleRestart} />
      )}
    </div>
  )
}

export default App
