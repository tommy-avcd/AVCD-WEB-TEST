// Background themes, landmarks, stair themes, flying characters

const THEMES = [
  { floor: 0, sky: ['#1a1a3e', '#2a2a5e', '#3a3a7e'] },
  { floor: 100, sky: ['#1a0a2e', '#3a1a4e', '#5a2a6e'] },
  { floor: 200, sky: ['#0a1a2e', '#1a3a5e', '#2a5a7e'] },
  { floor: 300, sky: ['#2e1a0a', '#5e3a1a', '#8e5a2a'] },
  { floor: 400, sky: ['#0a2e1a', '#1a5e3a', '#2a7e5a'] },
  { floor: 500, sky: ['#2e0a1a', '#5e1a3a', '#7e2a4a'] },
  { floor: 600, sky: ['#1a1a1a', '#2a2a3a', '#3a3a5a'] },
  { floor: 700, sky: ['#0a0a3e', '#1a1a6e', '#3a3aae'] },
  { floor: 800, sky: ['#3e1a1a', '#6e2a1a', '#ae4a1a'] },
  { floor: 900, sky: ['#1a2e3e', '#2a4e6e', '#4a7eae'] },
  { floor: 1000, sky: ['#0a0a0a', '#1a1a2a', '#2a2a4a'] },
  { floor: 1100, sky: ['#2e2e0a', '#4e4e1a', '#7e7e2a'] },
  { floor: 1200, sky: ['#0a2e2e', '#1a4e4e', '#2a6e6e'] },
  { floor: 1300, sky: ['#2e0a2e', '#4e1a4e', '#7e2a7e'] },
  { floor: 1400, sky: ['#1a0a0a', '#3e1a0a', '#6e3a1a'] },
  { floor: 1500, sky: ['#0a0a1a', '#0a0a3a', '#1a1a6a'] },
  { floor: 1600, sky: ['#2e1a2e', '#4e3a4e', '#7e5a7e'] },
  { floor: 1700, sky: ['#1a2e0a', '#3a5e1a', '#5a8e2a'] },
  { floor: 1800, sky: ['#3e2e1a', '#6e4e2a', '#ae7e3a'] },
  { floor: 1900, sky: ['#0a1a3e', '#1a3a6e', '#2a5aae'] },
  { floor: 2000, sky: ['#000000', '#0a0a1a', '#1a1a3a'] },
]

