import { useEffect, useState } from 'react'
import './App.css'

function App() {
  const [typedText, setTypedText] = useState('')
  const [time, setTime] = useState(60)
  const [isRunning, setIsRunning] = useState(false)
  const [hasStarted, setHasStarted] = useState(false)

  const targetText = 'The quick brown fox jumps over the lazy dog.'
  const testFinished = time === 0 || typedText === targetText
 
  const handleStart = () => {
  setHasStarted(true)
  setIsRunning(true)
  }
  const handleRestart = () => {
      setTypedText('')
      setTime(60)
      setIsRunning(false)
      setHasStarted(false)
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
        disabled={!hasStarted || time === 0  || typedText === targetText}
        onChange={(e) => {
          const value = e.target.value
          setTypedText(value)

          if (value === targetText) {
            setIsRunning(false)
          }
        }}
      />
      {testFinished && hasStarted && (
        <div className="results">
          <h2>Test Complete!</h2>

          <div className="results-stats">
            <div>
              <span>WPM</span>
              <strong>{calculateWPM()}</strong>
            </div>

            <div>
              <span>Accuracy</span>
              <strong>{calculateAccuracy()}%</strong>
            </div>

            <div>
              <span>Characters</span>
              <strong>{typedText.length}</strong>
            </div>
          </div>
        </div>
      )}

      {!hasStarted && (
        <button type="button" onClick={handleStart}>
          Start Test
        </button>
      )}

      {testFinished && hasStarted && (
        <button type="button" onClick={handleRestart}>
          Try Again
        </button>
      )}
    </div>
  );
}

export default App
