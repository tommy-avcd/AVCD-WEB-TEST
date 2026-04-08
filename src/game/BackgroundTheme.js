// Background themes that change every 100 floors
// Includes sky colors and flying background characters

const THEMES = [
  { floor: 0, sky: ['#1a1a3e', '#2a2a5e', '#3a3a7e'], name: 'Night City' },
  { floor: 100, sky: ['#1a0a2e', '#3a1a4e', '#5a2a6e'], name: 'Purple Night' },
  { floor: 200, sky: ['#0a1a2e', '#1a3a5e', '#2a5a7e'], name: 'Deep Ocean' },
  { floor: 300, sky: ['#2e1a0a', '#5e3a1a', '#8e5a2a'], name: 'Desert Dusk' },
  { floor: 400, sky: ['#0a2e1a', '#1a5e3a', '#2a7e5a'], name: 'Aurora Green' },
  { floor: 500, sky: ['#2e0a1a', '#5e1a3a', '#7e2a4a'], name: 'Crimson Sky' },
  { floor: 600, sky: ['#1a1a1a', '#2a2a3a', '#3a3a5a'], name: 'Storm' },
  { floor: 700, sky: ['#0a0a3e', '#1a1a6e', '#3a3aae'], name: 'Galaxy' },
  { floor: 800, sky: ['#3e1a1a', '#6e2a1a', '#ae4a1a'], name: 'Volcano' },
  { floor: 900, sky: ['#1a2e3e', '#2a4e6e', '#4a7eae'], name: 'Dawn' },
  { floor: 1000, sky: ['#0a0a0a', '#1a1a2a', '#2a2a4a'], name: 'Deep Space' },
  { floor: 1100, sky: ['#2e2e0a', '#4e4e1a', '#7e7e2a'], name: 'Golden Hour' },
  { floor: 1200, sky: ['#0a2e2e', '#1a4e4e', '#2a6e6e'], name: 'Teal Ocean' },
  { floor: 1300, sky: ['#2e0a2e', '#4e1a4e', '#7e2a7e'], name: 'Neon Purple' },
  { floor: 1400, sky: ['#1a0a0a', '#3e1a0a', '#6e3a1a'], name: 'Mars' },
  { floor: 1500, sky: ['#0a0a1a', '#0a0a3a', '#1a1a6a'], name: 'Midnight' },
  { floor: 1600, sky: ['#2e1a2e', '#4e3a4e', '#7e5a7e'], name: 'Lavender' },
  { floor: 1700, sky: ['#1a2e0a', '#3a5e1a', '#5a8e2a'], name: 'Northern Lights' },
  { floor: 1800, sky: ['#3e2e1a', '#6e4e2a', '#ae7e3a'], name: 'Copper' },
  { floor: 1900, sky: ['#0a1a3e', '#1a3a6e', '#2a5aae'], name: 'Sapphire' },
  { floor: 2000, sky: ['#000000', '#0a0a1a', '#1a1a3a'], name: 'Void' },
]

// Background flying characters
const BG_CHARACTERS = [
  { type: 'dragon', minFloor: 100, emoji: null, color1: '#44cc44', color2: '#228822', w: 40, h: 20 },
  { type: 'ufo', minFloor: 300, emoji: null, color1: '#aaaacc', color2: '#6666aa', w: 30, h: 12 },
  { type: 'astronaut', minFloor: 500, emoji: null, color1: '#ffffff', color2: '#aaaacc', w: 16, h: 20 },
  { type: 'rocket', minFloor: 700, emoji: null, color1: '#ff4444', color2: '#ffaa00', w: 12, h: 28 },
  { type: 'robot', minFloor: 900, emoji: null, color1: '#888899', color2: '#5555aa', w: 18, h: 22 },
  { type: 'bird', minFloor: 0, emoji: null, color1: '#ffaa44', color2: '#cc7722', w: 20, h: 10 },
  { type: 'balloon', minFloor: 200, emoji: null, color1: '#ff4488', color2: '#cc2266', w: 14, h: 20 },
  { type: 'witch', minFloor: 600, emoji: null, color1: '#2a1a4e', color2: '#ffaa00', w: 24, h: 20 },
  { type: 'angel', minFloor: 1000, emoji: null, color1: '#ffffff', color2: '#ffddaa', w: 20, h: 20 },
  { type: 'phoenix', minFloor: 1500, emoji: null, color1: '#ff6600', color2: '#ffdd00', w: 36, h: 18 },
  { type: 'satellite', minFloor: 800, emoji: null, color1: '#aabbcc', color2: '#667788', w: 24, h: 8 },
  { type: 'comet', minFloor: 1200, emoji: null, color1: '#aaddff', color2: '#4488ff', w: 30, h: 6 },
]