// Country landmarks drawn as pixel art silhouettes
const LANDMARKS = [
  { floor: 100, name: 'Torii Gate', color: '#cc0000', draw: (ctx) => {
    ctx.fillRect(-20, -40, 4, 40); ctx.fillRect(16, -40, 4, 40)
    ctx.fillRect(-25, -42, 50, 5); ctx.fillRect(-22, -32, 44, 3)
  }},
  { floor: 200, name: 'Big Ben', color: '#ddbb77', draw: (ctx) => {
    ctx.fillRect(-8, -70, 16, 70); ctx.fillRect(-12, -75, 24, 8)
    ctx.fillRect(-6, -80, 12, 6); ctx.fillRect(-3, -85, 6, 6)
    ctx.fillStyle = '#8899aa'; ctx.fillRect(-4, -60, 8, 8)
  }},
  { floor: 300, name: 'Taj Mahal', color: '#ffffff', draw: (ctx) => {
    ctx.fillRect(-20, -30, 40, 30); ctx.fillRect(-10, -50, 20, 22)
    ctx.beginPath(); ctx.arc(0, -50, 10, Math.PI, 0); ctx.fill()
    ctx.fillRect(-25, -30, 4, 30); ctx.fillRect(21, -30, 4, 30)
  }},
  { floor: 400, name: 'Colosseum', color: '#cc9966', draw: (ctx) => {
    ctx.fillRect(-30, -25, 60, 25)
    for (let i = 0; i < 6; i++) ctx.clearRect(-26 + i * 10, -20, 6, 12)
    ctx.fillRect(-30, -28, 60, 4)
  }},
  { floor: 500, name: 'Eiffel Tower', color: '#887766', draw: (ctx) => {
    ctx.fillRect(-2, -80, 4, 80); ctx.fillRect(-15, -15, 30, 4)
    ctx.fillRect(-10, -40, 20, 3); ctx.fillRect(-20, 0, 8, 4)
    ctx.fillRect(12, 0, 8, 4)
    ctx.beginPath(); ctx.moveTo(-20, 0); ctx.lineTo(-2, -65); ctx.lineTo(-2, 0); ctx.fill()
    ctx.beginPath(); ctx.moveTo(20, 0); ctx.lineTo(2, -65); ctx.lineTo(2, 0); ctx.fill()
  }},
  { floor: 600, name: 'Sagrada Familia', color: '#ddaa66', draw: (ctx) => {
    ctx.fillRect(-20, -40, 40, 40)
    ctx.fillRect(-18, -55, 8, 18); ctx.fillRect(-4, -60, 8, 22); ctx.fillRect(10, -55, 8, 18)
    ctx.fillRect(-2, -65, 4, 8)
  }},
  { floor: 700, name: 'Windmill', color: '#cc6633', draw: (ctx) => {
    ctx.fillRect(-8, -35, 16, 35)
    ctx.fillStyle = '#dddddd'
    ctx.save(); ctx.rotate(0.3)
    ctx.fillRect(-2, -35, 4, -25); ctx.fillRect(-2, -35, 4, 25)
    ctx.restore(); ctx.save(); ctx.rotate(1.87)
    ctx.fillRect(-2, -35, 4, -25); ctx.fillRect(-2, -35, 4, 25)
    ctx.restore()
  }},
  { floor: 800, name: 'Gyeongbokgung', color: '#33aa66', draw: (ctx) => {
    ctx.fillRect(-25, -15, 50, 15); ctx.fillStyle = '#225544'
    ctx.fillRect(-28, -20, 56, 8)
    ctx.beginPath(); ctx.moveTo(-30, -18); ctx.lineTo(0, -30); ctx.lineTo(30, -18); ctx.fill()
    ctx.fillStyle = '#cc4444'; ctx.fillRect(-20, -8, 40, 3)
  }},
  { floor: 900, name: 'Mermaid', color: '#448866', draw: (ctx) => {
    ctx.fillRect(-6, -30, 12, 20); ctx.fillRect(-3, -35, 6, 6)
    ctx.fillStyle = '#88ccaa'; ctx.fillRect(-8, -10, 16, 10)
  }},
  { floor: 1000, name: 'Christ Redeemer', color: '#dddddd', draw: (ctx) => {
    ctx.fillRect(-3, -50, 6, 50); ctx.fillRect(-25, -45, 50, 5)
    ctx.fillRect(-4, -55, 8, 8)
  }},
]

