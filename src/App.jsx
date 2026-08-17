import './App.css'

function App() {
  return (
    <div className="app">
      <h1>Speed Typing Test</h1>

      <div className="stats">
        <div>
          <span>Time</span>
          <strong>60s</strong>
        </div>

        <div>
          <span>WPM</span>
          <strong>0</strong>
        </div>

        <div>
          <span>Accuracy</span>
          <strong>100%</strong>
        </div>
      </div>

      <div className="text-display">
        The quick brown fox jumps over the lazy dog.
      </div>

      <textarea
        placeholder="Start typing here..."
      />

      <button>Restart</button>
    </div>
  );
}

export default App
