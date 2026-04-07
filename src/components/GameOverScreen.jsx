import React, { useState, useEffect } from 'react'

export default function GameOverScreen({ score, coins, highScore, highCoins, combo, onRestart, onMenu }) {
  const [show, setShow] = useState(false)
  const [showDetails, setShowDetails] = useState(false)
  const isNewRecord = score >= highScore && score > 0

  useEffect(() => {
    const t1 = setTimeout(() => setShow(true), 100)
    const t2 = setTimeout(() => setShowDetails(true), 600)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [])

  return (
    <div className={`gameover-screen ${show ? 'show' : ''}`} onTouchStart={(e) => e.stopPropagation()}>
      <div className="gameover-content">
        <h2 className="gameover-title">GAME OVER</h2>

        {isNewRecord && (
          <div className="new-record">
            ★ NEW RECORD ★
          </div>
        )}

        <div className={`gameover-details ${showDetails ? 'show' : ''}`}>
          <div className="gameover-stat">
            <span className="stat-label">STAIRS</span>
            <span className="stat-value">{score}</span>
          </div>
          <div className="gameover-stat">
            <span className="stat-label">COINS</span>
            <span className="stat-value coin-color">{coins}</span>
          </div>
          <div className="gameover-stat">
            <span className="stat-label">MAX COMBO</span>
            <span className="stat-value combo-color">{combo}</span>
          </div>
          <div className="gameover-divider" />
          <div className="gameover-stat">
            <span className="stat-label">BEST</span>
            <span className="stat-value best-value">{highScore}</span>
          </div>
        </div>

        <div className={`gameover-buttons ${showDetails ? 'show' : ''}`}>
          <button
            className="gameover-btn retry-btn"
            onClick={onRestart}
            onTouchStart={(e) => { e.stopPropagation(); onRestart(); }}
          >
            RETRY
          </button>
          <button
            className="gameover-btn menu-btn"
            onClick={onMenu}
            onTouchStart={(e) => { e.stopPropagation(); onMenu(); }}
          >
            MENU
          </button>
        </div>
      </div>
    </div>
  )
}