// Stair color themes per 100 floors
const STAIR_THEMES = [
  { floor: 0, light: '#c8b89a', mid: '#a89070', dark: '#7a6048', edge: '#5a4030', name: 'Stone' },
  { floor: 100, light: '#cc8888', mid: '#aa5555', dark: '#883333', edge: '#661111', name: 'Red Brick' },
  { floor: 200, light: '#8888cc', mid: '#5555aa', dark: '#333388', edge: '#111166', name: 'Blue Marble' },
  { floor: 300, light: '#ccaa66', mid: '#aa8844', dark: '#886633', edge: '#664411', name: 'Sandstone' },
  { floor: 400, light: '#88cc88', mid: '#55aa55', dark: '#338833', edge: '#116611', name: 'Jade' },
  { floor: 500, light: '#dddddd', mid: '#bbbbbb', dark: '#888888', edge: '#666666', name: 'Marble' },
  { floor: 600, light: '#ffcc88', mid: '#ddaa66', dark: '#bb8844', edge: '#996622', name: 'Gold' },
  { floor: 700, light: '#ff8888', mid: '#dd5555', dark: '#bb3333', edge: '#991111', name: 'Ruby' },
  { floor: 800, light: '#88ddff', mid: '#55bbdd', dark: '#3399bb', edge: '#117799', name: 'Crystal' },
  { floor: 900, light: '#aaddaa', mid: '#88bb88', dark: '#669966', edge: '#447744', name: 'Moss' },
  { floor: 1000, light: '#222233', mid: '#111122', dark: '#000011', edge: '#ffdd44', name: 'Obsidian' },
  { floor: 1100, light: '#ffddaa', mid: '#eebb88', dark: '#cc9966', edge: '#aa7744', name: 'Terracotta' },
  { floor: 1200, light: '#ddaaff', mid: '#bb88dd', dark: '#9966bb', edge: '#774499', name: 'Amethyst' },
  { floor: 1300, light: '#aaffaa', mid: '#88dd88', dark: '#66bb66', edge: '#449944', name: 'Emerald' },
  { floor: 1400, light: '#ffaaaa', mid: '#dd8888', dark: '#bb6666', edge: '#994444', name: 'Rose Quartz' },
  { floor: 1500, light: '#aaccff', mid: '#88aadd', dark: '#6688bb', edge: '#446699', name: 'Sapphire' },
]

// Country treasure items
const COUNTRY_ITEMS = [
  { floor: 100, country: 'Japan', item: 'Katana', icon: '#cc0000', shape: 'sword' },
  { floor: 200, country: 'UK', item: 'Crown', icon: '#ffdd44', shape: 'crown' },
  { floor: 300, country: 'India', item: 'Lotus', icon: '#ff88aa', shape: 'flower' },
  { floor: 400, country: 'Italy', item: 'Pizza', icon: '#ffaa44', shape: 'circle' },
  { floor: 500, country: 'France', item: 'Baguette', icon: '#ddaa66', shape: 'rect' },
  { floor: 600, country: 'Spain', item: 'Fan', icon: '#cc0000', shape: 'fan' },
  { floor: 700, country: 'Netherlands', item: 'Tulip', icon: '#ff4488', shape: 'flower' },
  { floor: 800, country: 'Korea', item: 'Hanbok', icon: '#ff6688', shape: 'rect' },
  { floor: 900, country: 'Denmark', item: 'Viking Helm', icon: '#888899', shape: 'crown' },
  { floor: 1000, country: 'Portugal', item: 'Compass', icon: '#ffdd44', shape: 'circle' },
  { floor: 1100, country: 'Brazil', item: 'Samba Drum', icon: '#ffaa00', shape: 'circle' },
  { floor: 1200, country: 'Germany', item: 'Pretzel', icon: '#cc8844', shape: 'circle' },
  { floor: 1300, country: 'Mexico', item: 'Sombrero', icon: '#ffdd44', shape: 'crown' },
  { floor: 1400, country: 'China', item: 'Dragon Pearl', icon: '#44ddaa', shape: 'circle' },
  { floor: 1500, country: 'Russia', item: 'Matryoshka', icon: '#ff4444', shape: 'rect' },
]

const BG_CHARACTERS = [
  { type: 'dragon', minFloor: 100 },
  { type: 'ufo', minFloor: 300 },
  { type: 'astronaut', minFloor: 500 },
  { type: 'rocket', minFloor: 700 },
  { type: 'robot', minFloor: 900 },
  { type: 'bird', minFloor: 0 },
  { type: 'balloon', minFloor: 200 },
  { type: 'witch', minFloor: 600 },
  { type: 'angel', minFloor: 1000 },
  { type: 'phoenix', minFloor: 1500 },
  { type: 'satellite', minFloor: 800 },
  { type: 'comet', minFloor: 1200 },
]

export class BackgroundTheme {
  constructor() {
    this.flyingObjects = []
    this.lastSpawnFloor = 0
    this.landmarks = []
    this.activeTreasure = null
    this.treasureCollected = new Set()
    this.treasureOpenAnim = 0
  }

