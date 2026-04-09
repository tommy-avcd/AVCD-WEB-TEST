import React, { useRef, useEffect } from 'react'
import { Game } from '../game/Game.js'

export default function GameScreen({ onUpdate, autoStart, playerChar, aiChar, startFloor }) {
  const canvasRef = useRef(null)
  const gameRef = useRef(null)
  const dirBtnRef = useRef(null)
  const stepBtnRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const resize = () => {
      const w = window.innerWidth
      const h = window.innerHeight
      canvas.width = w
      canvas.height = h
      canvas.style.width = w + 'px'
      canvas.style.height = h + 'px'
      if (gameRef.current) {
        gameRef.current.resize(w, h)
      }
    }

    const game = new Game(canvas, onUpdate, playerChar, aiChar, startFloor || 0)
    gameRef.current = game
    resize()

    if (autoStart) {
      game.start()
    }

    window.addEventListener('resize', resize)
    return () => {
      game.stop()
      window.removeEventListener('resize', resize)
    }
  }, [onUpdate, autoStart, playerChar, aiChar, startFloor])

  // Native touch/mouse event binding - bypasses React's synthetic events
  useEffect(() => {
    const dirBtn = dirBtnRef.current
    const stepBtn = stepBtnRef.current
    if (!dirBtn || !stepBtn) return

    let isTouchDevice = false

    const doLeft = () => {
      if (gameRef.current) gameRef.current.stepLeft()
    }

    const doRight = () => {
      if (gameRef.current) gameRef.current.stepUp()
    }

    // Touch handlers
    const onLeftTouch = (e) => {
      e.preventDefault()
      e.stopPropagation()
      isTouchDevice = true
      doLeft()
    }

    const onRightTouch = (e) => {
      e.preventDefault()
      e.stopPropagation()
      isTouchDevice = true
      doRight()
    }

    // Mouse handlers (only for desktop - skip if touch device)
    const onLeftMouse = (e) => {
      if (isTouchDevice) return
      e.preventDefault()
      doLeft()
    }

    const onRightMouse = (e) => {
      if (isTouchDevice) return
      e.preventDefault()
      doRight()
    }

    // Use { passive: false } to allow preventDefault on touch events
    dirBtn.addEventListener('touchstart', onLeftTouch, { passive: false })
    stepBtn.addEventListener('touchstart', onRightTouch, { passive: false })
    dirBtn.addEventListener('mousedown', onLeftMouse)
    stepBtn.addEventListener('mousedown', onRightMouse)

    // Prevent any default touch behavior on the control area
    const controlArea = dirBtn.parentElement
    const preventDefault = (e) => e.preventDefault()
    controlArea.addEventListener('touchmove', preventDefault, { passive: false })
    controlArea.addEventListener('touchend', preventDefault, { passive: false })

    return () => {
      dirBtn.removeEventListener('touchstart', onLeftTouch)
      stepBtn.removeEventListener('touchstart', onRightTouch)
      dirBtn.removeEventListener('mousedown', onLeftMouse)
      stepBtn.removeEventListener('mousedown', onRightMouse)
      controlArea.removeEventListener('touchmove', preventDefault)
      controlArea.removeEventListener('touchend', preventDefault)
    }
  }, [])

  // Keyboard support
  useEffect(() => {
    const handleKey = (e) => {
      // Left arrow / H = direction change + step left
      if (e.key === 'ArrowLeft' || e.key === 'h' || e.key === 'H') {
        e.preventDefault()
        if (gameRef.current) gameRef.current.stepLeft()
      }
      // Right arrow / K / L / Space / Up = step up (auto direction)
      if (e.key === 'ArrowRight' || e.key === 'k' || e.key === 'K' || e.key === 'l' || e.key === 'L' || e.key === 'ArrowUp' || e.key === ' ') {
        e.preventDefault()
        if (gameRef.current) gameRef.current.stepUp()
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [])

  return (
    <div className="game-screen">
      <canvas ref={canvasRef} className="game-canvas" />

      {/* HUD */}
      <div className="hud">
        <ScoreDisplay gameRef={gameRef} />
      </div>

      {/* Control Buttons - native event binding via refs */}
      <div className="controls">
        <div ref={dirBtnRef} className="ctrl-btn ctrl-direction" role="button">
          <div className="ctrl-icon">
            <svg viewBox="0 0 48 48" width="48" height="48">
              <path d="M10 24 L22 12 L22 20 L26 20 L26 12 L38 24 L26 36 L26 28 L22 28 L22 36 Z" fill="currentColor"/>
            </svg>
          </div>
        </div>
        <div ref={stepBtnRef} className="ctrl-btn ctrl-step" role="button">
          <div className="ctrl-icon">
            <svg viewBox="0 0 48 48" width="48" height="48">
              <path d="M24 8 L40 30 L8 30 Z" fill="currentColor"/>
            </svg>
          </div>
        </div>
      </div>
    </div>
  )
}

function TimerBar({ gameRef }) {
  const fillRef = useRef(null)

  useEffect(() => {
    let running = true
    const update = () => {
      if (!running) return
      const game = gameRef.current
      if (game && fillRef.current) {
        const ratio = Math.max(0, game.timeRemaining / game.timeLimit)
        fillRef.current.style.width = (ratio * 100) + '%'

        if (ratio > 0.5) {
          fillRef.current.style.background = 'linear-gradient(90deg, #44cc44, #88ee44)'
        } else if (ratio > 0.25) {
          fillRef.current.style.background = 'linear-gradient(90deg, #ffaa00, #ffdd44)'
        } else {
          fillRef.current.style.background = 'linear-gradient(90deg, #ff2222, #ff6644)'
          fillRef.current.style.opacity = 0.7 + Math.sin(Date.now() * 0.01) * 0.3
        }
      }
      requestAnimationFrame(update)
    }
    update()
    return () => { running = false }
  }, [gameRef])

  return (
    <div className="timer-bar">
      <div className="timer-bar-bg">
        <div className="timer-bar-fill" ref={fillRef} />
      </div>
    </div>
  )
}

function ScoreDisplay({ gameRef }) {
  const scoreRef = useRef(null)
  const coinRef = useRef(null)
  const comboRef = useRef(null)
  const aiScoreRef = useRef(null)

  useEffect(() => {
    let running = true
    const update = () => {
      if (!running) return
      const game = gameRef.current
      if (game) {
        if (scoreRef.current) scoreRef.current.textContent = game.score
        if (coinRef.current) coinRef.current.textContent = game.coins
        if (aiScoreRef.current) {
          aiScoreRef.current.textContent = game.ai ? game.ai.score : 0
        }
        if (comboRef.current) {
          if (game.combo >= 3) {
            comboRef.current.textContent = `x${game.combo}`
            comboRef.current.style.display = 'block'
            comboRef.current.style.transform = `scale(${1 + Math.sin(Date.now() * 0.01) * 0.1})`
          } else {
            comboRef.current.style.display = 'none'
          }
        }
      }
      requestAnimationFrame(update)
    }
    update()
    return () => { running = false }
  }, [gameRef])

  return (
    <div className="score-area">
      <div className="score-vs-row">
        <div className="score-ai">
          <span className="score-label">CPU</span>
          <span className="score-ai-num" ref={aiScoreRef}>0</span>
        </div>
        <div className="score-main" ref={scoreRef}>0</div>
        <div className="score-coins">
          <span className="coin-icon">●</span>
          <span ref={coinRef}>0</span>
        </div>
      </div>
      <div className="combo-display" ref={comboRef} style={{ display: 'none' }}>x0</div>
    </div>
  )
}
