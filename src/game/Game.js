import { SPRITES, drawSprite, drawCharSprite, drawStair, drawCoin, PALETTE } from './Sprites.js'
import { ParticleSystem } from './Particles.js'
import { soundManager } from './SoundManager.js'
import { CrowdSystem } from './CrowdSystem.js'
import { BackgroundTheme } from './BackgroundTheme.js'
import { WeatherSystem } from './WeatherSystem.js'
import { AIPlayer } from './AIPlayer.js'

const STAIR_WIDTH = 64
const STAIR_HEIGHT = 16
const STAIR_GAP_X = 48
const STAIR_GAP_Y = 40
const CHAR_PIXEL_SIZE = 2.5
const VISIBLE_STAIRS_AHEAD = 14
const VISIBLE_STAIRS_BEHIND = 20 // keep 20 past stairs visible
const COIN_CHANCE = 0.2
const COMBO_WINDOW = 600

// Speed: 3x faster every 20 floors
const SPEED_TIER = 20
const SPEED_MULTIPLIER = 3

export class Game {
  constructor(canvas, onUpdate, playerChar, aiChar, startFloor) {
    this.canvas = canvas
    this.ctx = canvas.getContext('2d')
    this.onUpdate = onUpdate
    this.playerChar = playerChar || null
    this.aiCharData = aiChar || null
    this.startFloor = startFloor || 0
    this.particles = new ParticleSystem()
    this.bgFireworks = new ParticleSystem()
    this.crowd = new CrowdSystem()
    this.bgTheme = new BackgroundTheme()
    this.weather = new WeatherSystem()
    this.ai = new AIPlayer()
    if (aiChar) this.ai.characterId = aiChar.id

    this.reset()
    this.animFrame = 0
    this.globalFrame = 0
    this.lastTime = 0
    this.running = false
    this.gameState = 'menu'

    // Camera
    this.cameraY = 0
    this.targetCameraY = 0
  }

  reset() {
    this.stairs = []
    this.currentStair = 0
    this.score = 0
    this.coins = 0
    this.facingRight = true
    this.charState = 'idle'
    this.runAnimTimer = 0

    // Combo
    this.combo = 0
    this.lastStepTime = 0
    this.fallStartFrame = 0

    // Speed system
    this.speedMultiplier = 1

    // High score
    this.highScore = parseInt(localStorage.getItem('infiniteStairs_highScore') || '0')
    this.highCoins = parseInt(localStorage.getItem('infiniteStairs_highCoins') || '0')

    // Generate initial stairs
    this._generateStairs(VISIBLE_STAIRS_AHEAD + VISIBLE_STAIRS_BEHIND)

    // Position character
    this.charX = 0
    this.charY = 0
    this._updateCharPosition()

    this.cameraY = 0
    this.targetCameraY = 0
    this.particles.clear()
    if (this.bgFireworks) this.bgFireworks.clear()

    // Reset AI
    this.ai.reset()
  }