  getTheme(floor) {
    let theme = THEMES[0]
    for (const t of THEMES) {
      if (floor >= t.floor) theme = t
      else break
    }
    if (floor >= 2100) {
      const idx = Math.floor((floor - 2100) / 100) % THEMES.length
      theme = THEMES[idx]
    }
    return theme
  }

  getStairTheme(floor) {
    let theme = STAIR_THEMES[0]
    for (const t of STAIR_THEMES) {
      if (floor >= t.floor) theme = t
      else break
    }
    if (floor >= 1600) {
      const idx = Math.floor((floor - 1600) / 100) % STAIR_THEMES.length
      theme = STAIR_THEMES[idx]
    }
    return theme
  }

  getTreasureForFloor(floor) {
    for (const item of COUNTRY_ITEMS) {
      if (floor === item.floor && !this.treasureCollected.has(item.floor)) {
        return item
      }
    }
    // Cycle after defined items
    if (floor % 100 === 0 && floor > 1500 && !this.treasureCollected.has(floor)) {
      const idx = Math.floor(floor / 100) % COUNTRY_ITEMS.length
      return { ...COUNTRY_ITEMS[idx], floor }
    }
    return null
  }

  collectTreasure(floor) {
    this.treasureCollected.add(floor)
    this.activeTreasure = this.getTreasureForFloor(floor)
    if (this.activeTreasure) {
      this.activeTreasure = { ...this.activeTreasure, floor }
      this.treasureOpenAnim = 1
    }
    return this.activeTreasure
  }

  update(floor, w, h, dt) {
    // Spawn flying objects every 20 floors
    if (floor - this.lastSpawnFloor >= 20 && floor > 50) {
      this.lastSpawnFloor = floor
      const available = BG_CHARACTERS.filter(c => floor >= c.minFloor)
      if (available.length > 0) {
        const charType = available[Math.floor(Math.random() * available.length)]
        this.flyingObjects.push({
          type: charType.type,
          x: -50, y: Math.random() * h * 0.5 + 20,
          vx: 0.3 + Math.random() * 0.8,
          vy: 0, phase: Math.random() * Math.PI * 2,
          scale: 0.8 + Math.random() * 0.6,
        })
      }
    }

    for (let i = this.flyingObjects.length - 1; i >= 0; i--) {
      const obj = this.flyingObjects[i]
      obj.x += obj.vx
      obj.y += Math.sin(obj.phase) * 0.3
      obj.phase += 0.02
      if (obj.x > w + 100) this.flyingObjects.splice(i, 1)
    }

    // Treasure animation
    if (this.treasureOpenAnim > 0) {
      this.treasureOpenAnim -= 0.01
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
      if (Math.sin(globalFrame * 0.05 + i) > 0.3) {
        ctx.fillRect(sx, sy, (i % 3 === 0) ? 2 : 1, (i % 3 === 0) ? 2 : 1)
      }
    }
  }

  drawLandmarks(ctx, w, h, cameraY, floor) {
    // Find the closest landmark to display (within 200 floors)
    let activeLM = null
    for (const lm of LANDMARKS) {
      if (floor >= lm.floor - 50 && floor < lm.floor + 200) {
        activeLM = lm
      }
    }
    // Cycle landmarks after defined ones
    if (!activeLM && floor > 1000) {
      const idx = Math.floor(floor / 100) % LANDMARKS.length
      const lm = LANDMARKS[idx]
      if (floor % 100 < 200) activeLM = lm
    }
    if (!activeLM) return

    // Parallax scroll: landmark slowly moves down as player climbs
    const progress = (floor - activeLM.floor + 50) / 250 // 0 to 1
    const slideY = progress * h * 0.6 // slides from top to below screen

    // Draw landmark on LEFT side, large scale, like the buildings
    const scale = 3.5
    const baseX = w * 0.18
    const baseY = h * 0.75 + slideY

    ctx.save()
    ctx.translate(baseX, baseY)
    ctx.scale(scale, scale)
    ctx.globalAlpha = 0.6
    ctx.fillStyle = activeLM.color
    activeLM.draw(ctx)
    ctx.globalAlpha = 1
    ctx.restore()

    // Also draw a mirrored/smaller one on RIGHT side
    const scale2 = 2.5
    const baseX2 = w * 0.85
    const baseY2 = h * 0.8 + slideY * 0.8

    ctx.save()
    ctx.translate(baseX2, baseY2)
    ctx.scale(scale2, scale2)
    ctx.globalAlpha = 0.4
    ctx.fillStyle = activeLM.color
    activeLM.draw(ctx)
    ctx.globalAlpha = 1
    ctx.restore()

    // Country name label at bottom
    if (progress > 0 && progress < 0.8) {
      ctx.globalAlpha = Math.min(1, (0.8 - progress) * 3)
      ctx.fillStyle = 'rgba(0,0,0,0.5)'
      ctx.fillRect(0, h - 30, w, 30)
      ctx.fillStyle = activeLM.color
      ctx.font = 'bold 12px monospace'
      ctx.textAlign = 'center'
      ctx.fillText(activeLM.name, w / 2, h - 10)
      ctx.globalAlpha = 1
    }
  }

