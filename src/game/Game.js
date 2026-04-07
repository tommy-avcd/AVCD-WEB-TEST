import { SPRITES, drawSprite, drawStair, drawCoin, PALETTE } from './Sprites.js'
import { ParticleSystem } from './Particles.js'
import { soundManager } from './SoundManager.js'

const STAIR_WIDTH = 64
const STAIR_HEIGHT = 16
const STAIR_GAP_X = 48  // horizontal offset between stairs
const STAIR_GAP_Y = 40  // vertical offset between stairs
const CHAR_PIXEL_SIZE = 2.5
const VISIBLE_STAIRS = 14
const COIN_CHANCE = 0.2 // 20% chance for coin
const COMBO_WINDOW = 600 // ms for combo

// Timer settings
const BASE_TIME_LIMIT = 7000 // ms base time per step (starts slow)
const TIME_REDUCTION_PER_TIER = 300 // ms reduction every 50 stairs
const TIER_SIZE = 50
const MIN_TIME_LIMIT = 800 // minimum time limit

export class Game {
  constructor(canvas, onUpdate) {
    this.canvas = canvas
    this.ctx = canvas.getContext('2d')
    this.onUpdate = onUpdate
    this.particles = new ParticleSystem()

    this.reset()
    this.animFrame = 0
    this.globalFrame = 0
    this.lastTime = 0
    this.running = false
    this.gameState = 'menu' // menu, playing, gameover

    // Screen shake
    this.shakeX = 0
    this.shakeY = 0
    this.shakeIntensity = 0

    // Camera
    this.cameraY = 0
    this.targetCameraY = 0

    // Background buildings
    this.buildings = this._generateBuildings()

    // Pre-render background
    this.bgFrame = 0
  }

  reset() {
    this.stairs = []
    this.currentStair = 0
    this.score = 0
    this.coins = 0
    this.facingRight = true
    this.charState = 'idle' // idle, running, falling
    this.runAnimTimer = 0

    // Timer
    this.timeRemaining = BASE_TIME_LIMIT
    this.timeLimit = BASE_TIME_LIMIT

    // Combo
    this.combo = 0
    this.lastStepTime = 0
    this.fallStartFrame = 0

    // High score
    this.highScore = parseInt(localStorage.getItem('infiniteStairs_highScore') || '0')
    this.highCoins = parseInt(localStorage.getItem('infiniteStairs_highCoins') || '0')

    // Generate initial stairs
    this._generateStairs(VISIBLE_STAIRS + 10)

    // Position character
    this.charX = 0
    this.charY = 0
    this._updateCharPosition()

    this.cameraY = 0
    this.targetCameraY = 0
    this.particles.clear()
  }

  _generateBuildings() {
    const buildings = []
    for (let i = 0; i < 8; i++) {
      buildings.push({
        x: Math.random() * 400,
        width: 30 + Math.random() * 60,
        height: 100 + Math.random() * 300,
        color: ['#2a2a4e', '#3a3a5e', '#252545', '#35354a'][Math.floor(Math.random() * 4)],
        windows: Math.random() > 0.3
      })
    }
    return buildings
  }

  _generateStairs(count) {
    const startIdx = this.stairs.length
    for (let i = 0; i < count; i++) {
      const idx = startIdx + i
      if (idx === 0) {
        // First stair - center
        this.stairs.push({
          x: 0,
          y: 0,
          direction: Math.random() > 0.5 ? 'right' : 'left',
          hasCoin: false,
          coinCollected: false
        })
      } else {
        const prev = this.stairs[idx - 1]
        const goRight = Math.random() > 0.5
        this.stairs.push({
          x: prev.x + (goRight ? STAIR_GAP_X : -STAIR_GAP_X),
          y: prev.y - STAIR_GAP_Y,
          direction: goRight ? 'right' : 'left',
          hasCoin: Math.random() < COIN_CHANCE,
          coinCollected: false
        })
      }
    }
  }

  _updateCharPosition() {
    if (this.currentStair < this.stairs.length) {
      const stair = this.stairs[this.currentStair]
      this.charX = stair.x
      this.charY = stair.y - 20 * CHAR_PIXEL_SIZE
    }
  }

