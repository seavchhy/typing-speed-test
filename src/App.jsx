import { useEffect, useState } from 'react'
import './App.css'

function App() {
  const [typedText, setTypedText] = useState('')
  const [time, setTime] = useState(60)
  const [isRunning, setIsRunning] = useState(false)

  const targetText = 'The quick brown fox jumps over the lazy dog.'
  const handleRestart = () => {
      setTypedText('')
      setIsRunning(false)
      setTime(60)
  }

  useEffect(() => {
    if (!isRunning || time === 0) {
      return
    }

    const timer = setInterval(() => {
      setTime((currentTime) => currentTime - 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [isRunning, time])

  const calculateAccuracy = () => {
    if (typedText.length === 0) {
      return 100
    }

    let correctCharacters = 0

    for (let i = 0; i < typedText.length; i++) {
      if (typedText[i] === targetText[i]) {
        correctCharacters++
      }
    }

    return Math.round((correctCharacters / typedText.length) * 100)
 }
  const calculateWPM = () => {
  const elapsedTime = 60 - time

  if (elapsedTime === 0 || typedText.length === 0) {
    return 0
  }

  const minutes = elapsedTime / 60
  const words = typedText.length / 5

  return Math.round(words / minutes)
}

  return (
    <div className="app">
      <h1>Speed Typing Test</h1>

      <div className="stats">
        <div>
          <span>Time</span>
          <strong>{time}s</strong>
        </div>

        <div>
          <span>WPM</span>
          <strong>{calculateWPM()}</strong>
        </div>

        <div>
          <span>Accuracy</span>
          <strong>{calculateAccuracy()}%</strong>
        </div>
      </div>
      {time === 0 && (
        <p className="finished-message">Time's up!</p>
      )}

      <div className="text-display">
        {targetText.split('').map((character, index) => {
          const typedCharacter = typedText[index]

          if (!typedCharacter) {
            return (
              <span
                key={index}
                className={index === typedText.length ? 'current' : ''}
              >
                {character}
              </span>
            )
          }

          if (typedCharacter === character) {
            return (
              <span key={index} className="correct">
                {character}
              </span>
            )
          }

          return (
            <span key={index} className="incorrect">
              {character}
            </span>
          )
        })}
      </div>

      <textarea
        placeholder="Start typing here..."
        value={typedText}
        disabled={time === 0}
        onChange={(e) => {
          setTypedText(e.target.value)
          if (!isRunning && time > 0) {
            setIsRunning(true)
          }
        }}
      />

      <button onClick={handleRestart}>Restart</button>
    </div>
  );
}

export default App
