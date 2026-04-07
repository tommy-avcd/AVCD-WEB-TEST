import React, { useState, useEffect } from 'react'

export default function StartScreen({ onStart }) {
  const [blink, setBlink] = useState(true)
  const highScore = parseInt(localStorage.getItem('infiniteStairs_highScore') || '0')

  useEffect(() => {
    const interval = setInterval(() => setBlink(b => !b), 600)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="start-screen" onTouchStart={onStart} onClick={onStart}>
      <div className="start-content">
        <div className="title-container">
          <h1 className="game-title">
            <span className="title-line1">무한의</span>
            <span className="title-line2">계단</span>
          </h1>
          <div className="title-subtitle">INFINITE STAIRS</div>
        </div>

        <div className="start-character">
          <div className="pixel-char-preview" />
        </div>

        <div className={`start-prompt ${blink ? 'visible' : 'hidden'}`}>
          TAP TO START
        </div>

        {highScore > 0 && (
          <div className="start-highscore">
            BEST: {highScore} STAIRS
          </div>
        )}

        <div className="start-controls-guide">
          <div className="guide-item">
            <span className="guide-icon">◀</span>
            <span className="guide-text">왼쪽 올라가기</span>
          </div>
          <div className="guide-item">
            <span className="guide-icon">▶</span>
            <span className="guide-text">오른쪽 올라가기</span>
          </div>
        </div>
      </div>

      {/* Decorative pixel stairs */}
      <div className="start-stairs-bg">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="start-stair-block"
            style={{
              left: `${20 + (i % 2 === 0 ? i * 8 : i * 8 + 15)}%`,
              bottom: `${5 + i * 7}%`,
              animationDelay: `${i * 0.15}s`
            }}
          />
        ))}
      </div>
    </div>
  )
}