  getTimeLimit() {
    const tier = Math.floor(this.currentStair / TIER_SIZE)
    return Math.max(MIN_TIME_LIMIT, BASE_TIME_LIMIT - tier * TIME_REDUCTION_PER_TIER)
  }

  start() {
    this.gameState = 'playing'
    this.running = true
    this.reset()
    this.timeLimit = this.getTimeLimit()
    this.timeRemaining = this.timeLimit
    this.lastTime = performance.now()
    soundManager.init()
    soundManager.play('start')
    this._gameLoop()
  }

  stop() {
    this.running = false
  }

  changeDirection() {
    if (this.gameState !== 'playing') return
    this.facingRight = !this.facingRight
    // Haptic feedback
    if (navigator.vibrate) navigator.vibrate(20)
  }

  stepUp() {
    if (this.gameState !== 'playing') return

    const nextStair = this.stairs[this.currentStair + 1]
    if (!nextStair) return

    // Check if direction matches
    const needFaceRight = nextStair.direction === 'right'
    if (this.facingRight !== needFaceRight) {
      this._gameOver('fall')
      return
    }

    // Move up
    this.currentStair++
    this.score = this.currentStair
    this._updateCharPosition()

    // Combo system
    const now = performance.now()
    if (now - this.lastStepTime < COMBO_WINDOW) {
      this.combo++
      if (this.combo > 0 && this.combo % 5 === 0) {
        soundManager.play('combo')
        this.particles.emit(this.charX, this.charY, 'comboText', `${this.combo} COMBO!`)
      }
    } else {
      this.combo = 0
    }
    this.lastStepTime = now

    // Collect coin
    if (nextStair.hasCoin && !nextStair.coinCollected) {
      nextStair.coinCollected = true
      const coinBonus = 1 + Math.floor(this.combo / 5)
      this.coins += coinBonus
      soundManager.play('coin')
      this.particles.emit(this.charX, this.charY - 20, 'coinCollect', 8)
    }

    // Reset timer
    this.timeLimit = this.getTimeLimit()
    this.timeRemaining = this.timeLimit

    // Effects
    soundManager.play('step')
    this.shakeIntensity = 3 + Math.min(this.combo * 0.5, 5)
    this.particles.emit(this.charX + STAIR_WIDTH / 2, this.charY + 20 * CHAR_PIXEL_SIZE, 'dust', 4)

    // Speed lines at high combo
    if (this.combo >= 5) {
      this.particles.emit(0, this.charY, 'speedLine', 3)
    }

    // Running animation
    this.charState = 'running'
    this.runAnimTimer = 200

    // Generate more stairs if needed
    if (this.currentStair > this.stairs.length - VISIBLE_STAIRS) {
      this._generateStairs(10)
    }

    // Haptic feedback
    if (navigator.vibrate) {
      navigator.vibrate(this.combo >= 5 ? [15, 5, 15] : 15)
    }

    this._notifyUpdate()
  }

  _gameOver(reason) {
    this.gameState = 'gameover'
    this.charState = reason === 'fall' ? 'falling' : 'idle'
    this.fallStartFrame = this.globalFrame
    soundManager.play('gameover')

    // Strong haptic
    if (navigator.vibrate) navigator.vibrate([50, 30, 50, 30, 100])

    // Big shake
    this.shakeIntensity = 15

    // Update high scores
    if (this.score > this.highScore) {
      this.highScore = this.score
      localStorage.setItem('infiniteStairs_highScore', this.score.toString())
    }
    if (this.coins > this.highCoins) {
      this.highCoins = this.coins
      localStorage.setItem('infiniteStairs_highCoins', this.coins.toString())
    }

    this._notifyUpdate()
  }

  _notifyUpdate() {
    if (this.onUpdate) {
      this.onUpdate({
        score: this.score,
        coins: this.coins,
        combo: this.combo,
        timeRatio: this.timeRemaining / this.timeLimit,
        gameState: this.gameState,
        highScore: this.highScore,
        highCoins: this.highCoins,
      })
    }
  }