  _generateStairs(count) {
    const startIdx = this.stairs.length
    const halfW = (this.canvas.width || 400) / 2
    const margin = STAIR_WIDTH + 20
    const maxX = halfW - margin
    const minX = -halfW + margin

    for (let i = 0; i < count; i++) {
      const idx = startIdx + i
      if (idx === 0) {
        this.stairs.push({
          x: 0, y: 0,
          direction: Math.random() > 0.5 ? 'right' : 'left',
          hasCoin: false, coinCollected: false
        })
      } else {
        const prev = this.stairs[idx - 1]
        let goRight = Math.random() > 0.5
        const nextX = prev.x + (goRight ? STAIR_GAP_X : -STAIR_GAP_X)
        if (nextX + STAIR_WIDTH > maxX) goRight = false
        else if (nextX < minX) goRight = true
        const x = prev.x + (goRight ? STAIR_GAP_X : -STAIR_GAP_X)
        this.stairs.push({
          x, y: prev.y - STAIR_GAP_Y,
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

  _getSpeedMultiplier() {
    const tier = Math.floor(this.currentStair / SPEED_TIER)
    return Math.pow(SPEED_MULTIPLIER, tier)
  }

  start() {
    this.gameState = 'playing'
    this.running = true
    this.reset()

    // Skip to start floor (elevator)
    if (this.startFloor > 0) {
      // Generate enough stairs
      this._generateStairs(this.startFloor + VISIBLE_STAIRS_AHEAD + VISIBLE_STAIRS_BEHIND)
      this.currentStair = this.startFloor
      this.score = this.startFloor
      this._updateCharPosition()
      // AI also starts at same floor
      this.ai.currentStair = this.startFloor
      this.ai.score = this.startFloor
      this.ai._calculateDeathFloor(this.startFloor)
    }

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
    if (navigator.vibrate) navigator.vibrate(20)
  }

  stepLeft() {
    if (this.gameState !== 'playing') return
    this.facingRight = false
    this._doStep('left')
  }

  stepRight() {
    if (this.gameState !== 'playing') return
    this.facingRight = true
    this._doStep('right')
  }

  stepUp() {
    if (this.gameState !== 'playing') return
    const nextStair = this.stairs[this.currentStair + 1]
    if (!nextStair) return
    this.facingRight = nextStair.direction === 'right'
    this._doStep(nextStair.direction)
  }

  _doStep(direction) {
    const nextStair = this.stairs[this.currentStair + 1]
    if (!nextStair) return

    if (nextStair.direction !== direction) {
      this._gameOver('fall')
      return
    }

    this.currentStair++
    this.score = this.currentStair
    this._updateCharPosition()
    this.speedMultiplier = this._getSpeedMultiplier()

    // Combo
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

    // Coin
    if (nextStair.hasCoin && !nextStair.coinCollected) {
      nextStair.coinCollected = true
      this.coins += 1 + Math.floor(this.combo / 5)
      soundManager.play('coin')
      this.particles.emit(this.charX, this.charY - 20, 'coinCollect', 8)
    }

    // Effects - NO screen shake (removed per user request)
    soundManager.play('step')
    this.particles.emit(this.charX + STAIR_WIDTH / 2, this.charY + 20 * CHAR_PIXEL_SIZE, 'dust', 4)

    // Firework in sky
    const w = this.canvas.width || 400
    const h = this.canvas.height || 700
    this.bgFireworks.emit(Math.random() * w, Math.random() * h * 0.6, 'firework', 25)

    // Speed lines at high combo
    if (this.combo >= 5) {
      this.particles.emit(0, this.charY, 'speedLine', 3)
    }

    // Running animation - duration scales with speed
    this.charState = 'running'
    this.runAnimTimer = 0.005

    // Generate more stairs
    if (this.currentStair > this.stairs.length - VISIBLE_STAIRS_AHEAD) {
      this._generateStairs(10)
    }

    // Check for treasure box at 100-floor milestones
    if (this.currentStair % 100 === 0 && this.currentStair > 0) {
      const treasure = this.bgTheme.collectTreasure(this.currentStair)
      if (treasure) {
        soundManager.play('coin')
        this.bgFireworks.emit(Math.random() * (this.canvas.width || 400), 100, 'firework', 40)
        this.bgFireworks.emit(Math.random() * (this.canvas.width || 400), 150, 'firework', 40)
      }
    }

    // Haptic
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
    if (navigator.vibrate) navigator.vibrate([50, 30, 50, 30, 100])

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
        timeRatio: 1,
        gameState: this.gameState,
        highScore: this.highScore,
        highCoins: this.highCoins,
        aiScore: this.ai.score,
        aiAlive: this.ai.alive,
      })
    }
  }

  _gameLoop() {
    if (!this.running) return

    const now = performance.now()
    const dt = Math.min(now - this.lastTime, 50)
    this.lastTime = now
    this.globalFrame++

    if (this.gameState === 'playing') {
      if (now - this.lastStepTime > COMBO_WINDOW * 2) {
        this.combo = 0
      }
    }

    // Animation state
    if (this.runAnimTimer > 0) {
      this.runAnimTimer -= dt * this.speedMultiplier
      if (this.runAnimTimer <= 0) {
        this.charState = 'idle'
      }
    }

    // Camera (smooth follow, NO shake)
    if (this.currentStair < this.stairs.length) {
      const stair = this.stairs[this.currentStair]
      this.targetCameraY = stair.y - this.canvas.height * 0.55
    }
    this.cameraY += (this.targetCameraY - this.cameraY) * 0.9

    // Particles
    this.particles.update()
    this.bgFireworks.update()

    // AI player update
    if (this.gameState === 'playing') {
      this.ai.update(dt, this.stairs, this.currentStair)
      this.ai.updateAnimation(dt)
      // If AI dies and player is still alive, player wins
      if (!this.ai.alive && this.gameState === 'playing') {
        // AI lost - game continues, player can keep going
      }
    }

    // Crowd system
    this.crowd.update(this.currentStair, dt)

    // Background theme & weather
    const w = this.canvas.width || 400
    const h = this.canvas.height || 700
    this.bgTheme.update(this.currentStair, w, h, dt)
    this.weather.update(this.currentStair, w, h, dt)

    // Animation frame - speed affects animation rate
    const animSpeed = Math.max(2, Math.floor(3 / this.speedMultiplier))
    if (this.charState === 'running') {
      this.animFrame = Math.floor(this.globalFrame / animSpeed) % 4
    } else {
      this.animFrame = Math.floor(this.globalFrame / 10) % 4
    }

    this._render()

    if (this.globalFrame % 3 === 0) {
      this._notifyUpdate()
    }

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

    ctx.fillStyle = '#1a1a2e'
    ctx.fillRect(0, 0, w, h)

    // Draw themed background sky
    this.bgTheme.drawSky(ctx, w, h, this.currentStair, this.globalFrame)

    // Day/night tint
    const tint = this.weather.getDayTint(this.currentStair)
    ctx.globalAlpha = tint.a
    ctx.fillStyle = `rgb(${tint.r},${tint.g},${tint.b})`
    ctx.fillRect(0, 0, w, h)
    ctx.globalAlpha = 1

    // Draw landmark buildings (replaces generic buildings)
    this.bgTheme.drawLandmarkBuildings(ctx, w, h, this.currentStair, this.globalFrame)

    // Draw flying background characters
    this.bgTheme.drawFlyingObjects(ctx, this.globalFrame)

    // Draw fireworks in screen space
    this.bgFireworks.draw(ctx)

    // Weather particles (behind stairs)
    this.weather.draw(ctx, w, h)

    // Camera transform
    ctx.save()
    const camOffsetX = w / 2
    const camOffsetY = -this.cameraY
    ctx.translate(camOffsetX, camOffsetY)

    // Draw stairs with themed colors
    this._drawStairs(ctx, w, h)

    // Draw AI character
    this._drawAICharacter(ctx)

    // Draw player character
    this._drawCharacter(ctx)

    // Draw particles (world space)
    this.particles.draw(ctx)

    ctx.restore()

    // Draw crowd (screen space, on top)
    this.crowd.draw(ctx, w, h)

    // AI death/respawn notification
    if (this.ai && this.ai.showDeath) {
      ctx.fillStyle = 'rgba(0,0,0,0.7)'
      ctx.fillRect(w * 0.05, h * 0.1, w * 0.9, 50)
      ctx.fillStyle = '#ff6644'
      ctx.font = 'bold 11px monospace'
      ctx.textAlign = 'center'
      ctx.fillText(this.ai.deathMessage, w / 2, h * 0.1 + 20)
      ctx.fillStyle = '#88ff88'
      ctx.font = '9px monospace'
      ctx.fillText('New challenger incoming...', w / 2, h * 0.1 + 38)
    }

    // Treasure notification
    this.bgTheme.drawTreasureNotification(ctx, w, h)

    // Speed overlay at high combo
    if (this.combo >= 10) {
      this._drawSpeedOverlay(ctx, w, h)
    }
  }

  // Buildings are now replaced by landmark system in BackgroundTheme

  _drawStairs(ctx, w, h) {
    const startIdx = Math.max(0, this.currentStair - VISIBLE_STAIRS_BEHIND)
    const endIdx = Math.min(this.stairs.length, this.currentStair + VISIBLE_STAIRS_AHEAD)

    // Get stair theme based on current floor
    const stairTheme = this.bgTheme.getStairTheme(this.currentStair)

    for (let i = startIdx; i < endIdx; i++) {
      const stair = this.stairs[i]

      if (i < this.currentStair) {
        ctx.globalAlpha = 0.5
      }

      if (i === this.currentStair) {
        ctx.globalAlpha = 1
        ctx.fillStyle = 'rgba(255, 255, 100, 0.15)'
        ctx.fillRect(stair.x - 4, stair.y - 4, STAIR_WIDTH + 8, STAIR_HEIGHT + 8)
      }

      // Use themed stair colors
      drawStair(ctx, stair.x, stair.y, STAIR_WIDTH, STAIR_HEIGHT, stairTheme)
      ctx.globalAlpha = 1

      // Treasure chest at 100-floor milestones
      if (i % 100 === 0 && i > 0 && !this.bgTheme.treasureCollected.has(i)) {
        this._drawTreasureChest(ctx, stair.x + STAIR_WIDTH / 2 - 8, stair.y - 28)
      }

      // Direction indicator for next stair
      if (i === this.currentStair + 1) {
        ctx.globalAlpha = 0.4 + Math.sin(this.globalFrame * 0.1) * 0.2
        ctx.fillStyle = '#ffdd44'
        const arrowX = stair.direction === 'right'
          ? stair.x + STAIR_WIDTH + 4
          : stair.x - 12
        ctx.fillRect(arrowX, stair.y + 2, 8, 3)
        if (stair.direction === 'right') {
          ctx.fillRect(arrowX + 6, stair.y, 3, 3)
          ctx.fillRect(arrowX + 6, stair.y + 4, 3, 3)
        } else {
          ctx.fillRect(arrowX - 2, stair.y, 3, 3)
          ctx.fillRect(arrowX - 2, stair.y + 4, 3, 3)
        }
        ctx.globalAlpha = 1
      }

      // Coin
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
      sprite = SPRITES.charRun[this.animFrame % SPRITES.charRun.length]
    } else {
      sprite = SPRITES.charIdle[this.animFrame % SPRITES.charIdle.length]
    }

    let yOffset = 0
    if (this.charState === 'idle') {
      yOffset = Math.sin(this.globalFrame * 0.08) * 2
    }
    if (this.charState === 'falling') {
      const fallFrames = this.globalFrame - (this.fallStartFrame || this.globalFrame)
      yOffset = Math.min(fallFrames * 3, 200)
    }

    drawCharSprite(
      ctx, sprite,
      this.charX + STAIR_WIDTH / 2 - 8 * CHAR_PIXEL_SIZE,
      this.charY + yOffset,
      CHAR_PIXEL_SIZE,
      !this.facingRight,
      this.playerChar
    )

    // Shadow
    ctx.fillStyle = 'rgba(0,0,0,0.3)'
    ctx.fillRect(
      this.charX + STAIR_WIDTH / 2 - 12,
      this.stairs[this.currentStair]?.y - 2 || 0,
      24, 3
    )
  }

  _drawAICharacter(ctx) {
    if (!this.ai || this.ai.currentStair >= this.stairs.length) return

    const stair = this.stairs[this.ai.currentStair]
    if (!stair) return

    const aiX = stair.x
    const aiY = stair.y - 20 * CHAR_PIXEL_SIZE

    let sprite
    if (this.ai.charState === 'falling') {
      sprite = SPRITES.charFall
    } else if (this.ai.charState === 'running') {
      sprite = SPRITES.charRun[this.animFrame % SPRITES.charRun.length]
    } else {
      sprite = SPRITES.charIdle[this.animFrame % SPRITES.charIdle.length]
    }

    let yOffset = 0
    if (this.ai.charState === 'idle' && this.ai.alive) {
      yOffset = Math.sin(this.globalFrame * 0.08 + 1) * 2
    }
    if (!this.ai.alive) {
      yOffset = 50
    }

    // Draw with slight transparency so player stands out
    ctx.globalAlpha = 0.85
    drawCharSprite(
      ctx, sprite,
      aiX + STAIR_WIDTH / 2 - 8 * CHAR_PIXEL_SIZE,
      aiY + yOffset,
      CHAR_PIXEL_SIZE,
      !this.ai.facingRight,
      this.ai.character || this.aiCharData
    )
    ctx.globalAlpha = 1

    // CPU label with generation and IQ
    ctx.fillStyle = '#ff8844'
    ctx.font = 'bold 8px monospace'
    ctx.textAlign = 'center'
    const label = `CPU #${this.ai.generation} (IQ:${this.ai.intelligence})`
    ctx.fillText(label, aiX + STAIR_WIDTH / 2, aiY - 5)
  }

  _drawTreasureChest(ctx, x, y) {
    // Chest body
    ctx.fillStyle = '#aa7722'
    ctx.fillRect(x, y, 16, 12)
    // Lid
    ctx.fillStyle = '#cc9933'
    ctx.fillRect(x - 1, y - 4, 18, 5)
    // Lock
    ctx.fillStyle = '#ffdd44'
    ctx.fillRect(x + 6, y + 2, 4, 4)
    // Sparkle
    if (this.globalFrame % 20 < 10) {
      ctx.fillStyle = '#ffff88'
      ctx.fillRect(x + 2, y - 8, 2, 2)
      ctx.fillRect(x + 12, y - 6, 2, 2)
    }
  }

  _drawSpeedOverlay(ctx, w, h) {
    const intensity = Math.min((this.combo - 10) / 20, 1)
    ctx.globalAlpha = intensity * 0.15
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
