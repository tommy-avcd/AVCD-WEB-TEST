import React, { useRef, useEffect } from 'react'
import { Game } from '../game/Game.js'

export default function GameScreen({ onUpdate, autoStart, playerChar, startFloor }) {
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

    const game = new Game(canvas, onUpdate, playerChar, null, startFloor || 0)
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
  }, [onUpdate, autoStart, playerChar, startFloor])

  // Native touch/mouse with HOLD support for continuous climbing
  useEffect(() => {
    const dirBtn = dirBtnRef.current
    const stepBtn = stepBtnRef.current
    if (!dirBtn || !stepBtn) return

    let isTouchDevice = false
    let leftHoldInterval = null
    let rightHoldInterval = null
    const HOLD_RATE = 30 // ms between steps when holding

    const doLeft = () => {
      if (gameRef.current) gameRef.current.stepLeft()
    }
    const doRight = () => {
      if (gameRef.current) gameRef.current.stepUp()
    }

    const startLeftHold = () => {
      doLeft()
      if (leftHoldInterval) clearInterval(leftHoldInterval)
      leftHoldInterval = setInterval(doLeft, HOLD_RATE)
    }
    const stopLeftHold = () => {
      if (leftHoldInterval) { clearInterval(leftHoldInterval); leftHoldInterval = null }
    }
    const startRightHold = () => {
      doRight()
      if (rightHoldInterval) clearInterval(rightHoldInterval)
      rightHoldInterval = setInterval(doRight, HOLD_RATE)
    }
    const stopRightHold = () => {
      if (rightHoldInterval) { clearInterval(rightHoldInterval); rightHoldInterval = null }
    }

    // Touch handlers
    const onLeftTouchStart = (e) => {
      e.preventDefault(); e.stopPropagation()
      isTouchDevice = true
      startLeftHold()
    }
    const onLeftTouchEnd = (e) => {
      e.preventDefault()
      stopLeftHold()
    }
    const onRightTouchStart = (e) => {
      e.preventDefault(); e.stopPropagation()
      isTouchDevice = true
      startRightHold()
    }
    const onRightTouchEnd = (e) => {
      e.preventDefault()
      stopRightHold()
    }

    // Mouse handlers
    const onLeftMouseDown = (e) => {
      if (isTouchDevice) return
      e.preventDefault()
      startLeftHold()
    }
    const onLeftMouseUp = () => { if (!isTouchDevice) stopLeftHold() }
    const onRightMouseDown = (e) => {
      if (isTouchDevice) return
      e.preventDefault()
      startRightHold()
    }
    const onRightMouseUp = () => { if (!isTouchDevice) stopRightHold() }

    // Bind events
    dirBtn.addEventListener('touchstart', onLeftTouchStart, { passive: false })
    dirBtn.addEventListener('touchend', onLeftTouchEnd, { passive: false })
    dirBtn.addEventListener('touchcancel', onLeftTouchEnd, { passive: false })
    stepBtn.addEventListener('touchstart', onRightTouchStart, { passive: false })
    stepBtn.addEventListener('touchend', onRightTouchEnd, { passive: false })
    stepBtn.addEventListener('touchcancel', onRightTouchEnd, { passive: false })

    dirBtn.addEventListener('mousedown', onLeftMouseDown)
    dirBtn.addEventListener('mouseup', onLeftMouseUp)
    dirBtn.addEventListener('mouseleave', onLeftMouseUp)
    stepBtn.addEventListener('mousedown', onRightMouseDown)
    stepBtn.addEventListener('mouseup', onRightMouseUp)
    stepBtn.addEventListener('mouseleave', onRightMouseUp)

    // Prevent default on control area
    const controlArea = dirBtn.parentElement
    const preventDefault = (e) => e.preventDefault()
    controlArea.addEventListener('touchmove', preventDefault, { passive: false })

    return () => {
      stopLeftHold(); stopRightHold()
      dirBtn.removeEventListener('touchstart', onLeftTouchStart)
      dirBtn.removeEventListener('touchend', onLeftTouchEnd)
      dirBtn.removeEventListener('touchcancel', onLeftTouchEnd)
      stepBtn.removeEventListener('touchstart', onRightTouchStart)
      stepBtn.removeEventListener('touchend', onRightTouchEnd)
      stepBtn.removeEventListener('touchcancel', onRightTouchEnd)
      dirBtn.removeEventListener('mousedown', onLeftMouseDown)
      dirBtn.removeEventListener('mouseup', onLeftMouseUp)
      dirBtn.removeEventListener('mouseleave', onLeftMouseUp)
      stepBtn.removeEventListener('mousedown', onRightMouseDown)
      stepBtn.removeEventListener('mouseup', onRightMouseUp)
      stepBtn.removeEventListener('mouseleave', onRightMouseUp)
      controlArea.removeEventListener('touchmove', preventDefault)
    }
  }, [])

  // Keyboard support with hold
  useEffect(() => {
    let leftInterval = null
    let rightInterval = null
    const HOLD_RATE = 30

    const handleKeyDown = (e) => {
      if (e.repeat) return // prevent key repeat stacking
      if (e.key === 'ArrowLeft' || e.key === 'h' || e.key === 'H') {
        e.preventDefault()
        if (gameRef.current) gameRef.current.stepLeft()
        if (!leftInterval) leftInterval = setInterval(() => {
          if (gameRef.current) gameRef.current.stepLeft()
        }, HOLD_RATE)
      }
      if (e.key === 'ArrowRight' || e.key === 'k' || e.key === 'K' || e.key === 'l' || e.key === 'L' || e.key === 'ArrowUp' || e.key === ' ') {
        e.preventDefault()
        if (gameRef.current) gameRef.current.stepUp()
        if (!rightInterval) rightInterval = setInterval(() => {
          if (gameRef.current) gameRef.current.stepUp()
        }, HOLD_RATE)
      }
    }
    const handleKeyUp = (e) => {
      if (e.key === 'ArrowLeft' || e.key === 'h' || e.key === 'H') {
        if (leftInterval) { clearInterval(leftInterval); leftInterval = null }
      }
      if (e.key === 'ArrowRight' || e.key === 'k' || e.key === 'K' || e.key === 'l' || e.key === 'L' || e.key === 'ArrowUp' || e.key === ' ') {
        if (rightInterval) { clearInterval(rightInterval); rightInterval = null }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)
    return () => {
      if (leftInterval) clearInterval(leftInterval)
      if (rightInterval) clearInterval(rightInterval)
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [])

  return (
    <div className="game-screen">
      <canvas ref={canvasRef} className="game-canvas" />

      {/* HUD */}
      <div className="hud">
        <ScoreDisplay gameRef={gameRef} />
      </div>

      {/* Control Buttons */}
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

function ScoreDisplay({ gameRef }) {
  const scoreRef = useRef(null)
  const coinRef = useRef(null)
  const comboRef = useRef(null)

  useEffect(() => {
    let running = true
    const update = () => {
      if (!running) return
      const game = gameRef.current
      if (game) {
        if (scoreRef.current) scoreRef.current.textContent = game.score.toLocaleString()
        if (coinRef.current) coinRef.current.textContent = game.coins
        if (comboRef.current) {
          if (game.combo >= 3) {
            comboRef.current.textContent = `x${game.combo}`
            comboRef.current.style.display = 'block'
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
      <div className="score-main" ref={scoreRef}>0</div>
      <div className="score-coins">
        <span className="coin-icon">●</span>
        <span ref={coinRef}>0</span>
      </div>
      <div className="combo-display" ref={comboRef} style={{ display: 'none' }}>x0</div>
    </div>
  )
}
