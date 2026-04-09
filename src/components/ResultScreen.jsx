import React, { useState, useEffect } from 'react'

export default function ResultScreen({ won, playerScore, aiScore, playerChar, aiChar, onRestart, onMenu }) {
  const [show, setShow] = useState(false)
  const [showDetails, setShowDetails] = useState(false)

  useEffect(() => {
    const t1 = setTimeout(() => setShow(true), 100)
    const t2 = setTimeout(() => setShowDetails(true), 600)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [])

  return (
    <div className={`result-screen ${show ? 'show' : ''}`}>
      <div className="result-content">
        <h2 className={`result-title ${won ? 'win' : 'lose'}`}>
          {won ? 'YOU WIN!' : 'YOU LOSE...'}
        </h2>

        <div className="result-characters">
          <div className={`result-char ${!won ? 'winner' : 'loser'}`}>
            <div className="result-avatar" style={{ background: aiChar.shirt }}>
              <div className="char-head-lg" style={{ background: aiChar.skin }} />
              <div className="char-body-lg" style={{ background: aiChar.shirt }} />
            </div>
            <div className="result-char-label">CPU</div>
            <div className="result-score">{aiScore}</div>
          </div>

          <div className="result-vs-small">VS</div>

          <div className={`result-char ${won ? 'winner' : 'loser'}`}>
            <div className="result-avatar" style={{ background: playerChar.shirt }}>
              <div className="char-head-lg" style={{ background: playerChar.skin }} />
              <div className="char-body-lg" style={{ background: playerChar.shirt }} />
            </div>
            <div className="result-char-label">YOU</div>
            <div className="result-score">{playerScore}</div>
          </div>
        </div>

        {/* Winner animation */}
        <div className={`result-emote ${show ? 'show' : ''}`}>
          {won ? '🎉' : '😢'}
        </div>

        <div className={`result-buttons ${showDetails ? 'show' : ''}`}>
          <button
            className="gameover-btn retry-btn"
            onClick={onRestart}
            onTouchStart={(e) => { e.stopPropagation(); onRestart() }}
          >
            REMATCH
          </button>
          <button
            className="gameover-btn menu-btn"
            onClick={onMenu}
            onTouchStart={(e) => { e.stopPropagation(); onMenu() }}
          >
            MENU
          </button>
        </div>
      </div>
    </div>
  )
}