  drawTreasureNotification(ctx, w, h) {
    if (this.treasureOpenAnim <= 0 || !this.activeTreasure) return

    const t = this.activeTreasure
    const alpha = Math.min(this.treasureOpenAnim * 2, 1)
    ctx.globalAlpha = alpha

    // Background overlay
    ctx.fillStyle = 'rgba(0,0,0,0.5)'
    ctx.fillRect(w * 0.1, h * 0.3, w * 0.8, h * 0.15)

    // Treasure chest
    ctx.fillStyle = '#aa7722'
    ctx.fillRect(w * 0.42, h * 0.32, w * 0.16, h * 0.05)
    ctx.fillStyle = '#ffdd44'
    ctx.fillRect(w * 0.47, h * 0.33, w * 0.06, h * 0.03)

    // Item text
    ctx.fillStyle = '#ffffff'
    ctx.font = 'bold 12px monospace'
    ctx.textAlign = 'center'
    ctx.fillText(`${t.country}: ${t.item}`, w / 2, h * 0.42)
    ctx.fillStyle = t.icon
    ctx.fillRect(w / 2 - 6, h * 0.355, 12, 12)

    ctx.globalAlpha = 1
  }

  drawFlyingObjects(ctx, globalFrame) {
    for (const obj of this.flyingObjects) {
      ctx.save()
      ctx.translate(obj.x, obj.y)
      ctx.scale(obj.scale, obj.scale)
      ctx.globalAlpha = 0.7
      this._drawChar(ctx, obj.type, globalFrame)
      ctx.globalAlpha = 1
      ctx.restore()
    }
  }