export class BackgroundTheme {
  constructor() {
    this.flyingObjects = []
    this.lastSpawnFloor = 0
  }

  getTheme(floor) {
    let theme = THEMES[0]
    for (const t of THEMES) {
      if (floor >= t.floor) theme = t
      else break
    }
    // Cycle after all themes
    if (floor >= 2100) {
      const idx = Math.floor((floor - 2100) / 100) % THEMES.length
      theme = THEMES[idx]
    }
    return theme
  }

  update(floor, w, h, dt) {
    // Spawn new flying objects every 20 floors
    if (floor - this.lastSpawnFloor >= 20 && floor > 50) {
      this.lastSpawnFloor = floor
      const available = BG_CHARACTERS.filter(c => floor >= c.minFloor)
      if (available.length > 0) {
        const charType = available[Math.floor(Math.random() * available.length)]
        this.flyingObjects.push({
          ...charType,
          x: -50,
          y: Math.random() * h * 0.5 + 20,
          vx: 0.3 + Math.random() * 0.8,
          vy: (Math.random() - 0.5) * 0.3,
          phase: Math.random() * Math.PI * 2,
          scale: 0.8 + Math.random() * 0.6,
        })
      }
    }

    // Update flying objects
    for (let i = this.flyingObjects.length - 1; i >= 0; i--) {
      const obj = this.flyingObjects[i]
      obj.x += obj.vx
      obj.y += Math.sin(obj.phase) * 0.3
      obj.phase += 0.02
      if (obj.x > w + 100) {
        this.flyingObjects.splice(i, 1)
      }
    }
  }

  drawSky(ctx, w, h, floor, globalFrame) {
    const theme = this.getTheme(floor)
    const gradient = ctx.createLinearGradient(0, 0, 0, h)
    gradient.addColorStop(0, theme.sky[0])
    gradient.addColorStop(0.5, theme.sky[1])
    gradient.addColorStop(1, theme.sky[2])
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, w, h)

