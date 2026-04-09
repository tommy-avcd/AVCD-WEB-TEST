import React, { useState, useEffect } from 'react'

export default function StartScreen({ onStart }) {
  const [blink, setBlink] = useState(true)
  const [flyIn, setFlyIn] = useState(false)
  const highScore = parseInt(localStorage.getItem('infiniteStairs_highScore') || '0')

  useEffect(() => {
    const interval = setInterval(() => setBlink(b => !b), 600)
    setTimeout(() => setFlyIn(true), 300)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="start-screen-v2" onTouchStart={onStart} onClick={onStart}>
      {/* Bright blue sky background */}
      <div className="intro-sky">
        {/* Clouds */}
        <div className="intro-cloud cloud-1" />
        <div className="intro-cloud cloud-2" />
        <div className="intro-cloud cloud-3" />
      </div>

      {/* Ground with grass and flowers */}
      <div className="intro-ground">
        <div className="intro-grass" />
        {[...Array(6)].map((_, i) => (
          <div key={i} className="intro-flower" style={{ left: `${10 + i * 16}%` }} />
        ))}
      </div>

      {/* Title emblem - Sonic style */}
      <div className={`intro-emblem ${flyIn ? 'show' : ''}`}>
        <div className="emblem-wings">
          <div className="wing wing-left" />
          <div className="wing wing-right" />
        </div>
        <div className="emblem-circle">
          <div className="emblem-char">
            <div className="emblem-pixel-char" />
          </div>
        </div>
        <div className="emblem-title">
          <h1 className="game-title-v2">
            <span className="title-kr">무한의계단</span>
            <span className="title-num">2</span>
          </h1>
          <div className="title-sub">VS INFINITE STAIRS</div>
        </div>
      </div>

      <div className={`start-prompt ${blink ? 'visible' : 'hidden'}`}>
        TAP TO START
      </div>

      {highScore > 0 && (
        <div className="start-highscore">
          BEST: {highScore} STAIRS
        </div>
      )}

      {/* Decorative stairs */}
      <div className="intro-stairs">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="intro-stair-block"
            style={{
              left: `${25 + i * 10}%`,
              bottom: `${20 + i * 5}%`,
              animationDelay: `${i * 0.2}s`
            }}
          />
        ))}
      </div>
    </div>
  )
}