  _gameLoop() {
    if (!this.running) return

    const now = performance.now()
    const dt = Math.min(now - this.lastTime, 50) // cap delta
    this.lastTime = now

    this.globalFrame++

    if (this.gameState === 'playing') {
      // Update timer
      this.timeRemaining -= dt
      if (this.timeRemaining <= 0) {
        this._gameOver('timeout')
      }

      // Decay combo
      if (now - this.lastStepTime > COMBO_WINDOW * 2) {
        this.combo = 0
      }
    }

    // Update animation state
    if (this.runAnimTimer > 0) {
      this.runAnimTimer -= dt
      if (this.runAnimTimer <= 0) {
        this.charState = 'idle'
      }
    }

    // Update camera (smooth follow)
    if (this.currentStair < this.stairs.length) {
      const stair = this.stairs[this.currentStair]
      this.targetCameraY = stair.y - this.canvas.height * 0.55
    }
    this.cameraY += (this.targetCameraY - this.cameraY) * 0.12

    // Update screen shake
    if (this.shakeIntensity > 0) {
      this.shakeX = (Math.random() - 0.5) * this.shakeIntensity
      this.shakeY = (Math.random() - 0.5) * this.shakeIntensity
      this.shakeIntensity *= 0.85
      if (this.shakeIntensity < 0.5) {
        this.shakeIntensity = 0
        this.shakeX = 0
        this.shakeY = 0
      }
    }

    // Update particles
    this.particles.update()

    // Animation frame counter
    this.animFrame = Math.floor(this.globalFrame / 20) % 2

    // Render
    this._render()

    // Notify UI
    if (this.globalFrame % 3 === 0) {
      this._notifyUpdate()
    }

    // Stop loop after gameover animation completes
    if (this.gameState === 'gameover' && this.globalFrame - this.fallStartFrame > 60) {
      this._notifyUpdate()
      return
    }

    requestAnimationFrame(() => this._gameLoop())
  }

  _render() {
    const { ctx, canvas } = this
    const w = canvas.width
    const h = canvas.height

    // Clear
    ctx.fillStyle = '#1a1a2e'
    ctx.fillRect(0, 0, w, h)

    ctx.save()
    ctx.translate(this.shakeX, this.shakeY)

    // Draw background
    this._drawBackground(ctx, w, h)

    // Apply camera transform
    ctx.save()
    const camOffsetX = w / 2
    const camOffsetY = -this.cameraY
    ctx.translate(camOffsetX, camOffsetY)

    // Draw stairs
    this._drawStairs(ctx, w, h)

    // Draw character
    this._drawCharacter(ctx)

    // Draw particles (world space)
    this.particles.draw(ctx)

    ctx.restore()

    // Draw speed lines (screen space)
    if (this.combo >= 10) {
      this._drawSpeedOverlay(ctx, w, h)
    }

    ctx.restore()
  }

  _drawBackground(ctx, w, h) {
    // Sky gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, h)
    gradient.addColorStop(0, '#1a1a3e')
    gradient.addColorStop(0.5, '#2a2a5e')
    gradient.addColorStop(1, '#3a3a7e')
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, w, h)

    // Stars
    ctx.fillStyle = '#ffffff'
    for (let i = 0; i < 30; i++) {
      const sx = (i * 137.5 + this.globalFrame * 0.02) % w
      const sy = (i * 97.3) % (h * 0.6)
      const blink = Math.sin(this.globalFrame * 0.05 + i) > 0.3
      if (blink) {
        const size = (i % 3 === 0) ? 2 : 1
        ctx.fillRect(sx, sy, size, size)
      }
    }