    // Stars
    ctx.fillStyle = '#ffffff'
    for (let i = 0; i < 30; i++) {
      const sx = (i * 137.5 + globalFrame * 0.02) % w
      const sy = (i * 97.3) % (h * 0.6)
      const blink = Math.sin(globalFrame * 0.05 + i) > 0.3
      if (blink) {
        ctx.fillRect(sx, sy, (i % 3 === 0) ? 2 : 1, (i % 3 === 0) ? 2 : 1)
      }
    }
  }

  drawFlyingObjects(ctx, globalFrame) {
    for (const obj of this.flyingObjects) {
      ctx.save()
      ctx.translate(obj.x, obj.y)
      ctx.scale(obj.scale, obj.scale)

      switch (obj.type) {
        case 'dragon':
          this._drawDragon(ctx, globalFrame)
          break
        case 'ufo':
          this._drawUFO(ctx, globalFrame)
          break
        case 'astronaut':
          this._drawAstronaut(ctx, globalFrame)
          break
        case 'rocket':
          this._drawRocket(ctx, globalFrame)
          break
        case 'robot':
          this._drawRobot(ctx, globalFrame)
          break
        case 'bird':
          this._drawBird(ctx, globalFrame)
          break
        case 'balloon':
          this._drawBalloon(ctx, globalFrame)
          break
        case 'witch':
          this._drawWitch(ctx, globalFrame)
          break
        case 'angel':
          this._drawAngel(ctx, globalFrame)
          break
        case 'phoenix':
          this._drawPhoenix(ctx, globalFrame)
          break
        case 'satellite':
          this._drawSatellite(ctx, globalFrame)
          break
        case 'comet':
          this._drawComet(ctx, globalFrame)
          break
      }
      ctx.restore()
    }
  }

  _drawDragon(ctx, f) {
    // Body
    ctx.fillStyle = '#44cc44'
    ctx.fillRect(-15, -5, 30, 10)
    // Head
    ctx.fillStyle = '#33aa33'
    ctx.fillRect(15, -8, 10, 12)
    // Eye
    ctx.fillStyle = '#ff0000'
    ctx.fillRect(20, -5, 3, 3)
    // Wings
    const wingY = Math.sin(f * 0.15) * 5
    ctx.fillStyle = '#228822'
    ctx.fillRect(-5, -12 + wingY, 15, 5)
    ctx.fillRect(-5, 7 - wingY, 15, 5)
    // Tail
    ctx.fillStyle = '#44cc44'
    ctx.fillRect(-25, -3, 12, 6)
    // Fire
    if (f % 30 < 15) {
      ctx.fillStyle = '#ff6600'
      ctx.fillRect(25, -4, 8, 3)
      ctx.fillStyle = '#ffcc00'
      ctx.fillRect(25, -1, 6, 2)
    }
  }

  _drawUFO(ctx, f) {
    // Dome
    ctx.fillStyle = '#aaddff'
    ctx.fillRect(-6, -8, 12, 6)
    // Body
    ctx.fillStyle = '#888899'
    ctx.fillRect(-15, -3, 30, 6)
    // Lights
    const blink = Math.sin(f * 0.1)
    ctx.fillStyle = blink > 0 ? '#ff0000' : '#00ff00'
    ctx.fillRect(-12, 0, 3, 3)
    ctx.fillRect(9, 0, 3, 3)
    // Beam
    if (f % 60 < 30) {
      ctx.globalAlpha = 0.2
      ctx.fillStyle = '#aaffaa'
      ctx.fillRect(-8, 3, 16, 20)
      ctx.globalAlpha = 1
    }
  }

  _drawAstronaut(ctx, f) {
    // Helmet
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(-5, -10, 10, 10)
    // Visor
    ctx.fillStyle = '#4488ff'
    ctx.fillRect(-3, -7, 6, 4)
    // Body
    ctx.fillStyle = '#dddddd'
    ctx.fillRect(-6, 0, 12, 10)
    // Backpack
    ctx.fillStyle = '#888888'
    ctx.fillRect(-8, 1, 3, 8)
    // Legs float
    const legAngle = Math.sin(f * 0.05) * 3
    ctx.fillStyle = '#dddddd'
    ctx.fillRect(-4, 10, 3, 6 + legAngle)
    ctx.fillRect(1, 10, 3, 6 - legAngle)
  }

  _drawRocket(ctx, f) {
    // Body
    ctx.fillStyle = '#dddddd'
    ctx.fillRect(-5, -10, 10, 20)
    // Nose
    ctx.fillStyle = '#ff4444'
    ctx.fillRect(-3, -14, 6, 5)
    // Window
    ctx.fillStyle = '#4488ff'
    ctx.fillRect(-2, -5, 4, 4)
    // Fins
    ctx.fillStyle = '#ff4444'
    ctx.fillRect(-8, 6, 4, 6)
    ctx.fillRect(4, 6, 4, 6)
    // Flame
    ctx.fillStyle = '#ffaa00'
    ctx.fillRect(-4, 10, 8, 4 + Math.sin(f * 0.2) * 3)
    ctx.fillStyle = '#ff4400'
    ctx.fillRect(-2, 14, 4, 3 + Math.sin(f * 0.3) * 2)
  }

  _drawRobot(ctx, f) {
    // Head
    ctx.fillStyle = '#888899'
    ctx.fillRect(-6, -11, 12, 8)
    // Eyes
    const blink = Math.sin(f * 0.08)
    ctx.fillStyle = blink > 0 ? '#ff0000' : '#00ff00'
    ctx.fillRect(-4, -9, 3, 3)
    ctx.fillRect(1, -9, 3, 3)
    // Antenna
    ctx.fillStyle = '#ffdd44'
    ctx.fillRect(-1, -14, 2, 4)
    ctx.fillRect(-2, -15, 4, 2)
    // Body
    ctx.fillStyle = '#6666aa'
    ctx.fillRect(-7, -3, 14, 12)
    // Arms
    ctx.fillStyle = '#888899'
    ctx.fillRect(-10, -2, 4, 8)
    ctx.fillRect(6, -2, 4, 8)
    // Legs
    ctx.fillRect(-5, 9, 4, 5)
    ctx.fillRect(1, 9, 4, 5)
  }

  _drawBird(ctx, f) {
    const wingY = Math.sin(f * 0.2) * 5
    ctx.fillStyle = '#ffaa44'
    ctx.fillRect(-5, -2, 10, 5)
    // Wings
    ctx.fillStyle = '#cc7722'
    ctx.fillRect(-8, -5 + wingY, 8, 3)
    ctx.fillRect(0, -5 - wingY, 8, 3)
    // Beak
    ctx.fillStyle = '#ff6600'
    ctx.fillRect(5, 0, 4, 2)
    // Eye
    ctx.fillStyle = '#000000'
    ctx.fillRect(3, -1, 2, 2)
  }

  _drawBalloon(ctx) {
    // Balloon
    ctx.fillStyle = '#ff4488'
    ctx.fillRect(-6, -15, 12, 14)
    // Highlight
    ctx.fillStyle = '#ff88aa'
    ctx.fillRect(-3, -13, 4, 6)
    // String
    ctx.fillStyle = '#888888'
    ctx.fillRect(0, -1, 1, 10)
    // Basket
    ctx.fillStyle = '#8b5e3c'
    ctx.fillRect(-3, 9, 6, 4)
  }

  _drawWitch(ctx, f) {
    // Broom
    ctx.fillStyle = '#8b5e3c'
    ctx.fillRect(-15, 3, 30, 3)
    ctx.fillStyle = '#cc8833'
    ctx.fillRect(-18, 0, 6, 8)
    // Body
    ctx.fillStyle = '#2a1a4e'
    ctx.fillRect(-4, -8, 8, 12)
    // Hat
    ctx.fillStyle = '#2a1a4e'
    ctx.fillRect(-6, -14, 12, 6)
    ctx.fillRect(-3, -18, 6, 5)
    // Face
    ctx.fillStyle = '#88cc88'
    ctx.fillRect(-3, -10, 6, 4)
  }

  _drawAngel(ctx, f) {
    // Wings
    const wingSpread = Math.sin(f * 0.08) * 3
    ctx.fillStyle = '#ffffdd'
    ctx.fillRect(-14 - wingSpread, -8, 10, 12)
    ctx.fillRect(4 + wingSpread, -8, 10, 12)
    // Body
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(-4, -6, 8, 14)
    // Head
    ctx.fillStyle = '#ffddbb'
    ctx.fillRect(-3, -12, 6, 6)
    // Halo
    ctx.fillStyle = '#ffdd44'
    ctx.fillRect(-4, -15, 8, 2)
  }

  _drawPhoenix(ctx, f) {
    // Body
    ctx.fillStyle = '#ff6600'
    ctx.fillRect(-8, -4, 16, 8)
    // Wings
    const wingY = Math.sin(f * 0.12) * 6
    ctx.fillStyle = '#ffcc00'
    ctx.fillRect(-15, -10 + wingY, 12, 6)
    ctx.fillRect(3, -10 - wingY, 12, 6)
    // Tail flames
    ctx.fillStyle = '#ff4400'
    ctx.fillRect(-18, -2, 10, 4)
    ctx.fillStyle = '#ffaa00'
    ctx.fillRect(-22, -1, 6, 2)
    // Head
    ctx.fillStyle = '#ff8800'
    ctx.fillRect(8, -6, 8, 8)
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(12, -4, 3, 2)
  }

  _drawSatellite(ctx, f) {
    // Body
    ctx.fillStyle = '#aabbcc'
    ctx.fillRect(-4, -4, 8, 8)
    // Solar panels
    ctx.fillStyle = '#3355aa'
    ctx.fillRect(-16, -3, 12, 6)
    ctx.fillRect(4, -3, 12, 6)
    // Antenna
    ctx.fillStyle = '#cccccc'
    ctx.fillRect(-1, -7, 2, 4)
    // Blink
    if (Math.sin(f * 0.1) > 0.5) {
      ctx.fillStyle = '#ff0000'
      ctx.fillRect(-1, -8, 2, 2)
    }
  }

  _drawComet(ctx, f) {
    // Tail
    ctx.globalAlpha = 0.4
    ctx.fillStyle = '#aaddff'
    ctx.fillRect(-30, -2, 28, 4)
    ctx.globalAlpha = 0.2
    ctx.fillRect(-50, -1, 22, 2)
    ctx.globalAlpha = 1
    // Head
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(-3, -3, 6, 6)
    ctx.fillStyle = '#aaddff'
    ctx.fillRect(-2, -2, 4, 4)
  }
}