  _drawChar(ctx, type, f) {
    switch (type) {
      case 'dragon': {
        ctx.fillStyle = '#44cc44'
        ctx.fillRect(-15, -5, 30, 10)
        ctx.fillStyle = '#33aa33'; ctx.fillRect(15, -8, 10, 12)
        ctx.fillStyle = '#ff0000'; ctx.fillRect(20, -5, 3, 3)
        const wy = Math.sin(f * 0.15) * 5
        ctx.fillStyle = '#228822'
        ctx.fillRect(-5, -12 + wy, 15, 5); ctx.fillRect(-5, 7 - wy, 15, 5)
        if (f % 30 < 15) { ctx.fillStyle = '#ff6600'; ctx.fillRect(25, -4, 8, 3) }
        break
      }
      case 'ufo': {
        ctx.fillStyle = '#aaddff'; ctx.fillRect(-6, -8, 12, 6)
        ctx.fillStyle = '#888899'; ctx.fillRect(-15, -3, 30, 6)
        ctx.fillStyle = Math.sin(f * 0.1) > 0 ? '#ff0000' : '#00ff00'
        ctx.fillRect(-12, 0, 3, 3); ctx.fillRect(9, 0, 3, 3)
        break
      }
      case 'astronaut': {
        ctx.fillStyle = '#ffffff'; ctx.fillRect(-5, -10, 10, 10)
        ctx.fillStyle = '#4488ff'; ctx.fillRect(-3, -7, 6, 4)
        ctx.fillStyle = '#dddddd'; ctx.fillRect(-6, 0, 12, 10)
        break
      }
      case 'rocket': {
        ctx.fillStyle = '#dddddd'; ctx.fillRect(-5, -10, 10, 20)
        ctx.fillStyle = '#ff4444'; ctx.fillRect(-3, -14, 6, 5)
        ctx.fillStyle = '#ffaa00'; ctx.fillRect(-4, 10, 8, 4 + Math.sin(f * 0.2) * 3)
        break
      }
      case 'robot': {
        ctx.fillStyle = '#888899'; ctx.fillRect(-6, -11, 12, 8)
        ctx.fillStyle = '#6666aa'; ctx.fillRect(-7, -3, 14, 12)
        ctx.fillStyle = Math.sin(f * 0.08) > 0 ? '#ff0000' : '#00ff00'
        ctx.fillRect(-4, -9, 3, 3); ctx.fillRect(1, -9, 3, 3)
        break
      }
      case 'bird': {
        const wy2 = Math.sin(f * 0.2) * 5
        ctx.fillStyle = '#ffaa44'; ctx.fillRect(-5, -2, 10, 5)
        ctx.fillStyle = '#cc7722'
        ctx.fillRect(-8, -5 + wy2, 8, 3); ctx.fillRect(0, -5 - wy2, 8, 3)
        break
      }
      case 'balloon': {
        ctx.fillStyle = '#ff4488'; ctx.fillRect(-6, -15, 12, 14)
        ctx.fillStyle = '#888888'; ctx.fillRect(0, -1, 1, 10)
        ctx.fillStyle = '#8b5e3c'; ctx.fillRect(-3, 9, 6, 4)
        break
      }
      case 'witch': {
        ctx.fillStyle = '#8b5e3c'; ctx.fillRect(-15, 3, 30, 3)
        ctx.fillStyle = '#2a1a4e'; ctx.fillRect(-4, -8, 8, 12)
        ctx.fillRect(-6, -14, 12, 6); ctx.fillRect(-3, -18, 6, 5)
        break
      }
      case 'angel': {
        const ws = Math.sin(f * 0.08) * 3
        ctx.fillStyle = '#ffffdd'
        ctx.fillRect(-14 - ws, -8, 10, 12); ctx.fillRect(4 + ws, -8, 10, 12)
        ctx.fillStyle = '#ffffff'; ctx.fillRect(-4, -6, 8, 14)
        ctx.fillStyle = '#ffdd44'; ctx.fillRect(-4, -15, 8, 2)
        break
      }
      case 'phoenix': {
        ctx.fillStyle = '#ff6600'; ctx.fillRect(-8, -4, 16, 8)
        const wy3 = Math.sin(f * 0.12) * 6
        ctx.fillStyle = '#ffcc00'
        ctx.fillRect(-15, -10 + wy3, 12, 6); ctx.fillRect(3, -10 - wy3, 12, 6)
        ctx.fillStyle = '#ff4400'; ctx.fillRect(-18, -2, 10, 4)
        break
      }
      case 'satellite': {
        ctx.fillStyle = '#aabbcc'; ctx.fillRect(-4, -4, 8, 8)
        ctx.fillStyle = '#3355aa'; ctx.fillRect(-16, -3, 12, 6); ctx.fillRect(4, -3, 12, 6)
        break
      }
      case 'comet': {
        ctx.globalAlpha = 0.4; ctx.fillStyle = '#aaddff'; ctx.fillRect(-30, -2, 28, 4)
        ctx.globalAlpha = 0.7; ctx.fillStyle = '#ffffff'; ctx.fillRect(-3, -3, 6, 6)
        break
      }
    }
  }
}

export { STAIR_THEMES, COUNTRY_ITEMS, LANDMARKS }