    // Buildings (parallax)
    const parallax = this.cameraY * 0.1
    for (const b of this.buildings) {
      ctx.fillStyle = b.color
      const by = h - b.height + parallax % 50
      ctx.fillRect(b.x, by, b.width, b.height)

      // Windows
      if (b.windows) {
        ctx.fillStyle = '#ffdd44'
        for (let wy = by + 10; wy < h; wy += 16) {
          for (let wx = b.x + 6; wx < b.x + b.width - 6; wx += 12) {
            if (Math.sin(wx * 7 + wy * 3 + this.globalFrame * 0.01) > 0.3) {
              ctx.globalAlpha = 0.6 + Math.sin(this.globalFrame * 0.03 + wx) * 0.3
              ctx.fillRect(wx, wy, 5, 6)
            }
          }
        }
        ctx.globalAlpha = 1
      }
    }
  }

  _drawStairs(ctx, w, h) {
    const startIdx = Math.max(0, this.currentStair - 3)
    const endIdx = Math.min(this.stairs.length, this.currentStair + VISIBLE_STAIRS)

    for (let i = startIdx; i < endIdx; i++) {
      const stair = this.stairs[i]

      // Stair highlight for current
      if (i === this.currentStair) {
        ctx.fillStyle = 'rgba(255, 255, 100, 0.15)'
        ctx.fillRect(stair.x - 4, stair.y - 4, STAIR_WIDTH + 8, STAIR_HEIGHT + 8)
      }

      drawStair(ctx, stair.x, stair.y, STAIR_WIDTH, STAIR_HEIGHT)

      // Direction indicator for next stair
      if (i === this.currentStair + 1) {
        ctx.globalAlpha = 0.4 + Math.sin(this.globalFrame * 0.1) * 0.2
        ctx.fillStyle = '#ffdd44'
        const arrowX = stair.direction === 'right'
          ? stair.x + STAIR_WIDTH + 4
          : stair.x - 12
        ctx.fillRect(arrowX, stair.y + 2, 8, 3)
        // Arrow head
        if (stair.direction === 'right') {
          ctx.fillRect(arrowX + 6, stair.y, 3, 3)
          ctx.fillRect(arrowX + 6, stair.y + 4, 3, 3)
        } else {
          ctx.fillRect(arrowX - 2, stair.y, 3, 3)
          ctx.fillRect(arrowX - 2, stair.y + 4, 3, 3)
        }
        ctx.globalAlpha = 1
      }

      // Draw coin
      if (stair.hasCoin && !stair.coinCollected) {
        drawCoin(ctx, stair.x + STAIR_WIDTH / 2 - 6, stair.y - 22, 12, this.globalFrame)
      }
    }
  }

  _drawCharacter(ctx) {
    let sprite
    if (this.charState === 'falling') {
      sprite = SPRITES.charFall
    } else if (this.charState === 'running') {
      sprite = SPRITES.charRun[this.animFrame]
    } else {
      sprite = SPRITES.charIdle[this.animFrame]
    }

    // Add breathing bob for idle
    let yOffset = 0
    if (this.charState === 'idle') {
      yOffset = Math.sin(this.globalFrame * 0.08) * 2
    }

    // Falling animation
    if (this.charState === 'falling') {
      const fallFrames = this.globalFrame - (this.fallStartFrame || this.globalFrame)
      yOffset = Math.min(fallFrames * 3, 200)
    }

    drawSprite(
      ctx,
      sprite,
      this.charX + STAIR_WIDTH / 2 - 8 * CHAR_PIXEL_SIZE,
      this.charY + yOffset,
      CHAR_PIXEL_SIZE,
      !this.facingRight
    )

    // Shadow under character
    ctx.fillStyle = 'rgba(0,0,0,0.3)'
    ctx.fillRect(
      this.charX + STAIR_WIDTH / 2 - 12,
      this.stairs[this.currentStair]?.y - 2 || 0,
      24,
      3
    )
  }

  _drawSpeedOverlay(ctx, w, h) {
    const intensity = Math.min((this.combo - 10) / 20, 1)
    ctx.globalAlpha = intensity * 0.15

    // Vignette / tunnel effect
    const gradient = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w * 0.7)
    gradient.addColorStop(0, 'transparent')
    gradient.addColorStop(1, '#ff4444')
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, w, h)
    ctx.globalAlpha = 1
  }

  resize(width, height) {
    this.canvas.width = width
    this.canvas.height = height
  }
}
