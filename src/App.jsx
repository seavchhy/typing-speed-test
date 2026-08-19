import { useEffect, useRef, useState } from 'react'
import './App.css'

function App() {
  const [typedText, setTypedText] = useState('')
  const [time, setTime] = useState(60)
  const [isRunning, setIsRunning] = useState(false)
  const [hasStarted, setHasStarted] = useState(false)
  const [elapsedTime, setElapsedTime] = useState(0)
  const [difficulty, setDifficulty] = useState('easy')
  const [showPassage, setShowPassage] = useState(false)
  const textareaRef = useRef(null)

  const passages = {
    easy: [
      'I like learning new things.',
      'The sun is shining today.',
      'Practice makes you better.',
      'Coding can be fun.'
    ],

    medium: [
      'Learning to code takes practice and patience.',
      'React makes it easier to build interactive websites.',
      'Every small step brings you closer to your goal.',
      'Good software requires careful testing.'
    ],

    hard: [
      'Building reliable software requires patience, testing, and continuous improvement.',
      'Successful developers understand that solving problems is more important than memorizing code.',
      'Modern applications require developers to think carefully about performance, security, and usability.',
      'Writing clean and maintainable code becomes increasingly important as projects grow larger.'
    ]
  }
  const [targetText, setTargetText] = useState(passages.easy[0])
  const testFinished = time === 0 || typedText.length === targetText.length  
  const progress = Math.min(
    Math.round((typedText.length / targetText.length) * 100),
    100
  )
 
  const handleStart = () => {
    setTypedText('')
    setElapsedTime(0)
    setTargetText(getRandomPassage(targetText))
    setHasStarted(true)
    setShowPassage(true)
    setIsRunning(true)
  }
  const getRandomPassage = (currentPassage) => {
  const currentPassages = passages[difficulty]

    let randomIndex

    do {
      randomIndex = Math.floor(Math.random() * currentPassages.length)
    } while (currentPassages[randomIndex] === currentPassage)

    return currentPassages[randomIndex]
  }
  const handleRestart = () => {
      setTypedText('')
      setTime(60)
      setElapsedTime(0)
      setIsRunning(false)
      setHasStarted(false)
      setShowPassage(false)
  }

  useEffect(() => {
    if (!isRunning || time === 0) {
      return
    }

    const timer = setInterval(() => {
      setTime((currentTime) => currentTime - 1)
      setElapsedTime((currentTime) => currentTime + 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [isRunning, time])
  useEffect(() => {
    if (hasStarted && showPassage) {
      textareaRef.current?.focus()
    }
  }, [hasStarted, showPassage])

  const calculateAccuracy = () => {
    if (typedText.length === 0) {
      return 100
    }

    let correctCharacters = 0

    const charactersToCheck = Math.min(
      typedText.length,
      targetText.length
    )

    for (let i = 0; i < charactersToCheck; i++) {
      if (typedText[i] === targetText[i]) {
        correctCharacters++
      }
    }

    return Math.round(
      (correctCharacters / typedText.length) * 100
    )
  }
  const calculateCorrectCharacters = () => {
    let correctCharacters = 0

    const charactersToCheck = Math.min(
      typedText.length,
      targetText.length
    )

    for (let i = 0; i < charactersToCheck; i++) {
      if (typedText[i] === targetText[i]) {
        correctCharacters++
      }
    }

    return correctCharacters
  }

  const calculateErrors = () => {
    let errors = 0

    const charactersToCheck = Math.min(
      typedText.length,
      targetText.length
    )

    for (let i = 0; i < charactersToCheck; i++) {
      if (typedText[i] !== targetText[i]) {
        errors++
      }
    }

    return errors
  }

  const calculateWPM = () => {
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
      <div className="difficulty">
        <span>Difficulty:</span>

        <button
          type="button"
          className={difficulty === 'easy' ? 'selected' : ''}
          disabled={hasStarted}
          onClick={() => setDifficulty('easy')}
        >
          Easy
        </button>

        <button
          type="button"
          className={difficulty === 'medium' ? 'selected' : ''}
          disabled={hasStarted}
          onClick={() => setDifficulty('medium')}
        >
          Medium
        </button>

        <button
          type="button"
          className={difficulty === 'hard' ? 'selected' : ''}
          disabled={hasStarted}
          onClick={() => setDifficulty('hard')}
        >
          Hard
        </button>
      </div>

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

        <div>
          <span>Characters</span>
          <strong>{typedText.length}</strong>
        </div>
        <div>
          <span>Time Taken</span>
          <strong>{elapsedTime}s</strong>
        </div>
      </div>

      <div className="progress-container">
        <div className="progress-info">
          <span>Progress</span>
          <span>{progress}%</span>
        </div>

        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      <div className="text-display">
        {showPassage ? (
          targetText.split('').map((character, index) => {
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
        })
        ) : (
          <div className="ready-message">
            <h2>Ready?</h2>
            <p>Choose your difficulty and click Start Test.</p>
          </div>
        )}
      </div>

      <div className="typing-info">
        <span>
          Characters: {typedText.length}/{targetText.length}
        </span>

        <span>
          {targetText.length - typedText.length} remaining
        </span>
      </div>

      <textarea
        ref={textareaRef}
        placeholder="Start typing here..."
        value={typedText}
        maxLength={targetText.length}
        disabled={!hasStarted || time === 0  || typedText.length === targetText.length}
        onChange={(e) => {
          const value = e.target.value
          setTypedText(value)

          if (value.length === targetText.length) {
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
              <span>Correct</span>
              <strong>{calculateCorrectCharacters()}</strong>
            </div>

            <div>
              <span>Errors</span>
              <strong>{calculateErrors()}</strong>
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
