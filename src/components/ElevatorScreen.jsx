import React, { useState, useEffect, useRef } from 'react'

export default function ElevatorScreen({ onComplete }) {
  const [phase, setPhase] = useState('ask') // ask, riding, arrived
  const [floorCount, setFloorCount] = useState(0)
  const TARGET = 10000000
  const animRef = useRef(null)
  const startTimeRef = useRef(null)

  const handleYes = () => {
    setPhase('riding')
    startTimeRef.current = performance.now()
  }

  const handleNo = () => {
    onComplete(0) // start from 0
  }

  useEffect(() => {
    if (phase !== 'riding') return

    let running = true
    const animate = () => {
      if (!running) return
      const elapsed = performance.now() - startTimeRef.current
      const duration = 10000 // 10 seconds
      const progress = Math.min(elapsed / duration, 1)

      // Easing: start slow, speed up in middle, slow at end
      const eased = progress < 0.5
        ? 2 * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 2) / 2

      const currentFloor = Math.floor(eased * TARGET)
      setFloorCount(currentFloor)

      if (progress >= 1) {
        setPhase('arrived')
        setTimeout(() => onComplete(TARGET), 2500)
        return
      }
      animRef.current = requestAnimationFrame(animate)
    }
    animRef.current = requestAnimationFrame(animate)
    return () => {
      running = false
      if (animRef.current) cancelAnimationFrame(animRef.current)
    }
  }, [phase, onComplete])

  // Format number with commas
  const formatNum = (n) => n.toLocaleString()

  if (phase === 'ask') {
    return (
      <div className="elevator-screen">
        <div className="elevator-box">
          <div className="elevator-doors">
            <div className="elevator-door-left" />
            <div className="elevator-door-right" />
          </div>
          <div className="elevator-display">
            <span className="elevator-floor-num">1F</span>
          </div>
          <div className="elevator-arrow">▲</div>
        </div>
        <div className="elevator-question">타시겠습니까?</div>
        <div className="elevator-buttons">
          <button
            className="elevator-btn elevator-yes"
            onClick={handleYes}
            onTouchStart={(e) => { e.preventDefault(); handleYes() }}
          >
            YES
          </button>
          <button
            className="elevator-btn elevator-no"
            onClick={handleNo}
            onTouchStart={(e) => { e.preventDefault(); handleNo() }}
          >
            NO
          </button>
        </div>
      </div>
    )
  }

  if (phase === 'riding') {
    return (
      <div className="elevator-screen riding">
        <div className="elevator-shaft">
          {/* Moving lines to show speed */}
          <div className="shaft-lines" />
        </div>
        <div className="elevator-cabin">
          <div className="elevator-display-large">
            <div className="elevator-label">FLOOR</div>
            <div className="elevator-counter">{formatNum(floorCount)}</div>
          </div>
          <div className="elevator-speed-indicator">
            ▲▲▲ GOING UP ▲▲▲
          </div>
          {/* Character inside elevator */}
          <div className="elevator-passenger">
            <div className="elevator-char-bounce" />
          </div>
        </div>
      </div>
    )
  }

  // arrived
  return (
    <div className="elevator-screen arrived">
      <div className="elevator-ding">DING!</div>
      <div className="elevator-arrived-text">
        <span className="arrived-floor">{formatNum(TARGET)}F</span>
        <span className="arrived-msg">도착하였습니다</span>
      </div>
      <div className="elevator-doors-open">
        <div className="elevator-door-left open" />
        <div className="elevator-door-right open" />
      </div>
    </div>
  )
}
