// Weather system: rain, snow, hail, thunder, clouds, tornado, clear

const WEATHER_TYPES = ['clear', 'cloudy', 'rain', 'snow', 'hail', 'thunder', 'tornado']
const WEATHER_DURATION = 500 // floors per weather cycle
const WEATHER_TRANSITION = 50 // floors to blend

export class WeatherSystem {
  constructor() {
    this.particles = []
    this.currentWeather = 'clear'
    this.nextWeather = 'clear'
    this.lastChangeFloor = 0
    this.clouds = []
    this.thunderFlash = 0
    this.tornadoAngle = 0
    this._initClouds()
  }

  _initClouds() {
    this.clouds = []
    for (let i = 0; i < 6; i++) {
      this.clouds.push({
        x: Math.random() * 500,
        y: 20 + Math.random() * 80,
        w: 60 + Math.random() * 80,
        h: 20 + Math.random() * 15,
        speed: 0.1 + Math.random() * 0.3,
        opacity: 0.3 + Math.random() * 0.4,
      })
    }
  }

  update(floor, w, h, dt) {
    // Change weather every ~200 floors randomly
    if (floor - this.lastChangeFloor > 150 + Math.floor(Math.random() * 100)) {
      this.lastChangeFloor = floor
      this.currentWeather = WEATHER_TYPES[Math.floor(Math.random() * WEATHER_TYPES.length)]
    }

    // Spawn weather particles
    switch (this.currentWeather) {
      case 'rain':
        for (let i = 0; i < 5; i++) {
          this.particles.push({
            x: Math.random() * w, y: -5,
            vx: -1, vy: 8 + Math.random() * 6,
            life: 1, decay: 0.01,
            type: 'rain', size: 2 + Math.random() * 3,
          })
        }
        break
      case 'snow':
        if (Math.random() < 0.3) {
          this.particles.push({
            x: Math.random() * w, y: -5,
            vx: (Math.random() - 0.5) * 1.5,
            vy: 1 + Math.random() * 2,
            life: 1, decay: 0.003,
            type: 'snow', size: 2 + Math.random() * 4,
          })
        }
        break
      case 'hail':
        if (Math.random() < 0.15) {
          this.particles.push({
            x: Math.random() * w, y: -5,
            vx: (Math.random() - 0.5) * 2,
            vy: 6 + Math.random() * 8,
            life: 1, decay: 0.015,
            type: 'hail', size: 3 + Math.random() * 4,
          })
        }
        break
      case 'thunder':
        for (let i = 0; i < 4; i++) {
          this.particles.push({
            x: Math.random() * w, y: -5,
            vx: -2, vy: 10 + Math.random() * 8,
            life: 1, decay: 0.015,
            type: 'rain', size: 2 + Math.random() * 3,
          })
        }
        if (Math.random() < 0.005) {
          this.thunderFlash = 1
        }
        break
      case 'tornado':
        this.tornadoAngle += 0.05
        if (Math.random() < 0.5) {
          const cx = w * 0.5 + Math.sin(this.tornadoAngle) * 50
          this.particles.push({
            x: cx + (Math.random() - 0.5) * 40,
            y: h * 0.3 + Math.random() * h * 0.5,
            vx: Math.cos(this.tornadoAngle + Math.random()) * 4,
            vy: -2 - Math.random() * 3,
            life: 1, decay: 0.02,
            type: 'debris', size: 2 + Math.random() * 3,
          })
        }
        break
    }

    // Update clouds
    for (const c of this.clouds) {
      c.x += c.speed
      if (c.x > w + 100) c.x = -c.w
    }

    // Update particles
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i]
      p.x += p.vx
      p.y += p.vy
      p.life -= p.decay
      if (p.type === 'snow') p.vx += (Math.random() - 0.5) * 0.1
      if (p.life <= 0 || p.y > h + 10) {
        this.particles.splice(i, 1)
      }
    }

    // Thunder flash decay
    if (this.thunderFlash > 0) {
      this.thunderFlash -= 0.05
    }

    // Limit particles
    if (this.particles.length > 300) {
      this.particles.splice(0, this.particles.length - 300)
    }
  }

  draw(ctx, w, h) {
    const showClouds = ['cloudy', 'rain', 'thunder', 'snow', 'hail'].includes(this.currentWeather)

    // Clouds
    if (showClouds) {
      for (const c of this.clouds) {
        ctx.globalAlpha = c.opacity
        ctx.fillStyle = this.currentWeather === 'thunder' ? '#444466' : '#aabbcc'
        // Cloud shape using rectangles (pixel art)
        ctx.fillRect(c.x, c.y, c.w, c.h)
        ctx.fillRect(c.x + c.w * 0.1, c.y - c.h * 0.4, c.w * 0.5, c.h * 0.5)
        ctx.fillRect(c.x + c.w * 0.4, c.y - c.h * 0.6, c.w * 0.4, c.h * 0.6)
      }
      ctx.globalAlpha = 1
    }

    // Weather particles
    for (const p of this.particles) {
      ctx.globalAlpha = Math.max(0, p.life)
      switch (p.type) {
        case 'rain':
          ctx.fillStyle = '#aaccff'
          ctx.fillRect(p.x, p.y, 1, p.size)
          break
        case 'snow':
          ctx.fillStyle = '#ffffff'
          ctx.fillRect(p.x, p.y, p.size, p.size)
          break
        case 'hail':
          ctx.fillStyle = '#ccddee'
          ctx.fillRect(p.x, p.y, p.size, p.size)
          ctx.fillStyle = '#ffffff'
          ctx.fillRect(p.x + 1, p.y + 1, p.size * 0.4, p.size * 0.4)
          break
        case 'debris':
          ctx.fillStyle = ['#8b7355', '#556b2f', '#696969'][Math.floor(p.x) % 3]
          ctx.fillRect(p.x, p.y, p.size, p.size)
          break
      }
    }
    ctx.globalAlpha = 1

    // Thunder flash
    if (this.thunderFlash > 0) {
      ctx.globalAlpha = this.thunderFlash * 0.6
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(0, 0, w, h)
      ctx.globalAlpha = 1

      // Lightning bolt
      if (this.thunderFlash > 0.5) {
        ctx.strokeStyle = '#ffff88'
        ctx.lineWidth = 2
        ctx.beginPath()
        let lx = w * 0.3 + Math.random() * w * 0.4
        let ly = 0
        ctx.moveTo(lx, ly)
        for (let i = 0; i < 8; i++) {
          lx += (Math.random() - 0.5) * 30
          ly += h / 8
          ctx.lineTo(lx, ly)
        }
        ctx.stroke()
      }
    }

    // Tornado funnel
    if (this.currentWeather === 'tornado') {
      ctx.globalAlpha = 0.3
      ctx.fillStyle = '#555566'
      const cx = w * 0.5 + Math.sin(this.tornadoAngle) * 50
      for (let i = 0; i < 10; i++) {
        const tw = 10 + i * 8
        const ty = h * 0.15 + i * (h * 0.06)
        ctx.fillRect(cx - tw / 2, ty, tw, 6)
      }
      ctx.globalAlpha = 1
    }
  }

  getDayTint(floor) {
    // Day cycle: 0-100 morning, 100-200 noon, 200-300 afternoon,
    //            300-400 sunset, 400-500 night, repeats
    const cycle = floor % 500
    if (cycle < 100) return { r: 255, g: 200, b: 150, a: 0.05 } // morning warm
    if (cycle < 200) return { r: 255, g: 255, b: 240, a: 0.03 } // noon bright
    if (cycle < 300) return { r: 255, g: 180, b: 100, a: 0.08 } // afternoon orange
    if (cycle < 400) return { r: 200, g: 100, b: 50, a: 0.12 }  // sunset
    return { r: 20, g: 20, b: 60, a: 0.15 }                      // night
  }
}
